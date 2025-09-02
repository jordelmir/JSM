import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAdSequenceStore } from '../lib/stores/useAdSequenceStore';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook to manage the ad watching sequence flow and reward cascade.
 * It handles loading states, interaction with the ad sequence store, haptic feedback,
 * and displaying reward alerts.
 * @returns {{ isLoadingAd: boolean, showRewardCascade: boolean, handleWatchAd: () => Promise<void>, handleRewardCascadeEnd: () => void }}
 *   - `isLoadingAd`: True if an ad is currently being loaded.
 *   - `showRewardCascade`: True if the reward cascade animation should be shown.
 *   - `handleWatchAd`: Asynchronous function to simulate watching an ad and update the ad sequence store.
 *   - `handleRewardCascadeEnd`: Function to call when the reward cascade animation finishes, triggering a reward alert.
 */
export const useAdSequenceFlow = () => {
  const { currentStep, totalTickets, totalSteps, watchAd, isSequenceCompleted } = useAdSequenceStore();
  const [isLoadingAd, setIsLoadingAd] = useState(false);
  const [showRewardCascade, setShowRewardCascade] = useState(false);

  const { t } = useTranslation();

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
    Alert.alert(t("Congratulations!"), t(`You have won ${totalTickets} tickets for the raffle.`));
  };

  return {
    isLoadingAd,
    showRewardCascade,
    handleWatchAd,
    handleRewardCascadeEnd,
  };
};