import React, { useRef, useState } from 'react'; // useEffect is no longer needed
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
// Removed: confirmAdWatched
// Removed: Toast from 'react-native-toast-message';
// Removed: useTranslation
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'; // Still needed for navigation and route

import { useAdConfirmation } from '../hooks/useAdConfirmation'; // New import

type RedemptionScreenRouteProp = RouteProp<{ params: { adUrl: string; redemptionId: string } }, 'params'>;

export default function RedemptionScreen() {
  const navigation = useNavigation<any>(); // Still needed for navigation
  const route = useRoute<RedemptionScreenRouteProp>(); // Still needed for route
  const { adUrl, redemptionId } = route.params; // Destructure params

  const video = useRef(null);
  const [status, setStatus] = useState<any>({}); // Use any for now, VideoPlaybackStatus is complex

  const { isAdWatched } = useAdConfirmation(status); // Use the new hook

  return (
    <View style={styles.container}>
      {isAdWatched ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <Video
          ref={video}
          style={styles.video}
          source={{ uri: adUrl }} // Use adUrl from route params
          useNativeControls={false} // Non-skippable
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
          onPlaybackStatusUpdate={status => setStatus(() => status)}
          shouldPlay
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#000' },
  video: { alignSelf: 'center', width: '100%',
    height: '100%' },
});
