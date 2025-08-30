import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useAdSequenceStore } from '../lib/stores/useAdSequenceStore';
import { Ionicons } from '@expo/vector-icons';

// Datos simulados para los sorteos
const activeRaffles = [
  { id: '1', title: 'Tarjeta de Regalo de $50 para Amazon', endsIn: '1d 5h' },
  { id: '2', title: 'Audífonos Inalámbricos Premium', endsIn: '3d 12h' },
  { id: '3', title: 'Cena para Dos en Restaurante Exclusivo', endsIn: '5d 2h' },
];

export default function RafflesScreen() {
  const { totalTickets } = useAdSequenceStore(); // ¡Leemos del cerebro central!

  return (
    <View style={styles.container}>
      <View style={styles.walletContainer}>
        <Text style={styles.walletLabel}>Mis Boletos</Text>
        <Text style={styles.walletTotal}>{totalTickets}</Text>
      </View>
      
      <Text style={styles.sectionTitle}>Sorteos Activos</Text>
      
      <FlatList
        data={activeRaffles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.raffleCard}>
            <Text style={styles.raffleTitle}>{item.title}</Text>
            <Text style={styles.raffleCountdown}>Termina en: {item.endsIn}</Text>
            <TouchableOpacity style={styles.participateButton}>
              <Text style={styles.buttonText}>Participar</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No hay sorteos activos en este momento.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    padding: 20,
  },
  walletContainer: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  walletLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  walletTotal: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  raffleCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  raffleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  raffleCountdown: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  participateButton: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});
