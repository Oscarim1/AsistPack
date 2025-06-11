// src/screens/TimeEntryScreen.tsx

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';
import styles from '../styles/tymeEntryStyles';

import {
  getAsistenciaActual,
  postAsistencia,
  TipoAsistencia,
  AsistenciaRecord,
} from '../services/tymeEntryService';

type TimeEntryRouteProp = RouteProp<RootStackParamList, 'TimeEntry'>;

const tiposOrder: TipoAsistencia[] = [
  'entrada',
  'salida_colacion',
  'entrada_colacion',
  'salida',
];

/** Devuelve "yy:MM:dd hh:mm:ss a" */
function formatDate(date: Date): string {
  const yy = String(date.getFullYear()).slice(-2);
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  let hh = date.getHours() % 12;
  if (hh === 0) hh = 12;
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

  return `${yy}:${MM}:${dd} ${String(hh).padStart(2, '0')}:${mm}:${ss} ${ampm}`;
}

export default function TimeEntryScreen() {
  const { params } = useRoute<TimeEntryRouteProp>();
  const { trabajador } = params;

  // ——— Estado para el reloj ———
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ——— Estado para habilitar botones ———
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState<Record<TipoAsistencia, boolean>>({
    entrada: false,
    salida_colacion: false,
    entrada_colacion: false,
    salida: false,
  });

  const loadCurrent = useCallback(async () => {
    setLoading(true);
    try {
      const actual: AsistenciaRecord = await getAsistenciaActual(
        trabajador.pulsera_uuid
      );

      const nextState: Record<TipoAsistencia, boolean> = {
        entrada: false,
        salida_colacion: false,
        entrada_colacion: false,
        salida: false,
      };

      if (!actual.horario_entrada) {
        nextState.entrada = true;
      } else if (!actual.horario_salida_colacion) {
        nextState.salida_colacion = true;
      } else if (!actual.horario_entrada_colacion) {
        nextState.entrada_colacion = true;
      } else if (!actual.horario_salida) {
        nextState.salida = true;
      }

      setEnabled(nextState);
    } catch (err: any) {
      Alert.alert('Error al cargar estado', err.message);
    } finally {
      setLoading(false);
    }
  }, [trabajador.pulsera_uuid]);

  useEffect(() => {
    loadCurrent();
  }, [loadCurrent]);

  const handlePress = async (tipo: TipoAsistencia) => {
    setLoading(true);
    try {
      await postAsistencia(trabajador.pulsera_uuid, tipo);
      Alert.alert('Registrado', `Se marcó "${formatTipo(tipo)}"`);
      await loadCurrent();
    } catch (err: any) {
      Alert.alert('Error al registrar', err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hola, {trabajador.nombres}</Text>
      <Text style={styles.subtitle}>¿Qué deseas registrar?</Text>

      {/* Reloj en tiempo real */}
      <Text style={styles.timeText}>{formatDate(now)}</Text>

      {tiposOrder.map((tipo) => (
        <TouchableOpacity
          key={tipo}
          style={[
            styles.button,
            !enabled[tipo] && styles.buttonDisabled,
          ]}
          disabled={!enabled[tipo]}
          onPress={() => handlePress(tipo)}
        >
          <Text style={styles.buttonText}>{formatTipo(tipo)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function formatTipo(tipo: TipoAsistencia) {
  switch (tipo) {
    case 'entrada':
      return 'Ingreso';
    case 'salida_colacion':
      return 'Salida Colación';
    case 'entrada_colacion':
      return 'Entrada Colación';
    case 'salida':
      return 'Fin Jornada';
  }
}
