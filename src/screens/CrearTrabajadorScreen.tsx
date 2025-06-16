import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../types/navigation';
import { crearTrabajador } from '../services/trabajadorService';
import styles from '../styles/crearTrabajadorStyles';

type NavProp = NativeStackNavigationProp<HomeStackParamList, 'CrearTrabajador'>;

export default function CrearTrabajadorScreen() {
  const navigation = useNavigation<NavProp>();
  const [nombres, setNombres] = useState('');
  const [direccion, setDireccion] = useState('');
  const [contacto, setContacto] = useState('');
  const [rol, setRol] = useState('');
  const [pulseraUuid, setPulseraUuid] = useState('');

  useEffect(() => {
    NfcManager.start().catch(err => console.warn('NFC init failed', err));
  }, []);

  const generateUuid = () =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });

  const vincularPulsera = async () => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const uuid = generateUuid();
      const bytes = Ndef.encodeMessage([Ndef.textRecord(uuid)]);
      if (bytes) {
        await NfcManager.writeNdefMessage(bytes);
        setPulseraUuid(uuid);
        Alert.alert('Pulsera vinculada', `UUID: ${uuid}`);
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo escribir en la pulsera');
    } finally {
      NfcManager.cancelTechnologyRequest().catch(() => {});
    }
  };

  const isValid =
    nombres.trim() && direccion.trim() && contacto.trim() && rol.trim() && pulseraUuid.trim();

  const handleSubmit = async () => {
    try {
      await crearTrabajador({
        nombres,
        direccion,
        contacto,
        rol,
        pulsera_uuid: pulseraUuid,
      });
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
        <TouchableOpacity style={styles.button} onPress={vincularPulsera}>
          <Text style={styles.buttonText}>Vincular Pulsera</Text>
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
