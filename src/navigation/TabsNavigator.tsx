import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NfcScannerScreen from '../screens/NfcScannerScreen';
import MyRecordsScreen from '../screens/MyRecordsScreen';
import MenuScreen from '../screens/MenuScreen';
import { Ionicons } from '@expo/vector-icons';
import { TabsParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<TabsParamList>();

export default function TabsNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={({ route }) => ({
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
        headerShown: false,
      })}
    >
      <Tab.Screen name="Inicio" component={NfcScannerScreen} />
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
