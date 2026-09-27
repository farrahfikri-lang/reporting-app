# Khedma f'Dar — Contexte projet pour Claude Code

Lis ce fichier avant toute tâche. Il résume les décisions déjà prises — ne les remets pas en question sans le signaler explicitement à l'utilisateur.

## Le produit

App marocaine de mise en relation pour 3 catégories de services à domicile :
garde d'enfants, aide aux personnes âgées, ménage. Lancement : catégorie
**Ménage**, ville **Rabat**, ciblée sur les familles qui n'ont pas de réseau
de confiance établi pour ce type de service (bouche-à-oreille dominant au Maroc).

**Différenciateur central** : chaque réservation génère un **contrat numérique
signé électroniquement** par la famille et le prestataire — aucun concurrent
marocain (Adom.ma, O2 Maroc) ne le propose. S'y ajoutent une assurance RC Pro
incluse et une facturation automatique optionnelle.

## Stack technique (ne pas dévier sans discussion)

- **Mobile** : React Native + Expo
- **Backend** : Firebase (Firestore + Firebase Auth, OTP par SMS)
- **Paiement** : ChariBaaS / Chari Pay (agréé Bank Al-Maghrib) — cartes + wallets marocains
- **Navigation** : React Navigation (stack + tabs)
- **PDF / signature** : génération côté serveur (Cloud Function) à partir d'un template

## Charte graphique — à respecter strictement

Voir `src/theme/colors.js` et `src/theme/typography.js` pour les valeurs exactes.
Principe : deux couleurs vivantes utilisées franchement (émeraude + cuivre),
pas une palette diluée en multiples accents timides. Le badge de vérification
("sceau") a des coins asymétriques, jamais une pastille ronde classique.

## Structure du projet

```
src/
  theme/          → tokens de couleur et typographie (source unique de vérité)
  screens/family/  → les 11 écrans côté famille
  screens/provider/→ les 7 écrans côté prestataire
  screens/common/  → notifications, paramètres
  components/      → composants réutilisés (Badge, ProviderCard, CTAButton...)
  navigation/      → AppNavigator.js
  firebase/        → config.js
```

## Ordre de développement recommandé

1. Connexion (OTP) + profil famille → valide l'authentification
2. Recherche + fiche prestataire → valide l'affichage Firestore
3. Profil prestataire → nécessaire pour avoir des données à afficher
4. Réservation + signature du contrat → cœur du différenciateur produit
5. Demandes reçues côté prestataire → complète la boucle réservation
6. Paiement (intégration ChariBaaS)
7. Messagerie, historiques, avis
8. Notifications, paramètres — en dernier

## Fichiers de référence dans ce dossier

- `specs-ecrans-claude-code.md` — spec détaillée des 20 écrans (composants, données, navigation)
- `LoginScreen.js` et `HomeScreen.js` — exemples déjà codés, à prendre comme modèle de style pour les écrans suivants

## Règles à ne pas oublier en codant

- Le paiement se fait **après** la prestation, jamais en prépaiement
- Le badge "vérifié/assuré" utilise la couleur `colors.seal`, jamais `colors.primary`
- Le bordeaux/rouge d'erreur (`colors.error`) ne sert **que** pour les erreurs réelles — ne jamais l'utiliser pour un élément de contrat ou de statut normal
- Toujours prévoir le cas où Firestore renvoie une liste vide (état "aucun résultat"), pas seulement le cas avec données
