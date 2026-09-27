import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import { fonts } from '../theme/typography';

// Le badge "vérifié / assuré" : coins asymétriques, pas une pastille ronde
// classique — évoque un sceau/tampon officiel plutôt qu'un badge générique.
export default function VerifiedSeal({ label = 'Vérifié(e)' }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>✓ {label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.sealSoft,
    borderWidth: 1,
    borderColor: colors.seal,
    borderRadius: 8,
    borderTopLeftRadius: 2,
    borderBottomRightRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    color: colors.seal,
  },
});
