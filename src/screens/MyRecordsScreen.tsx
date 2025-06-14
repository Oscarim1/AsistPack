
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { getReporteMensual, ReporteMensual } from '../services/asistenciaService';
import { getTrabajadorPorPulsera } from '../services/trabajadorService';
import styles from '../styles/myRecordsSyles';
import type { TabsParamList } from '../types/navigation';

// Tipo de navegación para la pestaña "MisRegistros"
type MisRegistrosNavProp = BottomTabNavigationProp<TabsParamList, 'MisRegistros'>;

// Estructura del trabajador
interface Trabajador {
  nombres: string;
  rol: string;
  contacto: string;
  direccion: string;
  pulsera_uuid: string;
}

export default function MisRegistrosScreen() {
  const navigation = useNavigation<MisRegistrosNavProp>();

  // Estados: trabajador, fecha, reporte, loading
  const [trabajador, setTrabajador] = useState<Trabajador | null>(null);
  const [date, setDate] = useState(new Date());
  const [report, setReport] = useState<ReporteMensual | null>(null);
  const [loading, setLoading] = useState(true);

  // Nombres de meses
  const monthNames = [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
  ];

  // Formateadores de fecha y hora
  const formatDateOnly = (iso: string) =>
    new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const formatTimeOnly = (iso: string) =>
    new Date(iso).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // 1) Simular escaneo NFC al montar pantalla
  useEffect(() => {
    const scanNfc = async () => {
      setLoading(true);
      try {
        const mockUuid = 'PULS002';
        const t = await getTrabajadorPorPulsera(mockUuid);
        await AsyncStorage.setItem('currentTrabajador', JSON.stringify(t));
        setTrabajador(t);
      } catch (e) {
        console.warn('Error simulando escaneo NFC:', e);
        navigation.navigate('Inicio');
      } finally {
        setLoading(false);
      }
    };
    scanNfc();
  }, [navigation]);

  // 2) Obtener reporte cada vez que cambian trabajador o mes
  const fetchReport = useCallback(async () => {
    if (!trabajador) return;
    setLoading(true);
    try {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const data = await getReporteMensual(trabajador.pulsera_uuid, year, month);
      setReport(data);
    } catch (e) {
      console.warn('Error al obtener reporte:', e);
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, [trabajador, date]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  // Cambiar mes
  const changeMonth = (delta: number) => {
    setDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + delta);
      return d;
    });
  };

  // Loader o estado inicial
  if (loading || !trabajador) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4BB543" />
      </View>
    );
  }

  // Sin datos para el mes
  if (!report) {
    return (
      <View style={styles.center}>
        <Text style={styles.noDataText}>No hay registros para este mes.</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Inicio')}>
          <Text style={styles.linkText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render principal
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeMonth(-1)}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{monthNames[date.getMonth()]} {date.getFullYear()}</Text>
        <TouchableOpacity onPress={() => changeMonth(1)}>
          <Ionicons name="chevron-forward" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Resumen */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Resumen</Text>
        <View style={styles.summaryItems}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Días trabajados</Text>
            <Text style={styles.summaryValue}>{report.resumen.dias_trabajados}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Horas brutas</Text>
            <Text style={styles.summaryValue}>{report.resumen.horas_brutas}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Horas colación</Text>
            <Text style={styles.summaryValue}>{report.resumen.horas_colacion}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Horas trabajadas</Text>
            <Text style={styles.summaryValue}>{report.resumen.horas_trabajadas}</Text>
          </View>
        </View>
      </View>

      {/* Detalles diarios */}
      <FlatList
        data={report.detalles}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.detailCard}>
            <Text style={styles.detailDate}>{formatDateOnly(item.fecha)}</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Ingreso:</Text>
              <Text style={styles.detailValue}>{formatTimeOnly(item.entrada)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Salida Colación:</Text>
              <Text style={styles.detailValue}>{formatTimeOnly(item.salida_colacion)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Entrada Colación:</Text>
              <Text style={styles.detailValue}>{formatTimeOnly(item.entrada_colacion)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fin Jornada:</Text>
              <Text style={styles.detailValue}>{formatTimeOnly(item.salida)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total:</Text>
              <Text style={styles.detailValue}>{item.horas_trabajadas} h</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// Helpers
function formatDateOnly(iso: string) {
  return new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatTimeOnly(iso: string) {
  return new Date(iso).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
