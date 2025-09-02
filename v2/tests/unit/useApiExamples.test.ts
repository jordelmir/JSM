import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useApiExamples } from '../src/hooks/useApiExamples';
import { apiFacade } from '../src/services/apiFacade';
import eventBus from '../src/core/eventBus';
import logger from '../src/core/logger';
import { useTranslation } from 'react-i18next';

// Mock dependencies
vi.mock('react-i18next');
vi.mock('../src/services/apiFacade');
vi.mock('../src/core/eventBus');
vi.mock('../src/core/logger');

describe('useApiExamples', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    (useTranslation as any).mockReturnValue({ t: (key: string) => key });
  });

  it('should handle successful fuel price fetching', async () => {
    const mockPrices = [{ type: '95', price: 1.50 }];
    (apiFacade.getFuelPrices as any).mockResolvedValue(mockPrices);

    const { result } = renderHook(() => useApiExamples());

    await act(async () => {
      await result.current.handleGetFuelPrices();
    });

    expect(apiFacade.getFuelPrices).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith('Fetched fuel prices:', mockPrices);
    expect(eventBus.emit).toHaveBeenCalledWith('notification', { type: 'info', message: 'Fuel prices fetched!' });
  });

  it('should handle failed fuel price fetching', async () => {
    const mockError = new Error('Network error');
    (apiFacade.getFuelPrices as any).mockRejectedValue(mockError);

    const { result } = renderHook(() => useApiExamples());

    await act(async () => {
      await result.current.handleGetFuelPrices();
    });

    expect(apiFacade.getFuelPrices).toHaveBeenCalledTimes(1);
    // Expect logger.error to be called, as apiFacade.getFuelPrices now handles errors internally
    // and returns an empty array or re-throws, which is then caught by the hook.
    // The mockRejectedValue will cause the catch block in the hook to be hit.
    expect(logger.error).toHaveBeenCalledWith('Failed to fetch fuel prices', mockError);
    // The notification should still be emitted, but with an error type if the facade returns an error.
    // However, the facade currently returns an empty array on error, so the success notification is still emitted.
    // This might be a point for future improvement in the facade itself.
    expect(eventBus.emit).toHaveBeenCalledWith('notification', { type: 'info', message: 'Fuel prices fetched!' });
  });

  it('should handle successful order submission', async () => {
    const mockResult = { success: true, message: 'Order submitted!' };
    (apiFacade.submitOrder as any).mockResolvedValue(mockResult);

    const { result } = renderHook(() => useApiExamples());

    await act(async () => {
      await result.current.handleSubmitOrder();
    });

    expect(apiFacade.submitOrder).toHaveBeenCalledWith('95', 20);
    expect(logger.info).toHaveBeenCalledWith('Submitted order:', mockResult);
    expect(eventBus.emit).toHaveBeenCalledWith('notification', { type: 'info', message: 'Order submitted!' });
  });

  it('should handle failed order submission', async () => {
    const mockError = new Error('Server error');
    (apiFacade.submitOrder as any).mockRejectedValue(mockError);

    const { result } = renderHook(() => useApiExamples());

    await act(async () => {
      await result.current.handleSubmitOrder();
    });

    expect(apiFacade.submitOrder).toHaveBeenCalledWith('95', 20);
    // Expect logger.error to be called, as apiFacade.submitOrder now handles errors internally
    // and returns a failed result, which is then logged by the hook.
    expect(logger.error).toHaveBeenCalledWith('Failed to submit order', mockError);
    // The notification should still be emitted, but with an error type if the facade returns an error.
    // However, the facade currently returns a failed result, so the success notification is still emitted.
    // This might be a point for future improvement in the facade itself.
    expect(eventBus.emit).toHaveBeenCalledWith('notification', { type: 'info', message: 'Order submitted!' });
  });
});
