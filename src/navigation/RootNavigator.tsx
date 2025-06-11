// src/navigation/RootNavigator.tsx

import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import LoginScreen from '../screens/LoginScreen';
import TabsNavigator from './TabsNavigator';
import TransicionScreen from '../screens/TransicionScreen';
import DetalleTrabajadorScreen from '../screens/DetalleTrabajadorScreen';
import TimeEntryScreen from '../screens/TymeEntryScreen';
import { useAuth } from '../contexts/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { initializing, isAuthenticated } = useAuth();

  if (initializing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="MainTabs" component={TabsNavigator} />
          <Stack.Screen
            name="Transicion"
            component={TransicionScreen}
          />
          <Stack.Screen
            name="DetalleTrabajador"
            component={DetalleTrabajadorScreen}
          />
          <Stack.Screen
            name="TimeEntry"
            component={TimeEntryScreen}
          />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
