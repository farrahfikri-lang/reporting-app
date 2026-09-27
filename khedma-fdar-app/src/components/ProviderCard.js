import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import { fonts } from '../theme/typography';
import VerifiedSeal from './VerifiedSeal';

// provider: { name, category, rating, pricePerHour, verified }
export default function ProviderCard({ provider, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{provider.name}</Text>
          {provider.verified && <VerifiedSeal />}
        </View>
        <Text style={styles.meta}>
          ★ {provider.rating?.toFixed(1) ?? '—'} · {provider.category}
        </Text>
        <Text style={styles.price}>{provider.pricePerHour} DH/h</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 11,
    backgroundColor: colors.primarySoft,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  name: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.ink },
  meta: { fontFamily: fonts.body, fontSize: 12, color: colors.inkSoft, marginTop: 3 },
  price: { fontFamily: fonts.bodySemiBold, fontSize: 13, color: colors.primary, marginTop: 4 },
});
