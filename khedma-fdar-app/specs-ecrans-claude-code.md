# Spécifications techniques des écrans — pour développement avec Claude Code

Ce document accompagne les maquettes visuelles (`maquettes-ecrans-app.html`) et le cahier des charges général (`prompt-projet-app-services-domicile-maroc.md`). Il décrit chaque écran avec assez de détail pour que Claude Code puisse générer le code React Native (Expo) directement.

## Comment utiliser ce document
Colle la section d'un écran dans Claude Code avec une consigne du type :
```
Construis cet écran en React Native (Expo) selon cette spec, en respectant
la charte graphique définie ci-dessous. Utilise React Navigation pour les
liens vers les autres écrans.
```

---

## Charte graphique (à donner une seule fois à Claude Code en début de projet)

Identité pensée autour d'un seul élément mémorable — le **sceau de vérification** — plutôt qu'un motif décoratif générique. Cohérent avec le rôle du produit : un document/contrat officiel, pas juste une marketplace grand public.

```
Couleurs :
--bg: #EBEAE2 (fond général, gris-pierre neutre — pas de crème/jaune)
--surface: #FFFFFF (cartes, champs)
--ink: #171F1B (texte principal, presque noir avec une pointe de vert)
--ink-soft: #5C665F (texte secondaire)
--primary: #1F4A3D (vert pin profond — boutons principaux, actions)
--seal: #8C6A32 (laiton/bronze — badges de vérification, éléments "officiels")
--seal-soft: #EFE7D6 (fond des zones liées à la vérification)
--contract: #7A3226 (bordeaux sombre — réservé aux éléments contractuels uniquement, jamais utilisé comme accent général)
--line: #D6D2C4 (bordures)
--error: #C4453A (rouge alerte — erreurs et échecs de paiement uniquement, distinct du bordeaux contractuel)
--cat-menage: #1F4A3D (= couleur primaire)
--cat-enfants: #A85D3F (terracotta mat — chaleur/soin, volontairement désaturé)
--cat-seniors: #3E5568 (bleu ardoise — calme, associé au soin/santé)

Le raisonnement complet derrière chaque couleur (statuts, catégories, accessibilité) est détaillé dans charte-colorimetrique.md — à lire avant de coder les composants de badge et de statut.

Typographie :
- Titres : Domine (serif éditorial, sobre) — Google Fonts
- Texte / UI : IBM Plex Sans (registre institutionnel) — Google Fonts

Règles de forme (à respecter pour éviter un rendu générique de type "kit SaaS") :
- Rayons d'angle asymétriques sur les badges/sceaux (ex. 2px 8px 2px 8px), PAS des pilules parfaitement arrondies partout
- Boutons CTA : rayon modeste (6px), pas de bulle très arrondie
- Pas d'ombre grise uniforme sous chaque carte — les cartes se distinguent par une bordure fine (1px, --line), pas par une ombre
- Labels de section en casse normale (pas de MAJUSCULES ni de lettres espacées)
- Le badge "vérifié / assuré" est un sceau (forme tamponnée, coins asymétriques, couleur --seal), pas une pastille générique

Composants récurrents à créer une fois et réutiliser partout :
- Sceau de vérification (badge asymétrique --seal, utilisé pour vérifié/assuré/contrat signé)
- Card prestataire (avatar, nom, sceau, note, prix — bordure fine, pas d'ombre)
- Bouton CTA principal (fond --primary, texte blanc, rayon 6px)
- Bouton CTA secondaire/contrat (fond --contract, réservé aux actions de signature)
- Champ de formulaire (bordure --line, fond --surface)
- Contract-box (bordure pointillée --contract, fond rosé clair très pâle)
```

---

## PARTIE 1 — Écrans côté Famille

### Écran 1 — Connexion (OTP)
**Objectif** : authentifier la famille par numéro de téléphone.
**Composants** :
- Champ numéro de téléphone (préfixe +212 fixe)
- Bouton "Recevoir le code"
- 4 cases de saisie OTP (auto-focus sur la suivante après chaque chiffre)
- Lien "Renvoyer le code" (actif après 30 secondes)
**Données / logique** :
- Appel à Firebase Auth (`signInWithPhoneNumber`)
- Vérification du code OTP côté Firebase
**Navigation** : après validation → Écran 2 (si nouveau compte) ou Écran 3 (si compte existant)

