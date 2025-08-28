import React, { useState, useEffect } from "react";
import { 
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert 
} from "react-native";
import { BarCodeScanner } from 'expo-barcode-scanner'; // Add this import

import { createTicket, validateQRCode } from "libs/api/employee";
import { useAuth } from "../hooks/useAuth"; // Keep useAuth for now, but its usage will change

export default function App() {
  const [loadingAction, setLoadingAction] = useState<null | "ticket" | "qr">(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const { isAuthenticated, loading: authLoading } = useAuth(); // Get isAuthenticated and loading from useAuth

  import { Redirect } from 'expo-router'; // Add this import

  // Redirect to login if not authenticated
  if (!isAuthenticated && !authLoading) {
    return <Redirect href="/login" />;
  }

  const handleGenerateTicket = async () => {
    try {
      setLoadingAction("ticket");
      const ticket = await createTicket({ amount: 100 });
      console.log("Ticket generado:", ticket);
      Alert.alert("Éxito", `Ticket #${ticket.id} generado`);
    } catch (error: any) {
      console.error("Error generando ticket", error);
      Alert.alert("Error", error?.message || "No se pudo generar el ticket");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    setLoadingAction("qr");
    try {
      const validation = await validateQRCode(data);
      console.log("QR validado:", validation);
      Alert.alert("QR válido", JSON.stringify(validation), [{ text: "OK", onPress: () => setScanned(false) }]);
    } catch (error: any) {
      console.error("Error validando QR", error);
      Alert.alert("Error", error?.message || "QR inválido", [{ text: "OK", onPress: () => setScanned(false) }]);
    } finally {
      setLoadingAction(null);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Solicitando permisos de cámara...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No tenemos acceso a la cámara.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gasolinera JSM - Employee</Text>

      <TouchableOpacity style={styles.button} onPress={handleGenerateTicket} disabled={loadingAction==="ticket"}>
        {loadingAction === "ticket" ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Generar Ticket</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: "#007AFF" }]} 
        onPress={() => setScanned(false)} // Re-enable scanner
        disabled={loadingAction==="qr"}
      >
        {loadingAction === "qr" ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Escanear QR</Text>
        )}
      </TouchableOpacity>

      {scanned && (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
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
