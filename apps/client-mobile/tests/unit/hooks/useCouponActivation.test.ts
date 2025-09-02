import { renderHook, act } from '@testing-library/react-native';
import { vi } from 'vitest';
import { useCouponActivation } from '../../../src/lib/hooks/useCouponActivation'; // Adjust path
import { useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { activateCoupon } from '../../../src/api/coupon'; // Adjust path
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../../../app/store/userStore'; // Adjust path
import { Alert } from 'react-native'; // For mocking Alert.alert

// Mock dependencies
vi.mock('expo-router');
vi.mock('expo-haptics');
vi.mock('../../../src/api/coupon');
vi.mock('react-i18next');
vi.mock('../../../app/store/userStore');
vi.mock('react-native', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-native')>();
  return {
    ...actual,
    Alert: {
      alert: vi.fn(),
    },
  };
});

describe('useCouponActivation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useLocalSearchParams as any).mockReturnValue({ couponId: 'test-coupon-id' });
    (useTranslation as any).mockReturnValue({ t: (key: string) => key });
    (useUserStore as any).mockReturnValue({ user: { id: 'test-user-id' } });
    (Haptics.notificationAsync as any).mockResolvedValue(undefined);
    (activateCoupon as any).mockResolvedValue({ success: true });
  });

  it('should initialize with correct states', () => {
    const { result } = renderHook(() => useCouponActivation());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isActivated).toBe(false);
    expect(result.current.showConfetti).toBe(false);
    expect(result.current.confettiRef.current).toBeNull();
  });

  it('should show alert if couponId is missing', async () => {
    (useLocalSearchParams as any).mockReturnValue({ couponId: undefined });
    const { result } = renderHook(() => useCouponActivation());

    await act(async () => {
      await result.current.handleActivateCoupon();
    });

    expect(Alert.alert).toHaveBeenCalledWith('Error', 'No coupon ID found.');
    expect(result.current.isLoading).toBe(false);
    expect(activateCoupon).not.toHaveBeenCalled();
  });

  it('should show alert if user is not authenticated', async () => {
    (useUserStore as any).mockReturnValue({ user: null });
    const { result } = renderHook(() => useCouponActivation());

    await act(async () => {
      await result.current.handleActivateCoupon();
    });

    expect(Alert.alert).toHaveBeenCalledWith('Error', 'User not authenticated. Please log in.');
    expect(result.current.isLoading).toBe(false);
    expect(activateCoupon).not.toHaveBeenCalled();
  });

  it('should activate coupon successfully', async () => {
    const { result } = renderHook(() => useCouponActivation());

    await act(async () => {
      await result.current.handleActivateCoupon();
    });

    expect(activateCoupon).toHaveBeenCalledWith('test-coupon-id', 'test-user-id');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isActivated).toBe(true);
    expect(result.current.showConfetti).toBe(true);
    expect(Haptics.notificationAsync).toHaveBeenCalledWith(Haptics.NotificationFeedbackType.Success);
  });

  it('should handle activation failure (API returns success: false)', async () => {
    (activateCoupon as any).mockResolvedValue({ success: false });
    const { result } = renderHook(() => useCouponActivation());

    await act(async () => {
      await result.current.handleActivateCoupon();
    });

    expect(activateCoupon).toHaveBeenCalledTimes(1);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isActivated).toBe(false);
    expect(result.current.showConfetti).toBe(false);
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Could not activate coupon. Please try again.');
  });

  it('should handle activation error (API throws error)', async () => {
    const errorMessage = 'Network error';
    (activateCoupon as any).mockRejectedValue(new Error(errorMessage));
    const { result } = renderHook(() => useCouponActivation());

    await act(async () => {
      await result.current.handleActivateCoupon();
    });

    expect(activateCoupon).toHaveBeenCalledTimes(1);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isActivated).toBe(false);
    expect(result.current.showConfetti).toBe(false);
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'A connection problem occurred.');
  });

  it('should reset showConfetti state after animation ends', () => {
    const { result } = renderHook(() => useCouponActivation());
    act(() => {
      result.current.setShowConfetti(true);
    });
    expect(result.current.showConfetti).toBe(true);
    act(() => {
      // Simulate onAnimationEnd from ConfettiCannon
      result.current.setShowConfetti(false);
    });
    expect(result.current.showConfetti).toBe(false);
  });
});
