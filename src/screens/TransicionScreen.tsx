import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import styles from '../styles/transiciónStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'Transicion'>;

const TransicionScreen = ({ navigation, route }: Props) => {
  const { trabajador } = route.params;

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('DetalleTrabajador', { trabajador });
      console.log('Redirigiendo a DetalleTrabajador con:', trabajador);
    }, 1500);
    return () => clearTimeout(timeout);
  }, [navigation, trabajador]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hola, {trabajador?.nombres} 👋</Text>
      <Text style={styles.subtitle}>Validando tu información…</Text>
      <ActivityIndicator size="large" color="#6EDC9D" style={styles.loader} />
    </View>
  );
};

export default TransicionScreen;
