# Agent Reporting Multiprojet — version codée

Ce dossier contient une petite application web qui fait ce que je faisais pour toi dans le chat : tu colles des données projets brutes, elle appelle l'API Claude en arrière-plan et affiche un rapport de pilotage (Vue COPIL + fiches projets).

## Comment ça marche (vue d'ensemble)

```
Consultant ouvre index.html dans son navigateur
        │  colle ses données + clique "Générer"
        ▼
netlify/functions/generate.js   (tourne côté serveur, sur Netlify)
        │  appelle l'API Claude avec la clé secrète (jamais visible du navigateur)
        ▼
Claude renvoie un JSON structuré
        │
        ▼
index.html affiche le rapport (calculs de moyenne/budget faits en JavaScript, pas par l'IA)
```

- **VS Code** = l'endroit où tu écris/modifies ce code. Ce n'est pas un hébergeur.
- **Netlify** = l'endroit où le site vit une fois en ligne, accessible par une URL que tu partages aux consultants.
- **GitHub** = l'endroit où le code est stocké et versionné ; Netlify se branche dessus pour republier automatiquement à chaque modification.

## Étape 1 — Ouvrir le projet dans VS Code

1. Installe [VS Code](https://code.visualstudio.com/) si ce n'est pas déjà fait.
2. Ouvre ce dossier (`reporting-app`) avec `Fichier > Ouvrir le dossier`.
3. Tu peux modifier `index.html` (l'affichage) et `netlify/functions/generate.js` (les règles données à l'IA) directement ici.

## Étape 2 — Mettre le code sur GitHub

1. Crée un compte sur [github.com](https://github.com) si besoin.
2. Crée un nouveau dépôt (bouton vert "New").
3. Dans VS Code, ouvre le terminal intégré (`Terminal > Nouveau terminal`) et tape :
   ```bash
   git init
   git add .
   git commit -m "Premier version de l'outil"
   git branch -M main
   git remote add origin https://github.com/TON-COMPTE/TON-DEPOT.git
   git push -u origin main
   ```

## Étape 3 — Déployer sur Netlify

1. Crée un compte sur [netlify.com](https://netlify.com) (gratuit).
2. "Add new site" → "Import an existing project" → connecte ton compte GitHub → sélectionne le dépôt.
3. Netlify détecte automatiquement `netlify.toml`. Laisse les réglages par défaut et clique "Deploy".
4. Une fois déployé, va dans **Site configuration > Environment variables** et ajoute :
   - `ANTHROPIC_API_KEY` = ta clé API Anthropic (obtenue sur [console.anthropic.com](https://console.anthropic.com))
5. Redéploie le site une fois la clé ajoutée (bouton "Trigger deploy").
6. Tu obtiens une URL du type `https://ton-outil.netlify.app` — c'est celle-là que tu partages aux consultants.

## Étape 4 — Tester en local avant de déployer (optionnel mais conseillé)

```bash
npm install -g netlify-cli
netlify dev
```
Cela lance le site en local (avec les fonctions serverless actives) sur `http://localhost:8888`. Crée un fichier `.env` à la racine avec `ANTHROPIC_API_KEY=ta_cle` pour que ça fonctionne en local aussi. Ne mets jamais ce fichier `.env` sur GitHub (ajoute-le à un fichier `.gitignore`).

## Ce que tu peux modifier facilement

- **Le style visuel** : dans `index.html`, tout est dans la balise `<style>` en haut du fichier (couleurs, tailles).
- **Les règles d'extraction/RAG/alertes** : dans `netlify/functions/generate.js`, la constante `SYSTEM_PROMPT` — c'est l'équivalent du prompt que tu utilisais avec moi dans le chat.
- **Les champs affichés dans les fiches projet** : dans `index.html`, la fonction `renderReport`.

## Limites actuelles (à améliorer plus tard si besoin)

- Pas de sauvegarde des rapports générés (rien n'est stocké — recharger la page efface tout).
- Pas d'authentification : toute personne avec l'URL peut générer un rapport et consommer ta clé API. Pour un usage cabinet, pense à activer une protection d'accès Netlify (Identity, ou mot de passe sur les plans payants) une fois le prototype validé.
- Un seul niveau de lecture affiché à la fois (pas d'onglets multiples) — volontairement simplifié pour rester lisible à un débutant.
