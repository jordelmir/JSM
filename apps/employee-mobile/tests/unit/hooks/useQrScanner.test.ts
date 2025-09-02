import { renderHook, act } from '@testing-library/react-native';
import { vi } from 'vitest';
import { useQrScanner } from '../../../hooks/useQrScanner'; // Adjust path
import { validateQRCode } from '../../../src/api/employee'; // Adjust path
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

// Mock dependencies
vi.mock('../../../src/api/employee');
vi.mock('react-i18next');
vi.mock('react-native', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-native')>();
  return {
    ...actual,
    Alert: { alert: vi.fn() },
  };
});

describe('useQrScanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useTranslation as any).mockReturnValue({ t: (key: string) => key });
  });

  it('should initialize with isScanning and isLoadingQr as false', () => {
    const { result } = renderHook(() => useQrScanner());
    expect(result.current.isScanning).toBe(false);
    expect(result.current.isLoadingQr).toBe(false);
  });

  it('handleScan should set loading states and call validateQRCode on success', async () => {
    const mockValidationResult = { isValid: true, data: 'mock-qr-data' };
    (validateQRCode as any).mockResolvedValue(mockValidationResult);

    const { result } = renderHook(() => useQrScanner());

    await act(async () => {
      await result.current.handleScan({ type: 'qr', data: 'test-qr' });
    });

    expect(result.current.isScanning).toBe(true);
    expect(result.current.isLoadingQr).toBe(false);
    expect(validateQRCode).toHaveBeenCalledWith('test-qr');
    expect(Alert.alert).toHaveBeenCalledWith('Valid QR', JSON.stringify(mockValidationResult), [{ text: 'OK', onPress: expect.any(Function) }]);
  });

  it('handleScan should handle error during QR validation', async () => {
    const errorMessage = 'QR validation failed';
    (validateQRCode as any).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useQrScanner());

    await act(async () => {
      await result.current.handleScan({ type: 'qr', data: 'test-qr' });
    });

    expect(result.current.isScanning).toBe(true);
    expect(result.current.isLoadingQr).toBe(false);
    expect(validateQRCode).toHaveBeenCalledTimes(1);
    expect(Alert.alert).toHaveBeenCalledWith('Error', errorMessage, [{ text: 'OK', onPress: expect.any(Function) }]);
  });

  it('resetScanner should reset isScanning and isLoadingQr', () => {
    const { result } = renderHook(() => useQrScanner());
    act(() => {
      result.current.handleScan({ type: 'qr', data: 'test-qr' }); // Set to scanning/loading
    });
    expect(result.current.isScanning).toBe(true);
    expect(result.current.isLoadingQr).toBe(false);

    act(() => {
      result.current.resetScanner();
    });
    expect(result.current.isScanning).toBe(false);
    expect(result.current.isLoadingQr).toBe(false);
  });

  it('should prevent multiple scans if already scanning or loading', async () => {
    const { result } = renderHook(() => useQrScanner());
    
    // Simulate already scanning
    act(() => { result.current.handleScan({ type: 'qr', data: 'first-scan' }); });
    expect(validateQRCode).toHaveBeenCalledTimes(1);

    // Try to scan again while already scanning
    await act(async () => { await result.current.handleScan({ type: 'qr', data: 'second-scan' }); });
    expect(validateQRCode).toHaveBeenCalledTimes(1); // Should not have been called again
  });
});
