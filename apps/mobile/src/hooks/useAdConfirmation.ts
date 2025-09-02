import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { confirmAdWatched } from '../api/apiClient';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook to manage the confirmation process after an ad has been watched.
 * It listens for video playback completion, calls the `confirmAdWatched` API,
 * and provides user feedback via alerts and navigates to the home screen.
 * @param {any} videoStatus - The playback status object from the Video component.
 * @returns {{ isAdWatched: boolean }}
 *   - `isAdWatched`: A boolean indicating if the ad has been confirmed as watched and points credited.
 */

type RedemptionScreenRouteProp = RouteProp<{ params: { adUrl: string; redemptionId: string } }, 'params'>;

export const useAdConfirmation = (videoStatus: any) => {
  const navigation = useNavigation<any>();
  const route = useRoute<RedemptionScreenRouteProp>();
  const { redemptionId } = route.params;

  const [isAdWatched, setIsAdWatched] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (videoStatus.didJustFinish && !isAdWatched) {
      setIsAdWatched(true);
      confirmAdWatched(redemptionId)
        .then(response => {
          Alert.alert(t('Points Credited!'), t(`New balance: {{balance}}`, { balance: response.balance }));
          navigation.navigate('Home');
        })
        .catch(error => {
          Alert.alert(t('Confirmation Error'), error.message);
          navigation.navigate('Home');
        });
    }
  }, [videoStatus, isAdWatched, redemptionId, navigation, t]);

  return { isAdWatched };
};