import { create } from 'zustand';

interface LoadingState {
  activeRequests: number;
  startLoading: () => void;
  stopLoading: () => void;
  isLoading: boolean;
}

export const useLoadingStore = create<LoadingState>((set, get) => ({
  activeRequests: 0,
  isLoading: false,
  startLoading: () => set(state => {
    const newCount = state.activeRequests + 1;
    return { activeRequests: newCount, isLoading: newCount > 0 };
  }),
  stopLoading: () => set(state => {
    const newCount = Math.max(0, state.activeRequests - 1); // Ensure it doesn't go below 0
    return { activeRequests: newCount, isLoading: newCount > 0 };
  }),
}));
