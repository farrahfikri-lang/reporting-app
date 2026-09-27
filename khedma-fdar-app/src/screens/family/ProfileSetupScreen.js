import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import colors from '../../theme/colors';
import { fonts, typography } from '../../theme/typography';
import CTAButton from '../../components/CTAButton';
// import auth from '@react-native-firebase/auth'; // décommenter une fois Firebase configuré
// import firestore from '@react-native-firebase/firestore';

const CITIES = ['Rabat', 'Salé', 'Témara', 'Casablanca', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 'Oujda'];

// Quartiers proposés en liste pour la ville de lancement ; texte libre ailleurs.
const NEIGHBORHOODS = {
  Rabat: ['Agdal', 'Hay Riad', 'Souissi', 'Hassan', 'Océan', 'Les Orangers', 'Aviation', 'Yacoub El Mansour'],
};

const NEEDS = [
  { key: 'menage', label: 'Ménage', icon: '🧹' },
  { key: 'enfants', label: "Garde d'enfants", icon: '🧸' },
  { key: 'seniors', label: 'Aide senior', icon: '🤝' },
];

export default function ProfileSetupScreen({ navigation }) {
  const [photoUri, setPhotoUri] = useState(null);
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('Rabat');
  const [cityOpen, setCityOpen] = useState(false);
  const [neighborhood, setNeighborhood] = useState('');
  const [needs, setNeeds] = useState(['menage']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const neighborhoodOptions = NEIGHBORHOODS[city];
  const canSubmit = fullName.trim().length >= 2 && neighborhood.trim() && needs.length > 0;

  async function pickPhoto() {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  }

  function selectCity(value) {
    setCity(value);
    setNeighborhood('');
    setCityOpen(false);
  }

  function toggleNeed(key) {
    setNeeds((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  async function createProfile() {
    setLoading(true);
    setError(null);
    try {
      // const uid = auth().currentUser.uid;
      // TODO: uploader la photo dans Firebase Storage et stocker l'URL plutôt que l'URI locale
      // await firestore().collection('users').doc(uid).set({
      //   role: 'family',
      //   fullName: fullName.trim(),
      //   city,
      //   neighborhood: neighborhood.trim(),
      //   needs,
      //   photoUrl: null,
      //   phone: auth().currentUser.phoneNumber,
      //   createdAt: firestore.FieldValue.serverTimestamp(),
      // });
      navigation.replace('Home');
    } catch (e) {
      console.warn('Erreur création profil', e);
      setError("Impossible de créer votre profil. Vérifiez votre connexion et réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Votre profil</Text>
        <Text style={styles.subtitle}>Quelques informations pour vous proposer les bons prestataires</Text>

        <Pressable onPress={pickPhoto} style={styles.photoWrap}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photo} />
          ) : (
            <View style={[styles.photo, styles.photoEmpty]}>
              <Text style={styles.photoIcon}>📷</Text>
            </View>
          )}
          <Text style={styles.photoLabel}>{photoUri ? 'Changer la photo' : 'Ajouter une photo (optionnel)'}</Text>
        </Pressable>

        <Text style={styles.fieldLabel}>Nom complet</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex. Salma Bennani"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />

        <Text style={styles.fieldLabel}>Ville</Text>
        <Pressable onPress={() => setCityOpen((o) => !o)} style={[styles.input, styles.select]}>
          <Text style={styles.selectText}>{city}</Text>
          <Text style={styles.selectArrow}>{cityOpen ? '▴' : '▾'}</Text>
        </Pressable>
        {cityOpen && (
          <View style={styles.dropdown}>
            {CITIES.map((c) => (
              <Pressable key={c} onPress={() => selectCity(c)} style={styles.dropdownItem}>
                <Text style={[styles.dropdownText, c === city && styles.dropdownTextActive]}>{c}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <Text style={styles.fieldLabel}>Quartier</Text>
        {neighborhoodOptions ? (
          <View style={styles.chipRow}>
            {neighborhoodOptions.map((n) => {
              const active = neighborhood === n;
              return (
                <Pressable key={n} onPress={() => setNeighborhood(n)} style={[styles.chip, active && styles.chipActive]}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{n}</Text>
                </Pressable>
              );
            })}
          </View>
        ) : (
          <TextInput
            style={styles.input}
            placeholder="Votre quartier"
            value={neighborhood}
            onChangeText={setNeighborhood}
          />
        )}

        <Text style={styles.sectionTitle}>Besoin principal</Text>
        <Text style={styles.hint}>Plusieurs choix possibles</Text>
        <View style={styles.needRow}>
          {NEEDS.map((need) => {
            const active = needs.includes(need.key);
            return (
              <Pressable
                key={need.key}
                onPress={() => toggleNeed(need.key)}
                style={[styles.needCard, { borderColor: active ? colors.primary : colors.line }]}
              >
                <Text style={styles.needIcon}>{need.icon}</Text>
                <Text style={styles.needLabel}>{need.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <CTAButton title="Créer mon profil" onPress={createProfile} loading={loading} disabled={!canSubmit} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 50, paddingBottom: 32 },
  title: { ...typography.h1, color: colors.ink },
  subtitle: { ...typography.bodySmall, color: colors.inkSoft, marginBottom: 20 },
  photoWrap: { alignItems: 'center', marginBottom: 20 },
  photo: { width: 84, height: 84, borderRadius: 18 },
  photoEmpty: {
    backgroundColor: colors.sealSoft,
    borderWidth: 1,
    borderColor: colors.seal,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoIcon: { fontSize: 26 },
  photoLabel: { ...typography.label, color: colors.seal, marginTop: 8 },
  fieldLabel: { ...typography.label, color: colors.ink, marginBottom: 6 },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.ink,
    marginBottom: 16,
  },
  select: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  selectText: { ...typography.body, color: colors.ink },
  selectArrow: { ...typography.body, color: colors.inkSoft },
  dropdown: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    marginTop: -10,
    marginBottom: 16,
    paddingVertical: 4,
  },
  dropdownItem: { paddingHorizontal: 14, paddingVertical: 10 },
  dropdownText: { ...typography.body, color: colors.ink },
  dropdownTextActive: { fontFamily: fonts.bodySemiBold, color: colors.primary },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  chip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  chipText: { ...typography.bodySmall, color: colors.ink },
  chipTextActive: { fontFamily: fonts.bodySemiBold, color: colors.primary },
  sectionTitle: {
    ...typography.label,
    color: colors.ink,
    borderLeftWidth: 3,
    borderLeftColor: colors.seal,
    paddingLeft: 9,
    marginTop: 4,
  },
  hint: { ...typography.bodySmall, color: colors.inkSoft, marginTop: 2, marginBottom: 10 },
  needRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  needCard: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 10,
    backgroundColor: colors.surface,
    paddingVertical: 12,
    alignItems: 'center',
  },
  needIcon: { fontSize: 20, marginBottom: 4 },
  needLabel: { ...typography.label, color: colors.ink, textAlign: 'center' },
  error: { ...typography.bodySmall, color: colors.error, marginBottom: 12, textAlign: 'center' },
});
