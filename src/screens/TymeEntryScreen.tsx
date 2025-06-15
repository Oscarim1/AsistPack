// src/screens/TimeEntryScreen.tsx

import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RouteProp } from '@react-navigation/native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  AsistenciaRecord,
  getAsistenciaActual,
  postAsistencia,
  TipoAsistencia,
} from '../services/tymeEntryService';
import modalStyles from '../styles/tymeEntryModalStyles';
import styles from '../styles/tymeEntryStyles';
import type { HomeStackParamList } from '../types/navigation';

// Tipos de navegación
type TimeEntryRouteProp = RouteProp<HomeStackParamList, 'TimeEntry'>;
type TimeEntryNavProp = NativeStackNavigationProp<HomeStackParamList, 'TimeEntry'>;

const tiposOrder: TipoAsistencia[] = ['entrada', 'salida_colacion', 'entrada_colacion', 'salida'];

const iconMap: Record<TipoAsistencia, React.ComponentProps<typeof Feather>['name']> = {
  entrada: 'log-in',
  salida_colacion: 'coffee',
  entrada_colacion: 'log-in',
  salida: 'log-out',
};

export default function TimeEntryScreen() {
  const navigation = useNavigation<TimeEntryNavProp>();
  const { params } = useRoute<TimeEntryRouteProp>();
  const { trabajador } = params;
  //const { setHasScanned } = useScan();

  // 1. Detectar cuando la pantalla pierde foco (usuario vuelve al Home)
  useFocusEffect(
    useCallback(() => {
      console.log('TimeEntryScreen: focused');
      return () => {
        console.log('TimeEntryScreen: unfocused - usuario volvió al Home');
        // Aquí puedes ejecutar lógica adicional al volver al Home
        //setHasScanned(false);
      };
    }, [])
  );

  // Cleanup: eliminar el trabajador almacenado al desmontar esta pantalla
  useEffect(() => {
    return () => {
      AsyncStorage.removeItem('currentTrabajador').catch(err => console.warn('Error borrando currentTrabajador:', err));
    };
  }, []);

  // Reloj en tiempo real
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Estados de carga y habilitación de botones
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState<Record<TipoAsistencia, boolean>>({
    entrada: false,
    salida_colacion: false,
    entrada_colacion: false,
    salida: false,
  });

  // Modal de feedback
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const scaleAnim = useRef(new Animated.Value(0)).current;

  // Animación del modal
  useEffect(() => {
    if (showModal) {
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [showModal]);

  // Carga estado de asistencias y ajusta botones
  const loadCurrent = useCallback(async (skipCompleteCheck = false) => {
    setLoading(true);
    try {
      const actual: AsistenciaRecord = await getAsistenciaActual(trabajador.pulsera_uuid);
      const next: Record<TipoAsistencia, boolean> = {
        entrada: !actual.horario_entrada,
        salida_colacion: !!actual.horario_entrada && !actual.horario_salida_colacion,
        entrada_colacion: !!actual.horario_salida_colacion && !actual.horario_entrada_colacion,
        salida: !!actual.horario_entrada_colacion && !actual.horario_salida,
      };
      setEnabled(next);

      // Si ya registró todo y no se omite la verificación, mostramos mensaje y redirigimos
      if (!skipCompleteCheck && Object.values(next).every(v => !v)) {
        setModalMessage('Ya tienes registrada tu asistencia del día de hoy.\n¡Hasta mañana!');
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          navigation.popToTop();
        }, 2500);
      }
    } catch (err: any) {
      console.warn('Error cargando asistencia actual:', err);
    } finally {
      setLoading(false);
    }
  }, [trabajador.pulsera_uuid, navigation]);

  useEffect(() => { loadCurrent(); }, [loadCurrent]);

  // Manejador de marca
  const handlePress = async (tipo: TipoAsistencia) => {
    setLoading(true);
    try {
      await postAsistencia(trabajador.pulsera_uuid, tipo);
      const hora = formatDate(now);
      let msg = `Se marcó ${formatTipo(tipo)}\na las ${hora}`;
      if (tipo === 'salida') msg += '\n¡Has finalizado el día! Hasta mañana!';

      setModalMessage(msg);
      setShowModal(true);
      await loadCurrent(true);
      setTimeout(() => {
        setShowModal(false);
        navigation.popToTop();
      }, 2500);
    } catch (err: any) {
      console.warn('Error marcando asistencia:', err);
      setLoading(false);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hola, {trabajador.nombres}</Text>
      <Text style={styles.subtitle}>¿Qué deseas registrar?</Text>
      <Text style={styles.timeText}>{now.toLocaleString()}</Text>
      {tiposOrder.map(tipo => (
        <TouchableOpacity
          key={tipo}
          style={[styles.button, !enabled[tipo] && styles.buttonDisabled]}
          disabled={!enabled[tipo]}
          onPress={() => handlePress(tipo)}>
          <Feather name={iconMap[tipo]} size={20} color="#004D40" style={styles.icon} />
          <Text style={styles.buttonText}>{formatTipo(tipo)}</Text>
        </TouchableOpacity>
      ))}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={modalStyles.overlay}>
          <Animated.View style={[modalStyles.content, { transform: [{ scale: scaleAnim }] }]}> 
            <Feather name="alert-triangle" size={80} color="#FFA500" />
            <Text style={modalStyles.title}>¡Atención!</Text>
            <Text style={modalStyles.message}>{modalMessage}</Text>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

// Helpers
function formatTipo(tipo: TipoAsistencia): string {
  switch (tipo) {
    case 'entrada': return 'Ingreso';
    case 'salida_colacion': return 'Salida Colación';
    case 'entrada_colacion': return 'Entrada Colación';
    case 'salida': return 'Fin Jornada';
  }
}

function formatDate(date: Date): string {
  const yy = String(date.getFullYear()).slice(-2);
  const MM = String(date.getMonth() + 1).padStart(2,'0');
  const dd = String(date.getDate()).padStart(2,'0');
  let hh = date.getHours() % 12 || 12;
  const mm = String(date.getMinutes()).padStart(2,'0');
  const ss = String(date.getSeconds()).padStart(2,'0');
  const ampm = date.getHours() >=12 ? 'PM' : 'AM';
  return `${yy}:${MM}:${dd} ${String(hh).padStart(2,'0')}:${mm}:${ss} ${ampm}`;
}