### Écran 2 — Création de profil famille
**Composants** :
- Upload photo (optionnel)
- Champ nom complet
- Champ ville (liste déroulante, villes marocaines)
- Champ quartier (texte libre ou liste selon la ville)
- Sélecteur "Besoin principal" (chips : Ménage / Garde d'enfants / Aide senior — multi-sélection possible)
- Bouton "Créer mon profil"
**Données** : écrit dans Firestore, collection `users`, champ `role: "family"`
**Navigation** : → Écran 3 (Accueil)

### Écran 3 — Accueil / recherche
**Composants** :
- En-tête : salutation + ville/quartier de l'utilisateur
- Barre de recherche (texte libre, filtre les prestataires par nom/mot-clé)
- 3 cartes catégories (Ménage, Garde d'enfants, Aide senior) → chacune filtre la liste
- Bandeau de confiance (icônes : Vérifiés / Contrat signé / Assurés / Paiement après)
- Liste "Recommandés près de vous" : cards prestataires (avatar, nom, badge vérifié, note, catégorie, prix/heure)
**Données** : requête Firestore sur `providers`, filtrée par ville + catégorie, triée par note
**Navigation** : tap sur une carte catégorie → Écran 4 (liste filtrée) ; tap sur une carte prestataire → Écran 5 (fiche)

### Écran 4 — Liste de prestataires filtrée
**Composants** :
- Titre (catégorie + ville)
- Chips de filtre : Prix ↑/↓, Note, Distance (un seul actif à la fois)
- Liste de cards prestataires (mêmes que écran 3, avec distance en plus)
**Données** : requête Firestore filtrée + triée selon le filtre actif
**Navigation** : tap sur une card → Écran 5

### Écran 5 — Fiche prestataire
**Composants** :
- Photo/avatar large, nom, badges (vérifié, assuré RC Pro), années d'expérience
- Tags (langues parlées, zone, spécialités)
- Mini-calendrier semaine (jours disponibles en surbrillance)
- Liste d'avis (nom, commentaire)
- CTA fixe en bas : "Réserver — [prix] DH/h"
**Données** : document Firestore `providers/{id}`, sous-collection `reviews`
**Navigation** : tap CTA → Écran 6 (réservation)

### Écran 6 — Réservation
**Composants** :
- Toggle Ponctuel / Récurrent
- Sélecteur de date(s) et créneau horaire
- Si récurrent : sélecteur de fréquence (chaque semaine, tel jour)
- Récapitulatif : prestataire, fréquence, durée, mode de paiement (après service), total estimé
- Champ adresse de la mission (avec géolocalisation auto-suggérée)
- CTA "Continuer vers le contrat"
**Données** : crée un document `bookings` en statut `draft`
**Navigation** : → Écran 7

### Écran 7 — Signature du contrat
**Composants** :
- Résumé des conditions (générées dynamiquement à partir de la réservation)
- Mention de la clause d'assurance RC Pro
- Zone de signature tactile (capture du tracé + horodatage)
- Statuts de signature (prestataire / famille) avec pastille "Signé" / "En attente"
- CTA "Signer et confirmer" (désactivé tant que la signature n'est pas tracée)
**Données / logique** :
- Génère un PDF côté serveur (Cloud Function Firebase) à partir d'un template + des données de la réservation
- Stocke la signature (image ou hash) + horodatage dans `bookings/{id}/contract`
- Passe `booking.status` à `confirmed` une fois les deux signatures reçues
**Navigation** : → Écran 8 une fois la mission effectuée (déclenché après la date de la prestation, pas immédiatement)

### Écran 8 — Paiement
**Composants** :
- Récapitulatif de la mission terminée (prestataire, durée réelle, montant dû)
- Sélecteur de moyen de paiement (Carte / Espèces — via ChariBaaS pour la carte)
- Mention "Paiement sécurisé, effectué après validation du service"
- CTA "Payer [montant] DH"
**Données / logique** :
- Appel API ChariBaaS `POST /api/v1/charges` au clic sur le CTA
- Webhook `charge.succeeded` déclenche : mise à jour du statut de paiement + génération de facture/reçu (selon le toggle du prestataire, voir section 10 bis du cahier des charges)
**Navigation** : → Écran 11 (avis) après paiement réussi

### Écran 9 — Messagerie
**Composants** :
- En-tête : avatar + nom du prestataire + statut en ligne
- Fil de messages (bulles alignées gauche pour le prestataire, droite pour l'utilisateur)
- Champ de saisie en bas
**Données** : sous-collection Firestore `conversations/{id}/messages`, écoute en temps réel (`onSnapshot`)
**Navigation** : accessible depuis la fiche prestataire, une réservation en cours, ou la liste de conversations

### Écran 10 — Mes réservations
**Composants** :
- Section "À venir" : liste de missions avec statut (Confirmé)
- Section "Historique" : liste de missions passées avec statut (Terminé) et montant payé
- Tap sur une mission → détail (récap + accès au contrat signé + bouton "Laisser un avis" si pas encore fait)
**Données** : requête Firestore sur `bookings` filtrée par `familyId`, triée par date

### Écran 11 — Avis après prestation
**Composants** :
- Avatar + nom du prestataire
- Sélecteur d'étoiles (1 à 5, tap pour sélectionner)
- Zone de texte libre (commentaire)
- CTA "Envoyer mon avis"
**Données** : écrit dans `providers/{id}/reviews`, met à jour la note moyenne du prestataire (Cloud Function ou calcul côté client)

---

## PARTIE 2 — Écrans côté Prestataire

### Écran 12 — Connexion (OTP)
Identique à l'écran 1, avec `role: "provider"` enregistré à la création du compte.

### Écran 13 — Création de profil prestataire
**Composants** :
- Upload photo de CIN (obligatoire pour vérification)
- Champ nom complet
- Champ tarif horaire
- Champ zone d'intervention
- Chips de sélection des services proposés (Ménage / Garde d'enfants / Aide senior)
- Toggle "J'accepte la facturation automatique" (voir section 10 bis du cahier des charges)
- CTA "Envoyer pour vérification"
**Données** : écrit dans Firestore `providers/{id}`, statut initial `pending_verification` — un admin doit valider avant que le profil soit visible (back-office, hors scope MVP mobile)

### Écran 14 — Gestion des disponibilités
**Composants** :
- Sélecteur de jours (semaine, multi-sélection)
- Pour le jour sélectionné : chips Matin / Après-midi / Soir (multi-sélection)
- CTA "Enregistrer"
**Données** : structure `providers/{id}/availability` (map jour → créneaux)

### Écran 15 — Demandes de réservation reçues
**Composants** :
- Liste de cards : nom du client, catégorie, date/heure, adresse
- Chaque card a 2 boutons : Accepter / Refuser
**Données** : requête Firestore sur `bookings` filtrée par `providerId` et `status: "pending"`
**Logique** : tap "Accepter" → `status: "accepted"` → redirige vers Écran 16 (signature)

### Écran 16 — Signature du contrat (côté prestataire)
Même logique que l'écran 7, vue miroir côté prestataire.

### Écran 17 — Messagerie (prestataire)
Identique à l'écran 9, vue miroir.

### Écran 18 — Mes missions / revenus
**Composants** :
- 3 stat-cards : Revenus du mois, Nombre de missions, Note moyenne
- Liste des missions à venir
**Données** : agrégation Firestore sur `bookings` filtrée par `providerId` et par mois en cours

---

## PARTIE 3 — Écrans communs

### Écran 19 — Notifications
**Composants** :
- Liste d'items : icône, titre, description, temps écoulé
- Types : contrat signé, rappel de mission, paiement effectué, nouvel avis reçu
**Données** : sous-collection `users/{id}/notifications`, ou service de push notifications Firebase Cloud Messaging

### Écran 20 — Paramètres / profil
**Composants** :
- En-tête profil (avatar, nom, email)
- Sections : Compte (infos perso, moyens de paiement, contrats signés) / Préférences (langue, notifications) / Aide & support / Déconnexion
**Données** : lecture/écriture sur le document utilisateur Firestore ; déconnexion via `signOut()` Firebase Auth

---

## Ordre de développement recommandé
Pour un développeur solo assisté par Claude Code, développer dans cet ordre permet de tester le parcours complet le plus tôt possible :
1. Écrans 1, 2 (connexion + profil famille) — valide l'authentification
2. Écrans 3, 4, 5 (recherche + fiche) — valide l'affichage de données Firestore
3. Écran 13 (profil prestataire) — nécessaire pour avoir des données à afficher côté famille
4. Écrans 6, 7 (réservation + contrat) — cœur du différenciateur produit
5. Écran 15 (demandes reçues côté prestataire) pour compléter la boucle réservation
6. Écran 8 (paiement) — intégration ChariBaaS
7. Écrans 9, 17 (messagerie), 10, 18 (historiques), 11 (avis)
8. Écrans 19, 20 (notifications, paramètres) — en dernier, moins critiques pour valider le concept
