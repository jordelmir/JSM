import React from 'react'; // useState and useEffect are no longer needed
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
// Removed: getRaffles, getRaffleWinner, Raffle, RaffleWinner from '../api/apiClient';
// Removed: Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { useRafflesData } from '../hooks/useRafflesData'; // New import

export default function RafflesScreen() {
  const { t } = useTranslation();
  const { raffles, isLoading, error } = useRafflesData(); // Use the new hook

  const renderRaffleItem = ({ item }: { item: any }) => ( // Changed Raffle to any for now, will fix types later
    <View style={styles.raffleCard}>
      <Text style={styles.rafflePeriod}>{t('Period')}: {item.period}</Text>
      <Text style={styles.raffleStatus}>{t('Status')}: {item.status}</Text>
      {item.status === 'DRAWN' && item.winnerEntryId && (
        <Text style={styles.raffleWinner}>{t('Winner')}: {item.winnerEntryId}</Text>
      )}
      {item.status === 'DRAWN' && !item.winnerEntryId && (
        <Text style={styles.raffleWinner}>{t('Winner')}: {t('Pending/Not found')}</Text>
      )}
      {item.merkleRoot && (
        <Text style={styles.merkleRoot}>{t('Merkle Root')}: {item.merkleRoot.substring(0, 10)}...</Text>
      )}
      {/* TODO: Add button to view proof of inclusion */}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>{t('Loading raffles...')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t('Error')}: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('G-Points Raffles')}</Text>
      {raffles.length === 0 ? (
        <Text>{t('No raffles available at this time.')}</Text>
      ) : (
        <FlatList
          data={raffles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRaffleItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  raffleCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  rafflePeriod: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  raffleStatus: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  raffleWinner: {
    fontSize: 16,
    color: '#28a745',
    fontWeight: 'bold',
  },
  merkleRoot: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});