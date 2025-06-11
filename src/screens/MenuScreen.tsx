import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import styles from '../styles/menuStyles';
import { useAuth } from '../contexts/AuthContext';

export default function MenuScreen() {
  const { logout } = useAuth();

  const confirmarLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro que deseas salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú Principal</Text>
      {/* … puedes agregar aquí más opciones del menú … */}
      <TouchableOpacity style={styles.logoutButton} onPress={confirmarLogout}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}