import React from 'react'; // useState and useEffect are no longer needed
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
// Haptics, Alert are now imported within the hook
import RewardCascade from '../components/RewardCascade'; // Import RewardCascade
import { useAdSequenceStore } from '../lib/stores/useAdSequenceStore'; // Import Zustand store
import { useTranslation } from 'react-i18next'; // New import for translation
import { useAdSequenceFlow } from '../../lib/hooks/useAdSequenceFlow'; // New import

export default function TabScreen() {
  const { currentStep, totalTickets, totalSteps, watchAd, isSequenceCompleted } = useAdSequenceStore();
  const { t } = useTranslation(); // Initialize useTranslation

  const {
    isLoadingAd,
    showRewardCascade,
    handleWatchAd,
    handleRewardCascadeEnd,
  } = useAdSequenceFlow(); // Use the new hook

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("Client Dashboard")}</Text> {/* Translated */}
      <Text style={styles.subtitle}>{t("Ad Step")}: {currentStep} / {totalSteps}</Text> {/* Translated */}
      <Text style={styles.subtitle}>{t("Tickets Won")}: {totalTickets}</Text> {/* Translated */}

      <TouchableOpacity
        style={[styles.button, isLoadingAd && styles.buttonDisabled]}
        onPress={handleWatchAd}
        disabled={isLoadingAd || currentStep >= totalSteps} // Deshabilitar si ya completó
      >
        {isLoadingAd ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{t("Watch Next Ad")}</Text> {/* Translated */}
        )}
      </TouchableOpacity>

      {isSequenceCompleted && !showRewardCascade && (
        <Text style={styles.completedMessage}>{t("Ad Sequence Completed!")}</Text> {/* Translated */}
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