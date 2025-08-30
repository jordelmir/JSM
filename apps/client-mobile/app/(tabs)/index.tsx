import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import RewardCascade from '../components/RewardCascade'; // Import RewardCascade
import { useAdSequenceStore } from '../lib/stores/useAdSequenceStore'; // Import Zustand store

export default function TabScreen() {
  const { currentStep, totalTickets, totalSteps, watchAd, isSequenceCompleted } = useAdSequenceStore();
  const [isLoadingAd, setIsLoadingAd] = useState(false);
  const [showRewardCascade, setShowRewardCascade] = useState(false);

  // useEffect para disparar la cascada cuando el estado del store cambie a completado
  useEffect(() => {
    if (isSequenceCompleted) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowRewardCascade(true);
    }
  }, [isSequenceCompleted]);

  const handleWatchAd = async () => {
    setIsLoadingAd(true);
    // Simular la carga del anuncio
    await new Promise(resolve => setTimeout(resolve, 1000));
    watchAd(); // Llamar a la acción del store
    setIsLoadingAd(false);
  };

  const handleRewardCascadeEnd = () => {
    setShowRewardCascade(false);
    Alert.alert("¡Felicidades!", `Has ganado ${totalTickets} boletos para el sorteo.`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard Cliente</Text>
      <Text style={styles.subtitle}>Paso de Anuncio: {currentStep} / {totalSteps}</Text>
      <Text style={styles.subtitle}>Tickets Ganados: {totalTickets}</Text>

      <TouchableOpacity
        style={[styles.button, isLoadingAd && styles.buttonDisabled]}
        onPress={handleWatchAd}
        disabled={isLoadingAd || currentStep >= totalSteps} // Deshabilitar si ya completó
      >
        {isLoadingAd ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Ver Siguiente Anuncio</Text>
        )}
      </TouchableOpacity>

      {isSequenceCompleted && !showRewardCascade && (
        <Text style={styles.completedMessage}>¡Secuencia de Anuncios Completada!</Text>
      )}

      {showRewardCascade && (
        <RewardCascade onAnimationEnd={handleRewardCascadeEnd} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f7',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#90ee90',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  completedMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
    marginTop: 20,
  },
});