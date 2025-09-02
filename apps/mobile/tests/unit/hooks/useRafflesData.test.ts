import { renderHook, act } from '@testing-library/react-native';
import { vi } from 'vitest';
import { useRafflesData } from '../../../src/hooks/useRafflesData'; // Adjust path
import { getRaffles } from '../../../src/api/apiClient'; // Adjust path
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

// Mock dependencies
vi.mock('../../../src/api/apiClient');
vi.mock('react-native', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-native')>();
  return {
    ...actual,
    Alert: { alert: vi.fn() },
  };
});
vi.mock('react-i18next');

describe('useRafflesData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useTranslation as any).mockReturnValue({ t: (key: string) => key });
  });

  it('should return initial loading state', () => {
    (getRaffles as any).mockResolvedValueOnce([]); // Mock a successful but delayed response
    const { result } = renderHook(() => useRafflesData());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.raffles).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should fetch raffles data successfully', async () => {
    const mockRaffles = [
      { id: 1, period: 'Q1', status: 'OPEN', title: 'Raffle 1' },
      { id: 2, period: 'Q2', status: 'CLOSED', title: 'Raffle 2' },
    ];
    (getRaffles as any).mockResolvedValueOnce(mockRaffles);

    const { result } = renderHook(() => useRafflesData());

    await act(async () => {
      // The effect runs automatically, so we just need to wait for it
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.raffles).toEqual(mockRaffles);
    expect(result.current.error).toBeNull();
    expect(getRaffles).toHaveBeenCalledTimes(1);
  });

  it('should handle error during data fetching', async () => {
    const errorMessage = 'Failed to load raffles from API';
    (getRaffles as any).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useRafflesData());

    await act(async () => {
      // The effect runs automatically, so we just need to wait for it
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.raffles).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
    expect(getRaffles).toHaveBeenCalledTimes(1);
    expect(Alert.alert).toHaveBeenCalledWith('Error', errorMessage);
  });
});
