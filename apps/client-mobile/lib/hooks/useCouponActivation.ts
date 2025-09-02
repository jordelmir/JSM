import { useState, useRef } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ConfettiCannon from 'react-native-confetti-cannon';
import * as Haptics from 'expo-haptics';
import { activateCoupon } from '../../src/api/coupon'; // Adjust path
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../app/store/userStore'; // Adjust path

/**
 * Custom hook to manage the coupon activation process.
 * It handles loading states, coupon activation API calls, success/error feedback,
 * and confetti animation.
 * @returns {{ isLoading: boolean, isActivated: boolean, showConfetti: boolean, handleActivateCoupon: () => Promise<void>, confettiRef: React.RefObject<ConfettiCannon>, setShowConfetti: React.Dispatch<React.SetStateAction<boolean>> }}
 *   - `isLoading`: True if the activation process is in progress.
 *   - `isActivated`: True if the coupon has been successfully activated.
 *   - `showConfetti`: True if confetti animation should be shown.
 *   - `handleActivateCoupon`: Asynchronous function to initiate the coupon activation process.
 *   - `confettiRef`: A ref object to control the ConfettiCannon component.
 *   - `setShowConfetti`: Setter function for the `showConfetti` state.
 */
export const useCouponActivation = () => {
  const params = useLocalSearchParams();
  const { couponId } = params;

  const [isLoading, setIsLoading] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef<ConfettiCannon>(null);

  const { t } = useTranslation();
  const { user } = useUserStore();

  const handleActivateCoupon = async () => {
    if (!couponId) {
      Alert.alert(t("Error"), t("No coupon ID found."));
      return;
    }
    
    if (!user?.id) {
      Alert.alert(t("Error"), t("User not authenticated. Please log in."));
      return;
    }

    setIsLoading(true);
    try {
      const response = await activateCoupon(couponId as string, user.id);
      if (response.success) {
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
        setIsActivated(true);
        setShowConfetti(true);
      } else {
        Alert.alert(t("Error"), t("Could not activate coupon. Please try again."));
      }
    } catch (error) {
      console.error(error);
      Alert.alert(t("Error"), t("A connection problem occurred."));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isActivated,
    showConfetti,
    handleActivateCoupon,
    confettiRef,
    setShowConfetti, // Expose setter for confetti cleanup
  };
};