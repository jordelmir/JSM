import { renderHook, act } from '@testing-library/react-native';
import { vi } from 'vitest';
import { useAuth } from '../../../hooks/useAuth'; // Adjust path
import { loginEmployee } from '../../../src/api/employee'; // Adjust path
import { useAuthStore } from '@gasolinera-jsm/shared/store/authStore';
import { useLoadingStore } from '../../../hooks/useLoadingStore';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

// Mock dependencies
vi.mock('../../../src/api/employee');
vi.mock('@gasolinera-jsm/shared/store/authStore');
vi.mock('../../../hooks/useLoadingStore');
vi.mock('react-i18next');
vi.mock('react-native', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-native')>();
  return {
    ...actual,
    Alert: { alert: vi.fn() },
  };
});

describe('useAuth', () => {
  const mockAuthLogin = vi.fn();
  const mockStartLoading = vi.fn();
  const mockStopLoading = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as any).mockReturnValue({ login: mockAuthLogin });
    (useLoadingStore.getState as any).mockReturnValue({
      startLoading: mockStartLoading,
      stopLoading: mockStopLoading,
      isLoading: false,
    });
    (useTranslation as any).mockReturnValue({ t: (key: string) => key });
    (loginEmployee as any).mockResolvedValue({ name: 'Test Employee', token: 'mock-token' });
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should call loginEmployee and authLogin on successful login', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(loginEmployee).toHaveBeenCalledWith({ username: 'test@example.com', password: 'password' });
    expect(mockAuthLogin).toHaveBeenCalledWith(expect.any(Object), 'mock-token');
    expect(Alert.alert).toHaveBeenCalledWith('Welcome', 'Test Employee');
  });

  it('should handle login error', async () => {
    const errorMessage = 'Invalid credentials';
    (loginEmployee as any).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(loginEmployee).toHaveBeenCalledTimes(1);
    expect(mockAuthLogin).not.toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledWith('Error', errorMessage);
    expect(result.current.error).toBeNull(); // Error is handled by Alert, not returned
  });

  it('should handle generic login error', async () => {
    (loginEmployee as any).mockRejectedValue(new Error()); // Generic error

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Invalid credentials');
  });

  it('loading state should reflect useLoadingStore', () => {
    (useLoadingStore.getState as any).mockReturnValue({
      startLoading: mockStartLoading,
      stopLoading: mockStopLoading,
      isLoading: true, // Simulate loading
    });
    const { result } = renderHook(() => useAuth());
    expect(result.current.loading).toBe(true);
  });
});
