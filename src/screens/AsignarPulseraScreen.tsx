import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types/navigation';
import { crearTrabajador } from '../services/trabajadorService';
import styles from '../styles/asignarPulseraStyles';

// Tipo para las props de navegación
export type AsignarPulseraProps = NativeStackScreenProps<
  HomeStackParamList,
  'AsignarPulsera'
>;

export default function AsignarPulseraScreen({
  navigation,
  route,
}: AsignarPulseraProps) {
  const { trabajadorData } = route.params;
  const [uuid, setUuid] = useState('');

  useEffect(() => {
    setUuid(generateUUID());
  }, []);

  const handleConfirm = async () => {
    try {
      await crearTrabajador({ ...trabajadorData, pulsera_uuid: uuid });
      Alert.alert('Éxito', `Pulsera seteada con UUID:\n${uuid}`, [
        { text: 'OK', onPress: () => navigation.navigate('Inicio') },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo asignar la pulsera');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pulsera configurada</Text>
      <Text style={styles.uuid}>{uuid}</Text>
      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Aceptar</Text>
      </TouchableOpacity>
    </View>
  );
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
