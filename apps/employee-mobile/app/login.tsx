import React, { useState } from "react";
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from 'react-i18next'; // New import for translation

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();
  const { t } = useTranslation(); // Initialize useTranslation

  const handleLogin = async () => {
    await login(email, password);
    if (error) {
      Alert.alert(t("Login Error"), error); // Translated
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("Login - Employee")}</Text> {/* Translated */}

      <TextInput
        style={styles.input}
        placeholder={t("Email Address")} {/* Translated */}
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder={t("Password")} {/* Translated */}
        placeholderTextColor="#ccc"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{t("Login")}</Text> {/* Translated */}
        )}
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 8,
    color: "#fff",
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 180,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "#FF6347",
    marginTop: 15,
    fontSize: 14,
  },
});
