// src/styles/tymeEntryStyles.ts

import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    backgroundColor: '#FFF',
    justifyContent: 'center'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 4,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 12,
    color: '#666',
  },
  // Nuevo estilo para la hora
  timeText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  button: {
    width: '90%',
    paddingVertical: 14,
    backgroundColor: '#A8E6CF',
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  buttonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#004D40',
  },
});
