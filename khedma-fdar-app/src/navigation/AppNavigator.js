import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/family/LoginScreen';
import ProfileSetupScreen from '../screens/family/ProfileSetupScreen';
import HomeScreen from '../screens/family/HomeScreen';

// TODO au fur et à mesure : ajouter chaque écran de la spec (voir CLAUDE.md,
// ordre de développement recommandé) — ProviderList,
// ProviderProfile, Booking, ContractSign, Payment, Chat, MyBookings, Review,
// puis les écrans côté Prestataire (ProviderLogin, ProviderProfile,
// Availability, IncomingRequests, ProviderContractSign, ProviderChat,
// ProviderEarnings), puis Notifications et Settings.

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
