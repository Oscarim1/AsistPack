import { Feather } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Modal, Text, View } from 'react-native';
import modalStyles from '../src/styles/modalStyles';

type FeedbackModalProps = {
  visible: boolean;
  message: string;
  /** Texto mostrado como título del modal */
  title?: string;
  /** Icono de Feather a mostrar en el encabezado */
  iconName?: React.ComponentProps<typeof Feather>['name'];
};

export default function FeedbackModal({
  visible,
  message,
  title = '¡Atención!',
  iconName = 'alert-triangle',
}: FeedbackModalProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible, scaleAnim]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={modalStyles.overlay}>
        <Animated.View style={[modalStyles.content, { transform: [{ scale: scaleAnim }] }]}>
          <Feather
            name={iconName}
            size={80}
            color="#FFA500"
            style={modalStyles.icon}
          />
          <Text style={modalStyles.title}>{title}</Text>
          <Text style={modalStyles.message}>{message}</Text>
        </Animated.View>
      </View>
    </Modal>
  );
}
