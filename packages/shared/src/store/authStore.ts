// Ruta: apps/admin/src/store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '../index'; // Import the shared User interface
import axios from 'axios'; // Import axios

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null, // accessToken will be in memory, but not persisted
      isAuthenticated: false,
      login: (userData, token) => set({ user: userData, accessToken: token, isAuthenticated: true }),
      logout: async () => {
        // Call API to invalidate token on server-side
        const token = useAuthStore.getState().accessToken;
        if (token) {
          try {
            await axios.post('/auth/logout', null, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
          } catch (error) {
            console.error('Error during server-side logout:', error);
            // Handle error, but still clear local state
          }
        }
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage', // Nombre de la clave en localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }), // Only persist user and isAuthenticated
    }
  )
);
