import { create } from 'zustand';

interface AuthState {
  token: string | null; // accessToken
  refreshToken: string | null; // Added refreshToken
  user: any | null;
  login: (accessToken: string, refreshToken: string, user: any) => void; // Modified login signature
  logout: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void; // Added setTokens action
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  refreshToken: null, // Initialize refreshToken
  user: null,
  login: (accessToken, refreshToken, user) => set({ accessToken, refreshToken, user }), // Store refreshToken
  logout: () => set({ token: null, refreshToken: null, user: null }), // Clear refreshToken
  setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }), // Implement setTokens
}));
