// Remplir avec les clés du projet Firebase (Console Firebase > Paramètres du projet).
// Ne jamais committer ce fichier avec de vraies clés sur un repo public sans
// restrictions — pour Firebase c'est surtout la configuration des règles de
// sécurité Firestore/Auth qui protège les données, pas le secret de ces clés.

export const firebaseConfig = {
  apiKey: 'À_REMPLIR',
  authDomain: 'À_REMPLIR.firebaseapp.com',
  projectId: 'À_REMPLIR',
  storageBucket: 'À_REMPLIR.appspot.com',
  messagingSenderId: 'À_REMPLIR',
  appId: 'À_REMPLIR',
};

// Une fois `@react-native-firebase/app` installé et configuré (voir README),
// l'app se connecte automatiquement — pas d'initializeApp() manuel nécessaire
// avec ce package, contrairement au SDK web Firebase.
