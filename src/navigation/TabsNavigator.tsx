// src/navigation/TabsNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import NfcScannerScreen from '../screens/NfcScannerScreen';
import TransicionScreen from '../screens/TransicionScreen';
import DetalleTrabajadorScreen from '../screens/DetalleTrabajadorScreen';
import TymeEntryScreen from '../screens/TymeEntryScreen';
import MyRecordsScreen from '../screens/MyRecordsScreen';
import MenuScreen from '../screens/MenuScreen';
import { TabsParamList } from '../types/navigation';
import type { HomeStackParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<TabsParamList>();

// Stack anidado para la pestaña "Inicio"
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="NfcScanner" component={NfcScannerScreen} />
      <HomeStack.Screen name="Transicion" component={TransicionScreen} />
      <HomeStack.Screen
        name="DetalleTrabajador"
        component={DetalleTrabajadorScreen}
      />
      <HomeStack.Screen name="TimeEntry" component={TymeEntryScreen} />
    </HomeStack.Navigator>
  );
}

export default function TabsNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Inicio') iconName = 'home';
          else if (route.name === 'MisRegistros') iconName = 'list';
          else if (route.name === 'Menu') iconName = 'menu';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: { backgroundColor: '#1B1E1C' },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#888',
      })}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeStackNavigator}
        options={{ title: 'Inicio' }}
      />
      <Tab.Screen
        name="MisRegistros"
        component={MyRecordsScreen}
        options={{ tabBarLabel: 'Mis Registros' }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{ tabBarLabel: 'Menú' }}
      />
    </Tab.Navigator>
  );
}
