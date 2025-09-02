import { renderHook, act } from '@testing-library/react-native';
import { vi } from 'vitest';
import { useQrCodeScanner } from '../../../src/hooks/useQrCodeScanner'; // Adjust path
import { redeemQrCode } from '../../../src/api/apiClient'; // Adjust path
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

// Mock dependencies
vi.mock('../../../src/api/apiClient');
vi.mock('@react-navigation/native');
vi.mock('react-native-toast-message');
vi.mock('react-i18next');

describe('useQrCodeScanner', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigation as any).mockReturnValue({ navigate: mockNavigate });
    (Toast.show as any).mockImplementation(() => {});
    (useTranslation as any).mockReturnValue({ t: (key: string) => key });
  });

  it('should initialize with scanned and loading as false', () => {
    const { result } = renderHook(() => useQrCodeScanner());
    expect(result.current.scanned).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  it('handleScan should set loading states and call redeemQrCode on success', async () => {
    const mockRedemptionResult = { adUrl: 'mock-ad-url', redemptionId: 'mock-redemption-id' };
    (redeemQrCode as any).mockResolvedValue(mockRedemptionResult);

    const { result } = renderHook(() => useQrCodeScanner());

    await act(async () => {
      await result.current.handleScan({ type: 'qr', data: 'test-qr-data' });
    });

    expect(result.current.scanned).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(redeemQrCode).toHaveBeenCalledWith('test-qr-data');
    expect(mockNavigate).toHaveBeenCalledWith('AdPlayer', { adUrl: 'mock-ad-url', redemptionId: 'mock-redemption-id' });
    expect(Toast.show).not.toHaveBeenCalled(); // No error toast
  });

  it('handleScan should handle error during redemption', async () => {
    const errorMessage = 'Redemption failed';
    (redeemQrCode as any).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useQrCodeScanner());

    await act(async () => {
      await result.current.handleScan({ type: 'qr', data: 'test-qr-data' });
    });

    expect(result.current.scanned).toBe(false); // Should reset scanned to false on error
    expect(result.current.loading).toBe(false);
    expect(redeemQrCode).toHaveBeenCalledTimes(1);
    expect(Toast.show).toHaveBeenCalledWith({
      type: 'error',
      text1: 'Redemption Error',
      text2: errorMessage,
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('resetScanner should reset scanned and loading states', () => {
    const { result } = renderHook(() => useQrCodeScanner());
    act(() => {
      result.current.setScanned(true); // Manually set scanned for testing reset
      result.current.resetScanner();
    });
    expect(result.current.scanned).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  it('should prevent multiple scans if already scanning or loading', async () => {
    const { result } = renderHook(() => useQrCodeScanner());
    
    // Simulate already scanning
    act(() => { result.current.setScanned(true); });
    
    // Try to scan again while already scanning
    await act(async () => { await result.current.handleScan({ type: 'qr', data: 'second-scan' }); });
    expect(redeemQrCode).not.toHaveBeenCalled(); // Should not have been called
  });
});
