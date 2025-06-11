import { StyleSheet } from 'react-native';

const detalleTrabajadorStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nombre: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1B1E1C',
  },
  dato: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  boton: {
    marginTop: 40,
    backgroundColor: '#6EDC9D',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default detalleTrabajadorStyles;