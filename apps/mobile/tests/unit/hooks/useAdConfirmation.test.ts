import { renderHook, act } from '@testing-library/react-native';
import { vi } from 'vitest';
import { useAdConfirmation } from '../../../src/hooks/useAdConfirmation'; // Adjust path
import { useNavigation, useRoute } from '@react-navigation/native';
import { confirmAdWatched } from '../../../src/api/apiClient'; // Adjust path
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

// Mock dependencies
vi.mock('@react-navigation/native');
vi.mock('../../../src/api/apiClient');
vi.mock('react-native', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-native')>();
  return {
    ...actual,
    Alert: { alert: vi.fn() },
  };
});
vi.mock('react-i18next');

describe('useAdConfirmation', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigation as any).mockReturnValue({ navigate: mockNavigate });
    (useRoute as any).mockReturnValue({ params: { redemptionId: 'mock-redemption-id' } });
    (useTranslation as any).mockReturnValue({ t: (key: string) => key });
  });

  it('should initialize with isAdWatched as false', () => {
    const { result } = renderHook(() => useAdConfirmation({ didJustFinish: false }));
    expect(result.current.isAdWatched).toBe(false);
  });

  it('should set isAdWatched to true and call confirmAdWatched on video finish', async () => {
    (confirmAdWatched as any).mockResolvedValue({ balance: 100 });
    const { result } = renderHook(() => useAdConfirmation({ didJustFinish: true }));

    await act(async () => {
      // Trigger useEffect by re-rendering with updated videoStatus
      // The hook's useEffect will run on mount and then when videoStatus changes
    });

    expect(result.current.isAdWatched).toBe(true);
    expect(confirmAdWatched).toHaveBeenCalledWith('mock-redemption-id');
    expect(Alert.alert).toHaveBeenCalledWith('Points Credited!', 'New balance: 100');
    expect(mockNavigate).toHaveBeenCalledWith('Home');
  });

  it('should handle confirmation error and navigate back home', async () => {
    const errorMessage = 'Failed to confirm';
    (confirmAdWatched as any).mockRejectedValue(new Error(errorMessage));
    const { result } = renderHook(() => useAdConfirmation({ didJustFinish: true }));

    await act(async () => {
      // Trigger useEffect by re-rendering with updated videoStatus
    });

    expect(result.current.isAdWatched).toBe(true); // Still set to true as the process started
    expect(confirmAdWatched).toHaveBeenCalledTimes(1);
    expect(Alert.alert).toHaveBeenCalledWith('Confirmation Error', errorMessage);
    expect(mockNavigate).toHaveBeenCalledWith('Home');
  });

  it('should not call confirmAdWatched if already watched', async () => {
    (confirmAdWatched as any).mockResolvedValue({ balance: 100 });
    const { result } = renderHook(() => useAdConfirmation({ didJustFinish: true }));

    await act(async () => {
      // First call
    });

    expect(confirmAdWatched).toHaveBeenCalledTimes(1);

    // Simulate another video finish event
    act(() => {
      result.rerender(useAdConfirmation({ didJustFinish: true }));
    });

    expect(confirmAdWatched).toHaveBeenCalledTimes(1); // Should not be called again
  });
});
