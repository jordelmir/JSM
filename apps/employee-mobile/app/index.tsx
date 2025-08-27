import React, { useState } from "react";
import { 
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert 
} from "react-native";

import { createTicket, validateQRCode } from "libs/api/employee";
import { useAuth } from "../hooks/useAuth"; // New import

export default function App() {
  const [loadingAction, setLoadingAction] = useState<null | "login" | "ticket" | "qr">(null);

  const { login, loading: authLoading } = useAuth(); // Integrate useAuth hook

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

  const handleValidateQR = async (qrData: string) => {
    try {
      setLoadingAction("qr");
      const validation = await validateQRCode(qrData);
      console.log("QR validado:", validation);
      Alert.alert("QR válido", JSON.stringify(validation));
    } catch (error: any) {
      console.error("Error validando QR", error);
      Alert.alert("Error", error?.message || "QR inválido");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gasolinera JSM - Employee</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => login("empleado1", "1234")} // Call login from hook, still using placeholder for now
        disabled={authLoading} // Use loading state from hook
      >
        {authLoading ? ( // Use loading state from hook
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleGenerateTicket} disabled={loadingAction==="ticket"}>
        {loadingAction === "ticket" ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Generar Ticket</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: "#007AFF" }]} 
        onPress={() => handleValidateQR("FAKE-QR-123")} 
        disabled={loadingAction==="qr"}
      >
        {loadingAction === "qr" ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Validar QR</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#121212" },
  title: { fontSize: 22, fontWeight: "600", color: "#fff", marginBottom: 20 },
  button: { backgroundColor: "#4CAF50", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, marginBottom: 12, minWidth: 180, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16 },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center", zIndex: 10 },
  loadingText: { marginTop: 10, color: "#fff", fontSize: 18, fontWeight: "500" }
});
