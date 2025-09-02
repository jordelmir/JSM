import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'; // Added ActivityIndicator
import { useAdSequenceStore } from '../lib/stores/useAdSequenceStore';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useRaffles } from '../../lib/hooks/useRaffles'; // New import

export default function RafflesScreen() {
  const { totalTickets } = useAdSequenceStore();
  const { t } = useTranslation();
  const { raffles, isLoading, error } = useRaffles(); // Use the new hook

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>{t('Loading raffles...')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t('Error loading raffles:')} {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.walletContainer}>
        <Text style={styles.walletLabel}>{t("My Tickets")}</Text>
        <Text style={styles.walletTotal}>{totalTickets}</Text>
      </View>
      
      <Text style={styles.sectionTitle}>{t("Active Raffles")}</Text>
      
      <FlatList
        data={raffles} // Use data from the hook
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.raffleCard}>
            <Text style={styles.raffleTitle}>{t(item.title)}</Text>
            <Text style={styles.raffleCountdown}>{t("Ends in:")} {item.endsIn}</Text>
            <TouchableOpacity style={styles.participateButton}>
              <Text style={styles.buttonText}>{t("Participate")}</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>{t("No active raffles at the moment.")}</Text>
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
    backgroundColor: 'white',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffebee',
    borderRadius: 10,
    margin: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
  },
});
