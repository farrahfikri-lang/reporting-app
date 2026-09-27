import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import colors from '../../theme/colors';
import { fonts, typography } from '../../theme/typography';
import CTAButton from '../../components/CTAButton';
// import auth from '@react-native-firebase/auth'; // décommenter une fois Firebase configuré
// import firestore from '@react-native-firebase/firestore';

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [loading, setLoading] = useState(false);
  const [confirmResult, setConfirmResult] = useState(null);
  const otpRefs = useRef([]);

  async function sendCode() {
    setLoading(true);
    try {
      // const result = await auth().signInWithPhoneNumber(`+212${phone}`);
      // setConfirmResult(result);
      setStep('otp');
    } catch (e) {
      console.warn('Erreur envoi OTP', e);
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode() {
    setLoading(true);
    try {
      // await confirmResult.confirm(otp.join(''));
      // const uid = auth().currentUser.uid;
      // const profile = await firestore().collection('users').doc(uid).get();
      // navigation.replace(profile.exists ? 'Home' : 'ProfileSetup');
      // En attendant Firebase, on considère que c'est un nouveau compte :
      navigation.replace('ProfileSetup');
    } catch (e) {
      console.warn('Code invalide', e);
    } finally {
      setLoading(false);
    }
  }

  function onOtpChange(text, index) {
    const next = [...otp];
    next[index] = text;
    setOtp(next);
    if (text && index < 3) otpRefs.current[index + 1]?.focus();
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.title}>Bienvenue 👋</Text>

      {step === 'phone' ? (
        <>
          <Text style={styles.subtitle}>
            Entrez votre numéro de téléphone pour recevoir un code de vérification
          </Text>
          <View style={styles.phoneRow}>
            <Text style={styles.prefix}>🇲🇦 +212</Text>
            <TextInput
              style={styles.phoneInput}
              placeholder="6 12 34 56 78"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
          <CTAButton title="Continuer" onPress={sendCode} loading={loading} disabled={phone.length < 9} />
        </>
      ) : (
        <>
          <Text style={styles.subtitle}>Code reçu par SMS au +212{phone}</Text>
          <View style={styles.otpRow}>
            {otp.map((digit, i) => (
              <TextInput
                key={i}
                ref={(r) => (otpRefs.current[i] = r)}
                style={styles.otpBox}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(t) => onOtpChange(t, i)}
              />
            ))}
          </View>
          <CTAButton title="Confirmer" onPress={verifyCode} loading={loading} disabled={otp.some((d) => !d)} />
        </>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: 24, justifyContent: 'center' },
  title: { ...typography.h1, color: colors.ink, marginBottom: 8, textAlign: 'center' },
  subtitle: { ...typography.body, color: colors.inkSoft, textAlign: 'center', marginBottom: 24 },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 24,
  },
  prefix: { ...typography.body, color: colors.inkSoft, marginRight: 8 },
  phoneInput: { flex: 1, paddingVertical: 14, fontFamily: fonts.body, fontSize: 15, color: colors.ink },
  otpRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 24 },
  otpBox: {
    width: 48,
    height: 56,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: fonts.bodySemiBold,
    color: colors.primary,
    backgroundColor: colors.surface,
  },
});
