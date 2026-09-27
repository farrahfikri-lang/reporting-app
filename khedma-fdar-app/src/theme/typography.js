// Polices : Domine (titres, serif éditorial) + IBM Plex Sans (interface).
// À charger via expo-font dans App.js avant utilisation.

export const fonts = {
  display: 'Domine_600SemiBold',
  displayRegular: 'Domine_400Regular',
  body: 'IBMPlexSans_400Regular',
  bodyMedium: 'IBMPlexSans_500Medium',
  bodySemiBold: 'IBMPlexSans_600SemiBold',
};

export const typography = {
  h1: { fontFamily: fonts.display, fontSize: 26, lineHeight: 32 },
  h2: { fontFamily: fonts.display, fontSize: 20, lineHeight: 26 },
  body: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20 },
  bodySmall: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17 },
  label: { fontFamily: fonts.bodySemiBold, fontSize: 12, lineHeight: 16 },
  button: { fontFamily: fonts.bodySemiBold, fontSize: 15, lineHeight: 20 },
};

export default typography;
