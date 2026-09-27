// Source unique de vérité pour les couleurs de l'app.
// Ne jamais coder une couleur en dur dans un écran — importer ces tokens.

export const colors = {
  // Couleurs de marque — utilisées franchement, pas en petites touches
  primary: '#0F5C56',      // Émeraude profond — actions principales, en-têtes, contrat/vérification
  primarySoft: '#DCEAE8',  // Fond des zones liées au primaire (badges, sélections actives)
  seal: '#B35C36',         // Cuivre chaud — photos, avis, catégorie Garde d'enfants, moments humains
  sealSoft: '#F3E1D6',     // Fond des éléments liés au cuivre

  // Fonctionnelles — jamais utilisées ailleurs que pour leur rôle précis
  success: '#2F7D5C',      // Confirmé / payé uniquement
  error: '#C4453A',        // Erreurs / échecs de paiement uniquement

  // Neutres
  background: '#F3F1EA',
  surface: '#FFFFFF',
  ink: '#1B2420',
  inkSoft: '#5C665F',
  line: '#DFDACB',
};

export default colors;
