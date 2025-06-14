import { StyleSheet, Platform, StatusBar } from 'react-native';


export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Header con selector de mes
  header: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight! : 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9F9F9',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },

  // Tarjeta de resumen
  summaryCard: {
    margin: 16,
    backgroundColor: '#A7E9D0',
    borderRadius: 12,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  summaryItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#444',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  // Lista de detalles
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  detailCard: {
    backgroundColor: '#F6F6F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  detailDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#555',
  },
  detailValue: {
    fontSize: 13,
    color: '#333',
  },

  // Estados sin datos
  noDataText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  linkText: {
    fontSize: 16,
    color: '#4BB543',
    textDecorationLine: 'underline',
  },
});