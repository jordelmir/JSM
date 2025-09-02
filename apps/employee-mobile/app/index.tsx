import React from "react"; // useState and useEffect are no longer needed
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert 
} from "react-native";
import { BarCodeScanner } from 'expo-barcode-scanner'; // Still needed for BarCodeScanner component
import { Redirect } from 'expo-router';

import { useAuth } from "../hooks/useAuth";
import { useTranslation } from 'react-i18next';

import { useCameraPermissions } from '../hooks/useCameraPermissions'; // New import
import { useTicketGeneration } from '../hooks/useTicketGeneration'; // New import
import { useQrScanner } from '../hooks/useQrScanner'; // New import

export default function App() {
  const { t } = useTranslation();
  const { hasPermission, requestPermissions } = useCameraPermissions(); // Use the new hook
  const { isLoadingTicket, generateTicket } = useTicketGeneration(); // Use the new hook
  const { isScanning, isLoadingQr, handleScan, resetScanner } = useQrScanner(); // Use the new hook

  const { isAuthenticated, loading: authLoading } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated && !authLoading) {
    return <Redirect href="/login" />;
  }

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>{t("Requesting camera permissions...")}</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>{t("We do not have camera access.")}</Text>
        <TouchableOpacity
          style={styles.button} // Reusing button style
          onPress={requestPermissions}
        >
          <Text style={styles.buttonText}>{t("Grant Permissions")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("Gasolinera JSM - Employee")}</Text>

      <TouchableOpacity style={styles.button} onPress={generateTicket} disabled={isLoadingTicket}>
        {isLoadingTicket ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{t("Generate Ticket")}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: "#007AFF" }]} 
        onPress={() => isScanning ? resetScanner() : handleScan({ type: 'qr', data: '' })} // Toggle scan or reset
        disabled={isLoadingQr}
      >
        {isLoadingQr ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{isScanning ? t("Stop Scan") : t("Scan QR")}</Text>
        )}
      </TouchableOpacity>

      {isScanning && (
        <BarCodeScanner
          onBarCodeScanned={isScanning ? handleScan : undefined} // Only scan if isScanning is true
          style={StyleSheet.absoluteFillObject}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#121212" },
  title: { fontSize: 22, fontWeight: "600", color: "#fff", marginBottom: 20 },
  button: { backgroundColor: "#4CAF50", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, marginBottom: 12, minWidth: 180, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16 },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center", zIndex: 10 },
  loadingText: { marginTop: 10, color: "#fff", fontSize: 18, fontWeight: "500" },
  message: { fontSize: 16, color: "#8E8E93", textAlign: "center", marginBottom: 20 }
});
