import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  actualizarEstado,
  consultarEstado,
} from '../services/pulseraService';
import { crearTrabajador } from '../services/trabajadorService';
import styles from '../styles/crearTrabajadorStyles';
import modalStyles from '../styles/tymeEntryModalStyles';
import type { HomeStackParamList } from '../types/navigation';

type NavProp = NativeStackNavigationProp<HomeStackParamList, 'CrearTrabajador'>;

export default function CrearTrabajadorScreen() {
  const navigation = useNavigation<NavProp>();
  const [nombres, setNombres] = useState('');
  const [direccion, setDireccion] = useState('');
  const [contacto, setContacto] = useState('');
  const [rol, setRol] = useState('');
  const [pulseraUuid, setPulseraUuid] = useState('');

  // Estado para modal de feedback
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showModal) {
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [showModal, scaleAnim]);

  const handleScanPulsera = async () => {
    try {
      const uuid = 'PULS016';
      await consultarEstado(uuid);
      setModalMessage('Pulsera activa\nUtilice otra pulsera');
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2500);
    } catch (err: any) {
      if (err.response && err.response.status === 403) {
        setPulseraUuid('PULS016');
        setModalMessage('Pulsera lista\nPulsera asignada al usuario');
        setShowModal(true);
        setTimeout(() => setShowModal(false), 2500);
      } else {
        setModalMessage('Error\nNo se pudo verificar la pulsera');
        setShowModal(true);
        setTimeout(() => setShowModal(false), 2500);
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
      setModalMessage('Trabajador creado correctamente');
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigation.navigate('Inicio');
      }, 2500);
    } catch (err: any) {
      setModalMessage(err.message || 'No se pudo crear el trabajador');
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2500);
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
      <Modal visible={showModal} transparent animationType="fade">
        <View style={modalStyles.overlay}>
          <Animated.View style={[modalStyles.content, { transform: [{ scale: scaleAnim }] }]}>
            <Feather name="alert-triangle" size={80} color="#FFA500" />
            <Text style={modalStyles.title}>¡Atención!</Text>
            <Text style={modalStyles.message}>{modalMessage}</Text>
          </Animated.View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
