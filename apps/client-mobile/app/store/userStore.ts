import { create } from 'zustand';

interface User {
  id: string;
  // Add other user properties as needed
}

interface UserState {
  user: User | null;
  token: string | null; // Add token field
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void; // Add setToken action
  logout: () => void; // Add logout action
}

export const useUserStore = create<UserState>((set) => ({
  user: null, // No mock user
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null }),
}));