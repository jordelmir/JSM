import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useTodaySummary } from '../../src/lib/hooks/useTodaySummary'; // Adjust path based on new test location
import { getTodaySummary } from '../../src/lib/apiClient'; // Adjust path
import { toast } from 'react-toastify';

// Mock dependencies
vi.mock('../../src/lib/apiClient'); // Mock the API client
vi.mock('react-toastify'); // Mock react-toastify

describe('useTodaySummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Ensure toast.error is mocked
    (toast.error as any).mockImplementation(() => {});
  });

  it('should return initial loading state', () => {
    (getTodaySummary as any).mockResolvedValueOnce({}); // Mock a successful but delayed response
    const { result } = renderHook(() => useTodaySummary());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.summary).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should fetch summary data successfully', async () => {
    const mockSummary = {
      totalRevenue: 1000,
      pointsRedeemed: 500,
      adImpressions: 10000,
    };
    (getTodaySummary as any).mockResolvedValueOnce(mockSummary);

    const { result } = renderHook(() => useTodaySummary());

    // Wait for the async operation to complete
    await act(async () => {
      // The effect runs automatically, so we just need to wait for it
      // No explicit action needed here for the hook itself
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.summary).toEqual(mockSummary);
    expect(result.current.error).toBeNull();
    expect(getTodaySummary).toHaveBeenCalledTimes(1);
  });

  it('should handle error during data fetching', async () => {
    const errorMessage = 'Failed to fetch data';
    (getTodaySummary as any).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useTodaySummary());

    // Wait for the async operation to complete
    await act(async () => {
      // The effect runs automatically, so we just need to wait for it
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.summary).toBeNull();
    expect(result.current.error).toBe(errorMessage);
    expect(getTodaySummary).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith(`Error loading dashboard summary: ${errorMessage}`);
  });
});
