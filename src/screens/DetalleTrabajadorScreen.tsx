import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import styles from '../styles/detalleTrabajadorStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalleTrabajador'>;

const DetalleTrabajadorScreen = ({ route, navigation }: Props) => {
  const { trabajador } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.nombre}>{trabajador?.nombres}</Text>
      <Text style={styles.dato}>Cargo: {trabajador?.rol}</Text>
      <Text style={styles.dato}>
        Última Asistencia: {trabajador?.ultimaAsistencia ?? 'N/A'}
      </Text>
      <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate('MainTabs')}>
        <Text style={styles.textoBoton}>Volver al Inicio</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DetalleTrabajadorScreen;