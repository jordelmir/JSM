import React from 'react'; // useState and useRef are no longer needed
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert, // Still needed for Alert.alert
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
// ConfettiCannon, Haptics, activateCoupon, useTranslation, useUserStore are now imported within the hook
import { useCouponActivation } from '../../lib/hooks/useCouponActivation'; // New import

export default function CouponActivationScreen() {
  const params = useLocalSearchParams();
  const { couponId, couponDescription } = params; // Obtienes parámetros de la ruta

  const {
    isLoading,
    isActivated,
    showConfetti,
    handleActivateCoupon,
    confettiRef,
    setShowConfetti,
  } = useCouponActivation(); // Use the new hook

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
        <Text style={styles.title}>Activar Cupón</Text> {/* Translated */}
        <Text style={styles.description}>
          {couponDescription || '¡Estás a punto de activar una oferta increíble!'} {/* Translated */}
        </Text>
        
        {isActivated ? (
          <Text style={styles.successMessage}>🎉 ¡Cupón Activado Exitosamente! 🎉</Text> {/* Translated */}
        ) : (
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleActivateCoupon}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Activar Ahora</Text> {/* Translated */}
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