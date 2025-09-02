import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useCampaignSummary } from '../../src/lib/hooks/useCampaignSummary'; // Adjust path based on new test location
import { getCampaignPerformanceSummary } from '../../src/lib/apiClient'; // Adjust path
import { toast } from 'react-toastify';

// Mock dependencies
vi.mock('../../src/lib/apiClient'); // Mock the API client
vi.mock('react-toastify'); // Mock react-toastify

describe('useCampaignSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Ensure toast.error is mocked
    (toast.error as any).mockImplementation(() => {});
  });

  it('should return initial loading state', () => {
    (getCampaignPerformanceSummary as any).mockResolvedValueOnce({}); // Mock a successful but delayed response
    const { result } = renderHook(() => useCampaignSummary());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.summary).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should fetch summary data successfully', async () => {
    const mockSummary = {
      totalImpressions: 10000,
      totalBudgetSpent: 500.50,
    };
    (getCampaignPerformanceSummary as any).mockResolvedValueOnce(mockSummary);

    const { result } = renderHook(() => useCampaignSummary());

    // Wait for the async operation to complete
    await act(async () => {
      // The effect runs automatically, so we just need to wait for it
      // No explicit action needed here for the hook itself
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.summary).toEqual(mockSummary);
    expect(result.current.error).toBeNull();
    expect(getCampaignPerformanceSummary).toHaveBeenCalledTimes(1);
  });

  it('should handle error during data fetching', async () => {
    const errorMessage = 'Failed to fetch campaign data';
    (getCampaignPerformanceSummary as any).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useCampaignSummary());

    // Wait for the async operation to complete
    await act(async () => {
      // The effect runs automatically, so we just need to wait for it
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.summary).toBeNull();
    expect(result.current.error).toBe(errorMessage);
    expect(getCampaignPerformanceSummary).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith(`Error loading campaign summary: ${errorMessage}`);
  });
});
