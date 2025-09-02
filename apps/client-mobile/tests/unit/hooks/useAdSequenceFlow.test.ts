import { renderHook, act } from '@testing-library/react-native';
import { vi } from 'vitest';
import { useAdSequenceFlow } from '../../../src/lib/hooks/useAdSequenceFlow';
import { useAdSequenceStore } from '../../../src/lib/stores/useAdSequenceStore';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

// Mock dependencies
vi.mock('../../../src/lib/stores/useAdSequenceStore');
vi.mock('expo-haptics');
vi.mock('react-i18next');
vi.mock('react-native', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-native')>();
  return {
    ...actual,
    Alert: { alert: vi.fn() },
  };
});

describe('useAdSequenceFlow', () => {
  const mockWatchAd = vi.fn();
  const mockUseAdSequenceStore = {
    currentStep: 1,
    totalTickets: 5,
    totalSteps: 3,
    watchAd: mockWatchAd,
    isSequenceCompleted: false,
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    (useAdSequenceStore as any).mockReturnValue(mockUseAdSequenceStore);
    (Haptics.notificationAsync as any).mockResolvedValue(undefined);
    (useTranslation as any).mockReturnValue({ t: (key: string) => key });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should initialize with correct states', () => {
    const { result } = renderHook(() => useAdSequenceFlow());
    expect(result.current.isLoadingAd).toBe(false);
    expect(result.current.showRewardCascade).toBe(false);
  });

  it('handleWatchAd should set loading state and call watchAd', async () => {
    const { result } = renderHook(() => useAdSequenceFlow());

    const promise = act(async () => {
      await result.current.handleWatchAd();
    });

    expect(result.current.isLoadingAd).toBe(true);
    vi.advanceTimersByTime(1000);
    await promise; // Wait for the promise inside act to resolve

    expect(mockWatchAd).toHaveBeenCalledTimes(1);
    expect(result.current.isLoadingAd).toBe(false);
  });

  it('should trigger reward cascade and haptics when sequence is completed', () => {
    (useAdSequenceStore as any).mockReturnValue({ ...mockUseAdSequenceStore, isSequenceCompleted: true });
    const { result } = renderHook(() => useAdSequenceFlow());

    // useEffect runs on mount, so it should trigger immediately
    expect(result.current.showRewardCascade).toBe(true);
    expect(Haptics.notificationAsync).toHaveBeenCalledWith(Haptics.NotificationFeedbackType.Success);
  });

  it('handleRewardCascadeEnd should hide confetti and show alert', () => {
    const { result } = renderHook(() => useAdSequenceFlow());
    act(() => {
      result.current.handleRewardCascadeEnd();
    });

    expect(result.current.showRewardCascade).toBe(false);
    expect(Alert.alert).toHaveBeenCalledWith(
      'Congratulations!',
      'You have won 5 tickets for the raffle.'
    );
  });
});
