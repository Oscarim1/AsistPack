import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';

interface FeedbackModalProps {
  visible: boolean;
  message: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ visible, message }) => (
  <Modal transparent animationType="fade" visible={visible}>
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 24,
    minWidth: 200,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});

export default FeedbackModal;
