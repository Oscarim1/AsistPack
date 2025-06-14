import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useScan } from '../contexts/ScanContext';
import { getTrabajadorPorPulsera } from '../services/trabajadorService';
import styles from '../styles/nfcScannerStyles';
import type { RootStackParamList, TabsParamList } from '../types/navigation';

// 1) Combinamos Stack (para TimeEntry, Transicion, etc.) y Tab (para MisRegistros)
type TabNav = BottomTabNavigationProp<TabsParamList, 'Inicio'> &
               BottomTabNavigationProp<TabsParamList, 'MisRegistros'>;
type StackNav = NativeStackNavigationProp<RootStackParamList>;
type NavigationProp = CompositeNavigationProp<StackNav, TabNav>;

export default function NfcScannerScreen() {
  const navigation = useNavigation<NavigationProp>();
  const screenWidth = Dimensions.get('window').width;
  const { setHasScanned } = useScan();
  
  const acciones = [
    { key: 'asistencia',    titulo: 'Ingresar asistencia',  tipo: 'ASISTENCIA' },
    { key: 'recoleccion',   titulo: 'Ingresar recolección', tipo: 'RECOLECCION' },
    { key: 'cuadrilla',     titulo: 'Asignar a cuadrilla',   tipo: 'CUADRILLA' },
    { key: 'registrar',     titulo: 'Registrar usuario',     tipo: 'REGISTRAR' },
    { key: 'misRegistros',  titulo: 'Mis Registros',         tipo: 'MIS_REGISTROS' as const },
  ] as const;

  const handleScan = async (tipoAccion: typeof acciones[number]['tipo']) => {
    try {
      const mockUuid = 'PULS002';
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) throw new Error('Token no encontrado');

      const trabajador = await getTrabajadorPorPulsera(mockUuid);
      await AsyncStorage.setItem('currentTrabajador', JSON.stringify(trabajador));
      
      switch (tipoAccion) {
        case 'ASISTENCIA':
          setHasScanned(true);
          navigation.navigate('TimeEntry', { trabajador });
          break;
        case 'RECOLECCION':
          navigation.navigate('TimeEntry', { trabajador });
          break;
        case 'CUADRILLA':
          navigation.navigate('TimeEntry', { trabajador });
          break;
        case 'REGISTRAR':
          navigation.navigate('TimeEntry', { trabajador });
          break;
        case 'MIS_REGISTROS':
          navigation.navigate('MisRegistros', { trabajador });
          break;
        default:
          throw new Error('Acción no reconocida');
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
