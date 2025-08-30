import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ConfettiCannon from 'react-native-confetti-cannon';
import * as Haptics from 'expo-haptics'; // <-- 1. IMPORTACIÓN AÑADIDA

// --- Simulación de una llamada a API ---
const fakeActivateCouponAPI = (id: string): Promise<{ success: boolean }> => {
  console.log(`Activando cupón con ID: ${id}`);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1500);
  });
};
// ------------------------------------

export default function CouponActivationScreen() {
  const params = useLocalSearchParams();
  const { couponId, couponDescription } = params;

  const [isLoading, setIsLoading] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef<ConfettiCannon>(null);

  const handleActivateCoupon = async () => {
    if (!couponId) {
      Alert.alert("Error", "No se encontró el ID del cupón.");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fakeActivateCouponAPI(couponId as string);
      if (response.success) {
        // <-- 2. ¡AQUÍ OCURRE LA MAGIA MULTISENSORIAL! -->
        // Primero, la vibración para una respuesta inmediata.
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
        
        // Luego, actualizamos el estado para la respuesta visual.
        setIsActivated(true);
        setShowConfetti(true);
      } else {
        Alert.alert("Error", "No se pudo activar el cupón. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Ocurrió un problema de conexión.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {showConfetti && (
        <ConfettiCannon
          ref={confettiRef}
          count={200}
          origin={{ x: -10, y: 0 }}
          autoStart={true}
          fadeOut={true}
          onAnimationEnd={() => setShowConfetti(false)}
        />
      )}

      <View style={styles.card}>
        <Text style={styles.title}>Activar Cupón</Text>
        <Text style={styles.description}>
          {couponDescription || '¡Estás a punto de activar una oferta increíble!'}
        </Text>
        
        {isActivated ? (
          <Text style={styles.successMessage}>🎉 ¡Cupón Activado Exitosamente! 🎉</Text>
        ) : (
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleActivateCoupon}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Activar Ahora</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f7',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a0c7e4',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  successMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
    textAlign: 'center',
    marginVertical: 10,
  },
});
