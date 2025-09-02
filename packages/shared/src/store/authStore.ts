// Ruta: apps/admin/src/store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '../index'; // Import the shared User interface
import axios from 'axios'; // Import axios

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null; // Added refreshToken
  isAuthenticated: boolean;
  login: (userData: User, accessToken: string, refreshToken: string) => void; // Modified login signature
  logout: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void; // Added setTokens action
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null, // Initialize refreshToken
      isAuthenticated: false,
      login: (userData, accessToken, refreshToken) => set({ user: userData, accessToken, refreshToken, isAuthenticated: true }), // Store refreshToken
      logout: async () => {
        // Call API to invalidate token on server-side
        const currentAccessToken = useAuthStore.getState().accessToken;
        if (currentAccessToken) {
          try {
            await axios.post('/auth/logout', null, {
              headers: {
                Authorization: `Bearer ${currentAccessToken}`,
              },
            });
          } catch (error) {
            console.error('Error during server-side logout:', error);
            // Handle error, but still clear local state
          }
        }
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }); // Clear refreshToken
      },
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }), // Implement setTokens
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated, refreshToken: state.refreshToken }), // Persist refreshToken
    }
  )
);
