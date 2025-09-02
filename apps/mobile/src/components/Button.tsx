import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTranslation } from 'react-i18next'; // New import

/**
 * Props for the Button component.
 */
interface ButtonProps {
  /**
   * The text to display on the button. This will be translated.
   */
  title: string;
  /**
   * Callback function to be called when the button is pressed.
   */
  onPress: () => void;
  /**
   * If true, a loading indicator is shown and the button is disabled.
   * @default false
   */
  loading?: boolean;
  /**
   * Optional custom style for the button's container.
   */
  style?: ViewStyle;
  /**
   * Optional custom style for the button's text.
   */
  textStyle?: TextStyle;
  /**
   * If true, the button is disabled and cannot be pressed.
   * @default false
   */
  disabled?: boolean;
}

/**
 * A customizable button component for React Native applications.
 * It supports loading states, disabled states, and integrates with i18n for title translation.
 * Provides accessibility features via `accessibilityLabel`.
 */
export const Button: React.FC<ButtonProps> = ({ title, onPress, loading = false, style, textStyle, disabled = false }) => {
  const { t } = useTranslation(); // Initialize useTranslation

  return (
    <TouchableOpacity
      style={[styles.button, style, disabled || loading ? styles.buttonDisabled : {}]}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityLabel={t(title)} // Add accessibilityLabel
    >
      {loading ? (
        <ActivityIndicator color="#fff" testID="activity-indicator" />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{t(title)}</Text> // Translate title
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#a0c8ff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
