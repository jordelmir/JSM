import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native'; // Manual install: npx expo install lottie-react-native
import { Audio } from 'expo-av'; // Manual install: npx expo install expo-av

interface RewardCascadeProps {
  onAnimationEnd: () => void;
  animationDuration?: number; // New prop for configurable duration
}

/**
 * A component that displays a reward animation (e.g., Lottie confetti) and plays a sound.
 * It calls `onAnimationEnd` after a specified duration.
 */
export default function RewardCascade({ onAnimationEnd, animationDuration = 2000 }: RewardCascadeProps) {
  useEffect(() => {
    let sound: Audio.Sound | undefined;
    let timer: NodeJS.Timeout | undefined;

    const playSound = async () => {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          require('../assets/reward-sound.mp3') // Assuming asset path
        );
        sound = newSound;
        await sound.playAsync();
      } catch (e) {
        console.error('Error playing sound:', e);
      }
    };

    playSound();

    timer = setTimeout(() => {
      onAnimationEnd();
    }, animationDuration);

    return () => {
      if (timer) clearTimeout(timer);
      if (sound) sound.unloadAsync(); // Unload sound to free resources
    };
  }, [onAnimationEnd, animationDuration]);

  return (
    <View style={styles.overlay}>
      <LottieView
        source={require('../assets/reward-cascade.json')} // Assuming asset path
        autoPlay
        loop={false}
        style={styles.lottieAnimation}
        onAnimationFinish={() => {
          // Ensure onAnimationEnd is called even if Lottie finishes before setTimeout
          // This might be redundant with setTimeout, but good for robustness
          // onAnimationEnd();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent overlay
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
});