import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

/**
 * Props for the Spinner component.
 */
interface SpinnerProps {
  /**
   * The size of the spinner.
   * @default "large"
   */
  size?: "small" | "large";
  /**
   * The color of the spinner.
   * @default "#0000ff" (blue)
   */
  color?: string;
}

/**
 * A simple wrapper component for React Native's ActivityIndicator.
 * Provides a centralized way to display a loading spinner with customizable size and color.
 */
export const Spinner: React.FC<SpinnerProps> = ({ size = "large", color = "#0000ff" }) => {
  return (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  spinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});