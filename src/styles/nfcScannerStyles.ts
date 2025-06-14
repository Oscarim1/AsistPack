import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FCFCFC', // Fondo neutro muy claro
  },
  scrollContainer: {
    // Usamos flexGrow para que ScrollView ocupe todo el espacio,
    // y justifyContent: 'center' para centrar verticalmente si hay poco contenido.
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  card: {
    // Cada "tarjeta" tendrá fondo blanco con borde de color para resaltar
    backgroundColor: '#FFF',
    borderColor: '#A8DEBA',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,

    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // Elevation para Android
    elevation: 2,

    // Para que la tarjeta no ocupe 100% de ancho: 
    // definimos un ancho "máximo" y centramos
    width: '100%',           // Max ancho del card = ancho padre menos paddingHorizontal
    maxWidth: 500,           // Evita que se estire demasiado en tablets o pantallas anchas
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0E110F',
    marginBottom: 12,
    textAlign: 'center',
  },
  cardButton: {
    backgroundColor: '#A8DEBA',
    borderRadius: 25,
    paddingVertical: 12,
    // width dinámico desde el componente (screenWidth * 0.6), o puedes usar '80%' directamente.
    alignItems: 'center',
  },
  cardButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0E110F',
    textAlign: 'left',
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
});
