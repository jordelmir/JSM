import { act } from '@testing-library/react-native';
import { vi } from 'vitest';
import { useLoadingStore } from '../../../hooks/useLoadingStore'; // Adjust path

describe('useLoadingStore', () => {
  // Reset store state before each test
  beforeEach(() => {
    act(() => {
      useLoadingStore.setState({ activeRequests: 0, isLoading: false });
    });
  });

  it('should initialize with activeRequests 0 and isLoading false', () => {
    const { activeRequests, isLoading } = useLoadingStore.getState();
    expect(activeRequests).toBe(0);
    expect(isLoading).toBe(false);
  });

  it('startLoading should increment activeRequests and set isLoading to true', () => {
    act(() => {
      useLoadingStore.getState().startLoading();
    });
    const { activeRequests, isLoading } = useLoadingStore.getState();
    expect(activeRequests).toBe(1);
    expect(isLoading).toBe(true);
  });

  it('stopLoading should decrement activeRequests', () => {
    act(() => {
      useLoadingStore.getState().startLoading(); // activeRequests = 1
      useLoadingStore.getState().stopLoading(); // activeRequests = 0
    });
    const { activeRequests, isLoading } = useLoadingStore.getState();
    expect(activeRequests).toBe(0);
    expect(isLoading).toBe(false);
  });

  it('isLoading should remain true if activeRequests > 0', () => {
    act(() => {
      useLoadingStore.getState().startLoading(); // activeRequests = 1
      useLoadingStore.getState().startLoading(); // activeRequests = 2
      useLoadingStore.getState().stopLoading(); // activeRequests = 1
    });
    const { activeRequests, isLoading } = useLoadingStore.getState();
    expect(activeRequests).toBe(1);
    expect(isLoading).toBe(true);
  });

  it('stopLoading should not decrement activeRequests below 0', () => {
    act(() => {
      useLoadingStore.getState().stopLoading(); // activeRequests = 0 (already)
    });
    const { activeRequests, isLoading } = useLoadingStore.getState();
    expect(activeRequests).toBe(0);
    expect(isLoading).toBe(false);
  });

  it('should handle multiple start/stop calls correctly', () => {
    act(() => {
      useLoadingStore.getState().startLoading(); // 1
      useLoadingStore.getState().startLoading(); // 2
      useLoadingStore.getState().stopLoading(); // 1
      useLoadingStore.getState().startLoading(); // 2
      useLoadingStore.getState().stopLoading(); // 1
      useLoadingStore.getState().stopLoading(); // 0
    });
    const { activeRequests, isLoading } = useLoadingStore.getState();
    expect(activeRequests).toBe(0);
    expect(isLoading).toBe(false);
  });
});
