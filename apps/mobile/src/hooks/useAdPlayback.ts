import { useState, useEffect, useRef } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { confirmAdWatched } from '../api/apiClient';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook to manage the playback of an ad and its confirmation process.
 * It handles the countdown timer, calls the `confirmAdWatched` API, and navigates
 * based on the confirmation result.
 * @returns {{ timeLeft: number, isConfirming: boolean, handleAdFinished: () => Promise<void>, adDurationSeconds: number }}
 *   - `timeLeft`: The remaining time in seconds for the ad to play.
 *   - `isConfirming`: A boolean indicating if the reward confirmation process is in progress.
 *   - `handleAdFinished`: An asynchronous function to call when the ad playback is considered complete, triggering the confirmation process.
 *   - `adDurationSeconds`: The total duration of the ad in seconds, used for progress calculation.
 */

type AdPlayerScreenRouteProp = RouteProp<{ params: { adUrl: string; redemptionId: string; adDurationSeconds?: number } }, 'params'>;

export const useAdPlayback = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<AdPlayerScreenRouteProp>();
  const { redemptionId, adDurationSeconds = 15 } = route.params;

  const [timeLeft, setTimeLeft] = useState(adDurationSeconds);
  const [isConfirming, setIsConfirming] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      handleAdFinished();
    }
  }, [timeLeft]);

  const handleAdFinished = async () => {
    setIsConfirming(true);
    try {
      await confirmAdWatched(redemptionId);
      Toast.show({
        type: 'success',
        text1: t('Reward Obtained!'),
        text2: t('You have earned points for watching the ad.'),
      });
      navigation.navigate('Home'); // Navigate back to home or a success screen
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: t('Confirmation Error'),
        text2: error.message,
      });
      navigation.goBack(); // Go back if ad confirmation fails
    } finally {
      setIsConfirming(false);
    }
  };

  return {
    timeLeft,
    isConfirming,
    handleAdFinished,
    adDurationSeconds, // Expose for progress calculation
  };
};