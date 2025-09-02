import React from 'react'; // useState, useEffect, useRef are no longer needed
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'; // Still needed for navigation and route
import { WebView } from 'react-native-webview';
// Removed: confirmAdWatched
import Toast from 'react-native-toast-message'; // Still needed for Toast.show
import { useTranslation } from 'react-i18next';

import { useAdPlayback } from '../hooks/useAdPlayback'; // New import

type AdPlayerScreenRouteProp = RouteProp<{ params: { adUrl: string; redemptionId: string; adDurationSeconds?: number } }, 'params'>;

export default function AdPlayerScreen() {
  const navigation = useNavigation<any>(); // Still needed for navigation
  const route = useRoute<AdPlayerScreenRouteProp>(); // Still needed for route
  const { adUrl } = route.params; // adUrl is still needed here

  const { t } = useTranslation();

  const { timeLeft, isConfirming, handleAdFinished, adDurationSeconds } = useAdPlayback(); // Use the new hook

  const progress = ((adDurationSeconds - timeLeft) / adDurationSeconds) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.timerText}>{t('Your reward will be available in {{timeLeft}} seconds...', { timeLeft })}</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>
      <WebView 
        source={{ uri: adUrl }}
        style={styles.webview}
        onError={(e) => Toast.show({
          type: 'error',
          text1: t('Error'),
          text2: t('Could not load ad: {{description}}', { description: e.nativeEvent.description }),
        })}
      />
      {isConfirming &&
        <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>{t('Confirming reward...')}</Text>
        }
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 15,
    backgroundColor: '#1a1a1a',
  },
  timerText: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#444',
    borderRadius: 4,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
});