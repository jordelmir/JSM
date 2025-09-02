import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { redeemQrCode } from '../api/apiClient'; // Adjust path
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next'; // Adjust path

/**
 * Custom hook to manage QR code scanning and redemption process.
 * It handles scanning state, calls the `redeemQrCode` API, navigates to the AdPlayer screen,
 * and provides user feedback via toast messages.
 * @returns {{ scanned: boolean, loading: boolean, handleScan: (data: { type: string; data: string }) => Promise<void>, resetScanner: () => void, setScanned: React.Dispatch<React.SetStateAction<boolean>> }}
 *   - `scanned`: A boolean indicating if a QR code has been scanned and is being processed.
 *   - `loading`: A boolean indicating if the redemption process is currently in progress.
 *   - `handleScan`: An asynchronous function to process a scanned QR code.
 *   - `resetScanner`: A function to reset the scanner's state, allowing for a new scan.
 *   - `setScanned`: Setter function for the `scanned` state, exposed for external control (e.g., to re-enable scanning).
 */
export const useQrCodeScanner = () => {
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const handleScan = async ({ data }: { data: string }) => {
    if (scanned || loading) return;

    setScanned(true);
    setLoading(true);
    try {
      const { adUrl, redemptionId } = await redeemQrCode(data);
      navigation.navigate('AdPlayer', { adUrl, redemptionId });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: t('Redemption Error'),
        text2: error.message,
      });
      setScanned(false); // Allow rescanning on error
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setLoading(false);
  };

  return {
    scanned,
    loading,
    handleScan,
    resetScanner,
    setScanned, // Expose setScanned for external control
  };
};