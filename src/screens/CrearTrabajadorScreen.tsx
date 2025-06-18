import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  actualizarEstadoPulsera,
  verificarPulsera,
} from '../services/pulseraService';
import { crearTrabajador } from '../services/trabajadorService';
import styles from '../styles/crearTrabajadorStyles';
import type { HomeStackParamList } from '../types/navigation';

type NavProp = NativeStackNavigationProp<HomeStackParamList, 'CrearTrabajador'>;

export default function CrearTrabajadorScreen() {
  const navigation = useNavigation<NavProp>();
  const [nombres, setNombres] = useState('');
  const [direccion, setDireccion] = useState('');
  const [contacto, setContacto] = useState('');
  const [rol, setRol] = useState('');
  const [pulsera_uuid, setPulseraUuid] = useState('');

  const handleScan = async () => {
    try {
      const uuid = 'PULS016';
      const estado = await verificarPulsera(uuid);
      if (estado && estado.estado === 'activa') {
        Alert.alert('Pulsera en uso', 'La pulsera está activa, usa otra.');
        return;
      }
      setPulseraUuid(uuid);
      Alert.alert('Pulsera lista', 'Pulsera asignada correctamente');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo verificar la pulsera');
    }
  };

  const isValid =
    nombres.trim() && direccion.trim() && contacto.trim() && rol.trim() && pulsera_uuid.trim();

  const handleSubmit = async () => {
    try {
      console.log('Creando trabajador con datos:', {
        nombres,
        direccion,
        contacto,
        rol,
        pulsera_uuid,
      });
      await crearTrabajador({
        nombres,
        direccion,
        contacto,
        rol,
        pulsera_uuid: pulsera_uuid,
      });
      await actualizarEstadoPulsera(pulsera_uuid, 'activa');
      Alert.alert('Éxito', 'Trabajador creado correctamente', [
        { text: 'OK', onPress: () => navigation.navigate('Inicio') },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo crear el trabajador');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Registrar Trabajador</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombres"
            value={nombres}
            onChangeText={setNombres}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Dirección"
            value={direccion}
            onChangeText={setDireccion}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Contacto"
            value={contacto}
            onChangeText={setContacto}
            keyboardType="phone-pad"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Rol"
            value={rol}
            onChangeText={setRol}
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleScan}>
          <Text style={styles.buttonText}>Escanear Pulsera</Text>
        </TouchableOpacity>
        {pulsera_uuid ? (
          <Text style={styles.scanInfo}>Pulsera: {pulsera_uuid}</Text>
        ) : null}

        <TouchableOpacity
          style={[styles.button, !isValid && styles.buttonDisabled]}
          disabled={!isValid}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Crear Trabajador</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
