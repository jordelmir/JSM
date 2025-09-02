import { useState } from "react"; // Still needed for email/password in LoginScreen
import { Alert } from "react-native";
import { loginEmployee } from "../src/api/employee";
import { useTranslation } from 'react-i18next'; // New import
import { useAuthStore } from '@gasolinera-jsm/shared/store/authStore'; // New import
import { useLoadingStore } from '../hooks/useLoadingStore'; // Assuming this is the correct path for loading store

/**
 * Custom hook for handling employee authentication (login).
 * It integrates with the shared authentication store and global loading state.
 * Displays alerts for success and error messages.
 * @returns {{ login: (email: string, password: string) => Promise<any>, loading: boolean, error: null }}
 *   - `login`: An asynchronous function to attempt employee login with provided credentials.
 *   - `loading`: A boolean indicating if the login process is currently in progress (derived from global loading store).
 *   - `error`: Always `null` as errors are handled via `Alert.alert` directly within the hook.
 */
export const useAuth = () => {
  const { t } = useTranslation();
  const authLogin = useAuthStore((state) => state.login); // Get login action from shared store
  const { isLoading } = useLoadingStore(); // Get global loading state

  const login = async (email: string, password: string) => {
    try {
      const employeeTokens = await loginEmployee({ email, password }); // Now returns TokenResponse
      console.log("Empleado logueado:", employeeTokens);
      // Call the shared auth store's login action with both tokens
      authLogin({} as any, employeeTokens.accessToken, employeeTokens.refreshToken); // Assuming employee object is not returned here, just tokens
      Alert.alert(t("Welcome"), "Employee"); // Translated, simplified message as employee object is not available
      return employeeTokens; // Return tokens
    } catch (err: any) {
      console.error("Error en login", err);
      const errorMessage = err?.message || t("Invalid credentials"); // Translated
      Alert.alert(t("Error"), errorMessage); // Translated
      throw err; // Re-throw to allow component to handle if needed
    }
  };

  return { login, loading: isLoading, error: null }; // Return login, and global loading/error (for now)
};