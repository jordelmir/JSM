import React from 'react'; // useState and useEffect are no longer needed
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { CameraView, Camera } from 'expo-camera/next'; // Still needed for CameraView component
import { useNavigation } from '@react-navigation/native'; // Still needed for navigation
import Toast from 'react-native-toast-message'; // Still needed for Toast.show
import { useTranslation } from 'react-i18next';

import { useCameraPermissions } from '../hooks/useCameraPermissions'; // New import
import { useQrCodeScanner } from '../hooks/useQrCodeScanner'; // New import

export default function ScannerScreen() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const { hasPermission, requestPermissions } = useCameraPermissions(); // Use the new hook
  const { scanned, loading, handleScan, resetScanner, setScanned } = useQrCodeScanner(); // Use the new hook

  if (hasPermission === null) {
    return <View style={styles.permissionContainer}><Text>{t('Requesting camera permission...')}</Text></View>;
  }
  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text>{t('No camera access.')}</Text>
        <Button title={t('Grant Permissions')} onPress={requestPermissions} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned || loading ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>{t('Validating QR...')}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
});
