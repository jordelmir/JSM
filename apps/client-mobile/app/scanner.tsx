import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { scanQRCode as apiScanQRCode } from '../src/api/coupon';
import { useUserStore } from './store/userStore';
import { useTranslation } from 'react-i18next'; // New import for translation

const { width, height } = Dimensions.get('window');

/**
 * ScannerScreen component for scanning QR codes.
 * It handles camera permissions, displays a camera view with an overlay,
 * processes scanned QR codes, and navigates to coupon activation or shows alerts.
 */
export default function ScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const apiScanQRCodeFunction = apiScanQRCode;
  const { user } = useUserStore();
  const { t } = useTranslation(); // Initialize useTranslation

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    if (scanned || isLoading) return;

    setScanned(true);
    setIsLoading(true);

    try {
      if (!user?.id) {
        Alert.alert(t('User not authenticated'), t('Please log in to scan QR codes.')); // Translated
        return;
      }

      // Basic client-side validation for QR code data format
      // Assuming QR code data is a string that should not be empty
      if (!data || typeof data !== 'string' || data.trim().length === 0) {
        throw new Error(t('Invalid QR code format.')); // Translated
      }

      const result = await apiScanQRCodeFunction(data, user.id);

      Alert.alert(t('QR Scanned!'), result.message, [
        {
          text: t('Activate Coupon'), // Translated
          onPress: () => {
            router.push({
              pathname: '/coupon-activation',
              params: { couponId: result.couponId },
            });
            setScanned(false); // Reset scanned state after navigation
          },
          style: 'default',
        },
        {
          text: t('View Later'), // Translated
          onPress: () => {
            router.back();
            setScanned(false); // Reset scanned state after navigation
          },
          style: 'cancel',
        },
      ]);
    } catch (error) {
      Alert.alert(
        t('Error'), // Translated
        error instanceof Error ? error.message : t('Error scanning QR'), // Translated
        [{ text: t('OK'), onPress: () => setScanned(false) }] // Translated
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setIsLoading(false); // Ensure isLoading is also reset
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>{t('Requesting camera permissions...')}</Text> {/* Translated */}
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Ionicons name="camera-outline" size={64} color="#8E8E93" />
        <Text style={styles.message}>
          {t('We need access to your camera to scan QR codes.')} {/* Translated */}
          {t('Please allow access in your device settings.')} {/* Translated */}
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
          }}
        >
          <Text style={styles.permissionButtonText}>{t('Retry Permissions')}</Text> {/* Translated */}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('Scan QR')}</Text> {/* Translated */}
        <View style={styles.placeholder} />
      </View>

      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        <View style={styles.overlay}>
          {/* Scanning Frame */}
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsText}>
              {t('Point the camera at the dispenser QR code')} {/* Translated */}
            </Text>
            {isLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.loadingText}>{t('Processing...')}</Text> {/* Translated */}
              </View>
            )}
          </View>

          {/* Reset Button */}
          {scanned && (
            <TouchableOpacity style={styles.resetButton} onPress={resetScanner}>
              <Ionicons name="refresh" size={24} color="#FFFFFF" />
              <Text style={styles.resetButtonText}>{t('Scan Another')}</Text> {/* Translated */}
            </TouchableOpacity>
          )}
        </View>
      </CameraView>

      {/* Bottom Instructions */}
      <View style={styles.bottomContainer}>
        <View style={styles.instructionItem}>
          <Ionicons name="qr-code-outline" size={24} color="#007AFF" />
          <Text style={styles.instructionText}>
            {t('Ask the employee to generate your QR code')} {/* Translated */}
          </Text>
        </View>
        <View style={styles.instructionItem}>
          <Ionicons name="ticket-outline" size={24} color="#FF6B35" />
          <Text style={styles.instructionText}>
            {t('Every ₡5,000 = 1 ticket for raffles')} {/* Translated */}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#007AFF',
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 100,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  instructionsText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    borderRadius: 8,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#FFFFFF', // Changed color for better visibility on dark overlay
    marginTop: 8,
    fontWeight: '600',
  },
  resetButton: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#1D1D1F',
    marginLeft: 12,
    flex: 1,
  },
  message: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});