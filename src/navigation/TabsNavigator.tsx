import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useScan } from '../contexts/ScanContext';

import DetalleTrabajadorScreen from '../screens/DetalleTrabajadorScreen';
import MenuScreen from '../screens/MenuScreen';
import MyRecordsScreen from '../screens/MyRecordsScreen';
import NfcScannerScreen from '../screens/NfcScannerScreen';
import TransicionScreen from '../screens/TransicionScreen';
import TymeEntryScreen from '../screens/TymeEntryScreen';
import CrearTrabajadorScreen from '../screens/CrearTrabajadorScreen';
import type { HomeStackParamList } from '../types/navigation';
import { TabsParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<TabsParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="NfcScanner" component={NfcScannerScreen} />
      <HomeStack.Screen name="Transicion" component={TransicionScreen} />
      <HomeStack.Screen name="DetalleTrabajador" component={DetalleTrabajadorScreen} />
      <HomeStack.Screen name="TimeEntry" component={TymeEntryScreen} />
      <HomeStack.Screen name="MisRegistros" component={MyRecordsScreen} />
      <HomeStack.Screen name="CrearTrabajador" component={CrearTrabajadorScreen} />
    </HomeStack.Navigator>
  );
}

export default function TabsNavigator() {
  const { hasScanned } = useScan();

  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Inicio') iconName = 'home';
          else if (route.name === 'Menu') iconName = 'menu';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: { backgroundColor: '#1B1E1C' },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#888',
      })}
    >
      <Tab.Screen name="Inicio" component={HomeStackNavigator} options={{ title: 'Inicio' }} />
      <Tab.Screen name="Menu" component={MenuScreen} options={{ tabBarLabel: 'Menú' }} />
    </Tab.Navigator>
  );
}