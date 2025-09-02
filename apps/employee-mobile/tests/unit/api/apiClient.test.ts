import { vi } from 'vitest';
import { apiCall } from '../../../src/api/apiClient'; // Adjust path
import { useAuthStore } from '@gasolinera-jsm/shared/store/authStore';
import { useLoadingStore } from '../../../hooks/useLoadingStore'; // Adjust path

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock stores
vi.mock('@gasolinera-jsm/shared/store/authStore');
vi.mock('../../../hooks/useLoadingStore');

describe('apiCall', () => {
  const mockStartLoading = vi.fn();
  const mockStopLoading = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useLoadingStore.getState as any).mockReturnValue({
      startLoading: mockStartLoading,
      stopLoading: mockStopLoading,
    });
    (useAuthStore.getState as any).mockReturnValue({ accessToken: null });
  });

  it('should call startLoading and stopLoading', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ data: 'test' }),
    });

    await apiCall('/test');

    expect(mockStartLoading).toHaveBeenCalledTimes(1);
    expect(mockStopLoading).toHaveBeenCalledTimes(1);
  });

  it('should include Authorization header if accessToken exists', async () => {
    (useAuthStore.getState as any).mockReturnValue({ accessToken: 'test-token' });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ data: 'test' }),
    });

    await apiCall('/test');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      })
    );
  });

  it('should return JSON response for 200 OK', async () => {
    const mockResponseData = { message: 'Success' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponseData),
    });

    const result = await apiCall('/test');
    expect(result).toEqual(mockResponseData);
  });

  it('should return null for 204 No Content', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
      json: () => Promise.resolve(null), // json() might still be called
    });

    const result = await apiCall('/test');
    expect(result).toBeNull();
  });

  it('should throw error for non-OK response', async () => {
    const mockErrorBody = { message: 'Not Found' };
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () => Promise.resolve(mockErrorBody),
    });

    await expect(apiCall('/test')).rejects.toThrow('Not Found');
  });

  it('should throw generic error if error response cannot be parsed', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error('Invalid JSON')), // json() throws
    });
    vi.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console error

    await expect(apiCall('/test')).rejects.toThrow('Error: 500');
    expect(console.error).toHaveBeenCalledWith('Error parsing error response:', expect.any(Error));
  });

  it('should throw error for network failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network Down'));

    await expect(apiCall('/test')).rejects.toThrow('Network Down');
  });
});
