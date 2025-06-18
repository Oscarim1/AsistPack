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
  actualizarEstado,
  consultarEstado,
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
  const [pulseraUuid, setPulseraUuid] = useState('');

  const handleScanPulsera = async () => {
    try {
      const uuid = 'PULS016';
      await consultarEstado(uuid);
      Alert.alert('Pulsera activa', 'Utilice otra pulsera');
    } catch (err: any) {
      if (err.response && err.response.status === 403) {
        setPulseraUuid('PULS016');
        Alert.alert('Pulsera lista', 'Pulsera asignada al usuario');
      } else {
        Alert.alert('Error', 'No se pudo verificar la pulsera');
      }
    }
  };

  const isValid =
    nombres.trim() && direccion.trim() && contacto.trim() && rol.trim() && pulseraUuid.trim();

  const handleSubmit = async () => {
    try {
      console.log('Datos a enviar:', {
        nombres,
        direccion,
        contacto,
        rol,
        pulseraUuid,
      });
      await crearTrabajador({
        nombres,
        direccion,
        contacto,
        rol,
        pulsera_uuid: pulseraUuid,
      });
      await actualizarEstado(pulseraUuid, 'activa');
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

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Pulsera UUID"
            value={pulseraUuid}
            editable={false}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleScanPulsera}
        >
          <Text style={styles.buttonText}>Escanear Pulsera</Text>
        </TouchableOpacity>

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
