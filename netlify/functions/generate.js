// Cette fonction tourne côté serveur (jamais dans le navigateur).
// Elle seule connaît la clé API — le consultant qui utilise l'outil ne la voit jamais.

const SYSTEM_PROMPT = `Tu es un moteur d'extraction et de normalisation de données projets pour un cabinet de conseil.
On te donne des données brutes sur un ou plusieurs projets, dans n'importe quel format (notes, tableaux collés, exports Jira/Monday/Asana/Notion, emails, comptes-rendus, mélange de tout).

Ta seule tâche : restituer ces données sous forme de JSON structuré, sans aucun texte autour, sans balises markdown, sans \`\`\`json.

RÈGLES :
- N'invente jamais une donnée absente. Si un champ n'est pas mentionné, utilise exactement la chaîne "Non renseigné".
- Convertis chaque statut en code RAG : "r" (rouge : bloqué, critique, retard, dépassement grave), "o" (orange : risque, tension, vigilance, ou statut absent/ambigu), "v" (vert : on track, dans les clous, conforme). Si un statut RAG explicite est fourni dans les données, utilise-le tel quel.
- pct (avancement) et financier.pct : nombres entiers (0-100) si disponibles, sinon null. N'arrondis pas à des dizaines artificiellement, garde le chiffre donné.
- jalonWarn : true si un jalon est mentionné à échéance ≤ 14 jours à partir de la période fournie, ou déjà dépassé.
- financier.alert : true si un dépassement budgétaire est mentionné.
- synthese : 2 phrases maximum, factuel, sans opinion, sans style.
- codirSynth : 3 à 5 phrases, factuel, orienté décision (ce qui bloque, ce qu'il faut arbitrer).
- Si deux informations fournies se contredisent, garde les deux et préfixe la valeur concernée par "⚠ CONTRADICTION : ".
- alertes : uniquement les alertes réellement détectées dans les données (dégradation critique, dépassement budgétaire, jalon imminent/dépassé, blocage non résolu, risque critique/élevé). Si aucune, renvoie un tableau vide. Formate chaque alerte ainsi : "[Nom du projet — type] texte de l'alerte".
- decisions : uniquement les décisions qui appellent un arbitrage explicite. Si aucune, renvoie un tableau vide.
- Ne calcule aucune moyenne ni aucun total global : ce calcul est fait ailleurs, à partir de tes données projet par projet.

FORMAT DE SORTIE ATTENDU (JSON STRICT, AUCUN AUTRE TEXTE AVANT/APRÈS) :
{
  "projects": [
    {
      "nom": string, "resp": string, "rag": "r"|"o"|"v", "pct": number|null,
      "phase": string, "jalon": string, "jalonWarn": boolean,
      "synthese": string, "codirSynth": string,
      "financier": {"alloueK": number|null, "consommeK": number|null, "pct": number|null, "ecart": string, "prevision": string, "alert": boolean},
      "risques": {"risques": string[], "problemes": string[], "deps": string[]},
      "livrables": {"faits": string[], "avenir": string[], "actions": [{"txt": string, "resp": string}]}
    }
  ],
  "alertes": string[],
  "decisions": string[]
}

Note : "alloueK" et "consommeK" sont des montants en milliers d'euros (nombre pur, sans "k€"). Mets null si non renseigné.`;

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Méthode non autorisée" };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: "JSON invalide dans la requête." };
  }

  const { client, mission, date, rawText } = payload;

  if (!client || !mission || !date || !rawText || !rawText.trim()) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Client, mission, date et données brutes sont tous obligatoires." }),
    };
  }

  const userMessage = `Client : ${client}\nMission : ${mission}\nPériode : ${date}\n\nDonnées brutes à traiter :\n${rawText}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return { statusCode: 502, body: JSON.stringify({ error: "Erreur API Claude : " + errText }) };
    }

    const data = await response.json();
    const textBlock = (data.content || []).find((b) => b.type === "text");
    if (!textBlock) {
      return { statusCode: 502, body: JSON.stringify({ error: "Réponse vide du modèle." }) };
    }

    // Sécurité : on retire d'éventuelles balises ```json au cas où le modèle en ajoute.
    const cleaned = textBlock.text.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      return { statusCode: 502, body: JSON.stringify({ error: "Le modèle n'a pas renvoyé un JSON valide.", raw: cleaned }) };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client, mission, date, ...parsed }),
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
