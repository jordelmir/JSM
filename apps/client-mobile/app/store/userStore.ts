import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  // Add other user properties as needed
}

interface UserState {
  user: User | null;
  token: string | null; // accessToken
  refreshToken: string | null; // Added refreshToken
  setUser: (user: User | null) => void;
  setTokens: (token: string | null, refreshToken: string | null) => void; // Modified to set both tokens
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null, // Initialize refreshToken
      setUser: (user) => set({ user }),
      setTokens: (token, refreshToken) => set({ token, refreshToken }), // Set both tokens
      logout: () => set({ user: null, token: null, refreshToken: null }), // Clear both tokens
    }),
    {
      name: 'client-mobile-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token, refreshToken: state.refreshToken }), // Persist both tokens
    }
  )
);
