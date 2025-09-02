import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Spinner } from '../components/Spinner'; // Import the new Spinner component
import { Button } from '../components/Button'; // Import the custom Button component
import { requestOtp, verifyOtp } from '../api/apiClient';
import { useUserStore } from '../store/userStore';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next'; // New import for translation

// La navegación ahora se manejaría en un navigator raíz que observa el estado del userStore
const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const setTokens = useUserStore((state) => state.setTokens);
  const { t } = useTranslation(); // Initialize useTranslation

  const handleRequestOtp = async () => {
    if (!phone) {
      Toast.show({
        type: 'error',
        text1: t('Invalid Input'), // Translated
        text2: t('Please enter a phone number.'), // Translated
      });
      return;
    }
    setLoading(true);
    try {
      await requestOtp(phone);
      setOtpRequested(true);
      Toast.show({
        type: 'success',
        text1: t('OTP Sent'), // Translated
        text2: t(`A code has been sent to ${phone}.`),
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: t('Error'), // Translated
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      Toast.show({
        type: 'error',
        text1: t('Invalid Input'), // Translated
        text2: t('Please enter the OTP code.'), // Translated
      });
      return;
    }
    setLoading(true);
    try {
      const { accessToken } = await verifyOtp(phone, otp);
      setTokens(accessToken, null); // Actualiza el estado global, lo que debería disparar la navegación
      Toast.show({
        type: 'success',
        text1: t('Success'), // Translated
        text2: t('Session started successfully!'), // Translated
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: t('Verification Error'), // Translated
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('Welcome')}</Text> {/* Translated */}
      <Text style={styles.subtitle}>{t('Enter your phone to continue')}</Text> {/* Translated */}
      
      {!otpRequested ? (
        <>
          <TextInput
            style={styles.input}
            placeholder={t('Phone Number')} {/* Translated */}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            editable={!loading}
          />
          {loading ? <Spinner /> : <Button title={t('Send Code')} onPress={handleRequestOtp} loading={loading} />} {/* Translated */}
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder={t('6-digit Code')} {/* Translated */}
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
            editable={!loading}
          />
          {loading ? <Spinner /> : <Button title={t('Verify and Login')} onPress={handleVerifyOtp} loading={loading} />} {/* Translated */}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F2F5', // Light gray background
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333', // Darker text for contrast
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#555', // Slightly lighter text
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#007bff', // Blue border for focus
    borderRadius: 10, // More rounded corners
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff', // White background for input
    shadowColor: '#000', // Subtle shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Android shadow
  },
});

export default LoginScreen;