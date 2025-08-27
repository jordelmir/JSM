import { useState } from "react";
import { Alert } from "react-native";
import { loginEmployee } from "libs/api/employee"; // Assuming this path is correct from index.tsx

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const employee = await loginEmployee({ username, password });
      console.log("Empleado logueado:", employee);
      Alert.alert("Bienvenido", employee.name);
      return employee;
    } catch (err: any) {
      console.error("Error en login", err);
      const errorMessage = err?.message || "Credenciales inválidas";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
      throw err; // Re-throw to allow component to handle if needed
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};