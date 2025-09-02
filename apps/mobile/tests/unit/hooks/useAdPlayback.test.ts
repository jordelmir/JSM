import { renderHook, act } from '@testing-library/react-native';
import { vi } from 'vitest';
import { useAdPlayback } from '../../../src/hooks/useAdPlayback'; // Adjust path
import { useNavigation, useRoute } from '@react-navigation/native';
import { confirmAdWatched } from '../../../src/api/apiClient'; // Adjust path
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

// Mock dependencies
vi.mock('@react-navigation/native');
vi.mock('../../../src/api/apiClient');
vi.mock('react-native-toast-message');
vi.mock('react-i18next');

describe('useAdPlayback', () => {
  const mockNavigate = vi.fn();
  const mockGoBack = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    (useNavigation as any).mockReturnValue({ navigate: mockNavigate, goBack: mockGoBack });
    (useRoute as any).mockReturnValue({ params: { adUrl: 'mock-url', redemptionId: 'mock-id', adDurationSeconds: 5 } });
    (confirmAdWatched as any).mockResolvedValue(undefined);
    (Toast.show as any).mockImplementation(() => {});
    (useTranslation as any).mockReturnValue({ t: (key: string) => key });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should initialize with correct timeLeft and isConfirming states', () => {
    const { result } = renderHook(() => useAdPlayback());
    expect(result.current.timeLeft).toBe(5);
    expect(result.current.isConfirming).toBe(false);
  });

  it('should decrement timeLeft every second', () => {
    const { result } = renderHook(() => useAdPlayback());
    expect(result.current.timeLeft).toBe(5);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.timeLeft).toBe(4);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.timeLeft).toBe(2);
  });

  it('should call handleAdFinished when timeLeft reaches 0', async () => {
    const { result } = renderHook(() => useAdPlayback());
    const spyHandleAdFinished = vi.spyOn(result.current, 'handleAdFinished');

    act(() => {
      vi.advanceTimersByTime(5000); // Advance to 0
    });

    expect(spyHandleAdFinished).toHaveBeenCalledTimes(1);
  });

  it('handleAdFinished should confirm ad watched and navigate home on success', async () => {
    const { result } = renderHook(() => useAdPlayback());

    await act(async () => {
      vi.advanceTimersByTime(5000); // Trigger handleAdFinished
    });

    expect(result.current.isConfirming).toBe(false); // Should be false after finally
    expect(confirmAdWatched).toHaveBeenCalledWith('mock-id');
    expect(Toast.show).toHaveBeenCalledWith({
      type: 'success',
      text1: 'Reward Obtained!',
      text2: 'You have earned points for watching the ad.',
    });
    expect(mockNavigate).toHaveBeenCalledWith('Home');
  });

  it('handleAdFinished should handle confirmation error and go back', async () => {
    const errorMessage = 'Confirmation failed';
    (confirmAdWatched as any).mockRejectedValue(new Error(errorMessage));
    const { result } = renderHook(() => useAdPlayback());

    await act(async () => {
      vi.advanceTimersByTime(5000); // Trigger handleAdFinished
    });

    expect(result.current.isConfirming).toBe(false); // Should be false after finally
    expect(confirmAdWatched).toHaveBeenCalledTimes(1);
    expect(Toast.show).toHaveBeenCalledWith({
      type: 'error',
      text1: 'Confirmation Error',
      text2: errorMessage,
    });
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
