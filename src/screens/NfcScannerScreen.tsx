// src/screens/NfcScannerScreen.tsx

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTrabajadorPorPulsera } from '../services/trabajadorService';
import {
  CompositeNavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { TabsParamList, RootStackParamList } from '../types/navigation';
import styles from '../styles/nfcScannerStyles';

// 1) Tipo de navegación combinada: Stack ⬄ Tab
type TabNav = BottomTabNavigationProp<TabsParamList, 'Inicio'>;
type StackNav = NativeStackNavigationProp<RootStackParamList>;
type NavigationProp = CompositeNavigationProp<StackNav, TabNav>;

export default function NfcScannerScreen() {
  const navigation = useNavigation<NavigationProp>();
  const screenWidth = Dimensions.get('window').width;

  const acciones = [
    {
      key: 'asistencia',
      titulo: 'Ingresar asistencia',
      tipo: 'ASISTENCIA',
    },
    {
      key: 'recoleccion',
      titulo: 'Ingresar recolección',
      tipo: 'RECOLECCION',
    },
    {
      key: 'cuadrilla',
      titulo: 'Asignar a cuadrilla',
      tipo: 'CUADRILLA',
    },
    {
      key: 'registrar',
      titulo: 'Registrar usuario',
      tipo: 'REGISTRAR',
    },
  ] as const;

  const handleScan = async (tipoAccion: typeof acciones[number]['tipo']) => {
    const mockUuid = 'PULS002';

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) throw new Error('Token no encontrado');

      const trabajador = await getTrabajadorPorPulsera(mockUuid);

      if (tipoAccion === 'ASISTENCIA') {
        // navega a la pantalla TimeEntry en el Stack principal
        navigation.navigate('TimeEntry', { trabajador });
      } else {
        // para otras acciones, usa tu pantalla Transicion
        navigation.navigate('Transicion', {
          trabajador,
          accion: tipoAccion,
        });
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo procesar la acción');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {acciones.map(({ key, titulo, tipo }) => (
          <View key={key} style={{ alignItems: 'center', marginVertical: 12 }}>
            <TouchableOpacity
              style={[styles.card, { width: screenWidth * 0.6 }]}
              activeOpacity={0.7}
              onPress={() => handleScan(tipo)}
            >
              <Text style={styles.cardButtonText}>{titulo}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
