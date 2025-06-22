import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { AuthProvider } from './src/contexts/AuthContext';
import { ScanProvider } from './src/contexts/ScanContext';
import { navigationRef } from './src/navigation/NavigationService';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <AuthProvider>
      <ScanProvider>
        <NavigationContainer ref={navigationRef}>
        <StatusBar style="dark" />
          <RootNavigator />
        </NavigationContainer>
      </ScanProvider>
    </AuthProvider>
  );
}