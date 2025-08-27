import { create } from 'zustand';

interface User {
  id: string;
  // Add other user properties as needed
}

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: { id: 'mock-user-id-123' }, // Mock user for development
  setUser: (user) => set({ user }),
}));