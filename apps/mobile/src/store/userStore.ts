import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store'; // Import SecureStore

interface UserState {
  accessToken: string | null;
  refreshToken: string | null;
  points: number;
  setTokens: (access: string, refresh: string) => Promise<void>; // Make setTokens async
  setPoints: (points: number) => void;
  loadTokens: () => Promise<void>; // Add loadTokens action
}

export const useUserStore = create<UserState>((set) => ({
  accessToken: null,
  refreshToken: null,
  points: 0,
  setTokens: async (access, refresh) => {
    if (access) {
      await SecureStore.setItemAsync('accessToken', access);
    } else {
      await SecureStore.deleteItemAsync('accessToken');
    }
    if (refresh) {
      await SecureStore.setItemAsync('refreshToken', refresh);
    } else {
      await SecureStore.deleteItemAsync('refreshToken');
    }
    set({ accessToken: access, refreshToken: refresh });
  },
  setPoints: (points) => set({ points }),
  loadTokens: async () => {
    const access = await SecureStore.getItemAsync('accessToken');
    const refresh = await SecureStore.getItemAsync('refreshToken');
    set({ accessToken: access, refreshToken: refresh });
  },
}));
