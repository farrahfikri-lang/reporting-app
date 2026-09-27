import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import { fonts, typography } from '../../theme/typography';
import ProviderCard from '../../components/ProviderCard';
// import firestore from '@react-native-firebase/firestore'; // décommenter une fois Firebase configuré

const CATEGORIES = [
  { key: 'menage', label: 'Ménage', icon: '🧹' },
  { key: 'enfants', label: "Garde d'enfants", icon: '🧸' },
  { key: 'seniors', label: 'Aide seniors', icon: '🤝' },
];

export default function HomeScreen({ navigation }) {
  const [providers, setProviders] = useState([]);
  const [activeCategory, setActiveCategory] = useState('menage');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviders(activeCategory);
  }, [activeCategory]);

  async function fetchProviders(category) {
    setLoading(true);
    try {
      // const snap = await firestore()
      //   .collection('providers')
      //   .where('category', '==', category)
      //   .where('city', '==', 'Rabat')
      //   .orderBy('rating', 'desc')
      //   .get();
      // setProviders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));

      // Données d'exemple en attendant la connexion Firestore réelle :
      setProviders([
        { id: '1', name: 'Fatima Zahra', category: 'Ménage', rating: 4.8, pricePerHour: 35, verified: true },
        { id: '2', name: 'Naima L.', category: 'Ménage', rating: 4.9, pricePerHour: 38, verified: true },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.hello}>Salam 👋</Text>
      <Text style={styles.loc}>📍 Rabat — Agdal</Text>

      <TextInput style={styles.search} placeholder="Rechercher un prestataire..." />

      <View style={styles.catRow}>
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat.key}
            onPress={() => setActiveCategory(cat.key)}
            style={[
              styles.catCard,
              { borderColor: activeCategory === cat.key ? colors.primary : colors.line },
            ]}
          >
            <Text style={styles.catIcon}>{cat.icon}</Text>
            <Text style={styles.catLabel}>{cat.label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Recommandés près de vous</Text>

      <FlatList
        data={providers}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={() => fetchProviders(activeCategory)}
        renderItem={({ item }) => (
          <ProviderCard
            provider={item}
            onPress={() => navigation.navigate('ProviderProfile', { providerId: item.id })}
          />
        )}
        ListEmptyComponent={
          !loading && <Text style={styles.empty}>Aucun prestataire disponible pour le moment.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: 16, paddingTop: 50 },
  hello: { ...typography.h1, color: colors.ink },
  loc: { ...typography.bodySmall, color: colors.inkSoft, marginBottom: 16 },
  search: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.body,
    marginBottom: 16,
  },
  catRow: { flexDirection: 'row', gap: 8, marginBottom: 18 },
  catCard: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 10,
    backgroundColor: colors.surface,
    paddingVertical: 12,
    alignItems: 'center',
  },
  catIcon: { fontSize: 20, marginBottom: 4 },
  catLabel: { ...typography.label, color: colors.ink, textAlign: 'center' },
  sectionTitle: {
    ...typography.label,
    color: colors.ink,
    borderLeftWidth: 3,
    borderLeftColor: colors.seal,
    paddingLeft: 9,
    marginBottom: 10,
  },
  empty: { ...typography.body, color: colors.inkSoft, textAlign: 'center', marginTop: 20 },
});
