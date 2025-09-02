import { create } from 'zustand';

/**
 * Represents the state of the global loading indicator.
 */
interface LoadingState {
  /**
   * The number of currently active loading requests.
   */
  activeRequests: number;
  /**
   * Increments the count of active requests and sets `isLoading` to true.
   */
  startLoading: () => void;
  /**
   * Decrements the count of active requests and sets `isLoading` to false if no requests are active.
   */
  stopLoading: () => void;
  /**
   * A boolean indicating if there are any active loading requests.
   */
  isLoading: boolean;
}

/**
 * A Zustand store for managing a global loading state.
 * It tracks the number of active requests and provides methods to start and stop loading.
 * `isLoading` is true if `activeRequests` is greater than 0.
 */
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