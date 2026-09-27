# Khedma f'Dar

App de mise en relation pour services à la personne au Maroc (garde d'enfants,
aide aux personnes âgées, ménage) — lancement Ménage à Rabat.

## Démarrage

```bash
npm install
npx expo start
```

Scanner le QR code avec l'app **Expo Go** sur ton téléphone (même Wi-Fi que
l'ordinateur).

## Avant de coder avec Claude Code

1. Lis `CLAUDE.md` — il résume toutes les décisions déjà prises (positionnement,
   stack, ordre de développement).
2. Lis `specs-ecrans-claude-code.md` pour le détail de chaque écran (composants,
   données Firestore, navigation).
3. Remplis `src/firebase/config.js` avec les clés de ton projet Firebase
   (à créer sur https://console.firebase.google.com).

## Ce qui est déjà codé

- `src/theme/` — couleurs et typographie (ne jamais coder une couleur en dur ailleurs)
- `src/components/` — Badge de vérification, bouton CTA, carte prestataire
- `src/screens/family/LoginScreen.js` — connexion OTP (logique Firebase en commentaire, à activer une fois le SDK installé)
- `src/screens/family/HomeScreen.js` — accueil/recherche avec données d'exemple
- `src/navigation/AppNavigator.js` — squelette de navigation, à compléter écran par écran

## Prochaine étape suggérée

Demander à Claude Code : *"Ajoute l'écran ProfileSetup (création de profil
famille) en suivant le style de HomeScreen.js et la spec de l'écran 2 dans
specs-ecrans-claude-code.md"* — puis avancer écran par écran dans l'ordre
recommandé dans CLAUDE.md.
