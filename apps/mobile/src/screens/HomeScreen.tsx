import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../components/Button'; // Import the custom Button component
import { useUserStore } from '../store/userStore';
import { useTranslation } from 'react-i18next'; // New import for translation

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const setTokens = useUserStore((state) => state.setTokens);
  const { t } = useTranslation(); // Initialize useTranslation

  const handleLogout = () => {
    setTokens(null, null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('Welcome to Gasolinera JSM!')}</Text> {/* Translated */}
      <Text style={styles.subtitle}>{t('You are logged in.')}</Text> {/* Translated */}
      
      <View style={styles.buttonContainer}>
        <Button title={t('Scan QR')} onPress={() => navigation.navigate('Scanner')} /> {/* Translated */}
      </View>
      <View style={styles.buttonContainer}>
        <Button title={t('View Raffles')} onPress={() => navigation.navigate('Raffles')} /> {/* Translated */}
      </View>
      <View style={styles.buttonContainer}>
        <Button title={t('Logout')} onPress={handleLogout} /> {/* Translated */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F2F5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    color: '#555',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '80%',
    marginBottom: 15,
  },
});

export default HomeScreen;
