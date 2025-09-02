import { useState } from 'react';
import { Alert } from 'react-native';
import { validateQRCode } from '../src/api/employee'; // Adjust path
import { useTranslation } from 'react-i18next'; // Adjust path

/**
 * Custom hook to manage QR code scanning and validation process.
 * It handles scanning state, calls the `validateQRCode` API, and provides user feedback via alerts.
 * @returns {{ isScanning: boolean, isLoadingQr: boolean, handleScan: (data: { type: string; data: string }) => Promise<void>, resetScanner: () => void }}
 *   - `isScanning`: A boolean indicating if the QR scanner is currently active.
 *   - `isLoadingQr`: A boolean indicating if QR code validation is in progress.
 *   - `handleScan`: An asynchronous function to process a scanned QR code.
 *   - `resetScanner`: A function to reset the scanner's state, allowing for a new scan.
 */
export const useQrScanner = () => {
  const [isScanning, setIsScanning] = useState(false); // Renamed 'scanned' to 'isScanning' for clarity
  const [isLoadingQr, setIsLoadingQr] = useState(false); // Renamed 'loadingAction' for QR to 'isLoadingQr'
  const { t } = useTranslation();

  const handleScan = async ({ type, data }: { type: string; data: string }) => {
    if (isScanning || isLoadingQr) return; // Prevent multiple scans

    setIsScanning(true);
    setIsLoadingQr(true);
    try {
      const validation = await validateQRCode(data);
      console.log(t("QR validated:"), validation);
      Alert.alert(t("Valid QR"), JSON.stringify(validation), [{ text: t("OK"), onPress: () => setIsScanning(false) }]);
    } catch (error: any) {
      console.error(t("Error validating QR"), error);
      Alert.alert(t("Error"), error?.message || t("Invalid QR"), [{ text: t("OK"), onPress: () => setIsScanning(false) }]);
    } finally {
      setIsLoadingQr(false);
    }
  };

  const resetScanner = () => {
    setIsScanning(false);
    setIsLoadingQr(false);
  };

  return {
    isScanning,
    isLoadingQr,
    handleScan,
    resetScanner,
  };
};