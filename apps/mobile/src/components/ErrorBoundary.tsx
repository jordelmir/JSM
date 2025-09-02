import React, { ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
// Assuming 't' function is passed as a prop or available via context/HOC
// import { useTranslation } from 'react-i18next'; // Cannot use directly in class component

/**
 * Props for the ErrorBoundary component.
 */
interface Props {
  /**
   * The child components that the ErrorBoundary will protect.
   */
  children: ReactNode;
  /**
   * Translation function from i18next, used to translate fallback messages.
   * This function is expected to be passed as a prop from a higher-order component or context.
   */
  t: (key: string) => string; // Add translation function to props
}

interface State {
  hasError: boolean;
}

/**
 * A React Error Boundary component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the entire application.
 * It uses a translation function `t` passed via props for internationalization of fallback messages.
 */
class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // In a real app, you would log the error to an error reporting service
  }

  public render() {
    const { t } = this.props; // Get t from props
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <View style={styles.container}>
          <Text style={styles.text}>{t("Something went wrong.")}</Text> {/* Translated */}
          <Text style={styles.text}>{t("Please restart the application.")}</Text> {/* Translated */}
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8d7da',
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: '#721c24',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default ErrorBoundary;
