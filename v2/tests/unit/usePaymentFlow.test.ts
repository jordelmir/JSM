import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { usePaymentFlow } from '../src/hooks/usePaymentFlow';
import paymentFactory from '../src/core/payment';
import eventBus from '../src/core/eventBus';
import logger from '../src/core/logger';
import { useTranslation } from 'react-i18next';

// Mock dependencies
vi.mock('react-i18next');
vi.mock('../src/core/payment');
vi.mock('../src/core/eventBus');
vi.mock('../src/core/logger');

describe('usePaymentFlow', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    (useTranslation as any).mockReturnValue({ t: (key: string) => key });
    (paymentFactory.createPayment as any).mockReturnValue({ process: () => 'Mock Payment Processed' });
  });

  it('should initialize with payment modal closed', () => {
    const { result } = renderHook(() => usePaymentFlow());
    expect(result.current.isPaymentModalOpen).toBe(false);
  });

  it('should open payment modal when handleFuelSelected is called', () => {
    const { result } = renderHook(() => usePaymentFlow());
    act(() => {
      result.current.handleFuelSelected('95', 20);
    });
    expect(result.current.isPaymentModalOpen).toBe(true);
    expect(logger.info).toHaveBeenCalledWith('Fuel selected: 20L of 95');
  });

  it('should close payment modal when closePaymentModal is called', () => {
    const { result } = renderHook(() => usePaymentFlow());
    act(() => {
      result.current.handleFuelSelected('95', 20); // Open first
    });
    expect(result.current.isPaymentModalOpen).toBe(true);
    act(() => {
      result.current.closePaymentModal();
    });
    expect(result.current.isPaymentModalOpen).toBe(false);
  });

  it('should handle successful payment', () => {
    const { result } = renderHook(() => usePaymentFlow());
    act(() => {
      result.current.handlePayment('cash');
    });

    expect(paymentFactory.createPayment).toHaveBeenCalledWith('cash');
    expect(logger.info).toHaveBeenCalledWith('Mock Payment Processed');
    expect(eventBus.emit).toHaveBeenCalledWith('purchaseCompleted', expect.any(Object));
    expect(eventBus.emit).toHaveBeenCalledWith('notification', { type: 'success', message: 'Payment successful!' });
    expect(result.current.isPaymentModalOpen).toBe(false);
  });

  it('should handle failed payment', () => {
    (paymentFactory.createPayment as any).mockImplementation(() => {
      throw new Error('Payment processing error');
    });
    const { result } = renderHook(() => usePaymentFlow());

    act(() => {
      result.current.handlePayment('card');
    });

    expect(paymentFactory.createPayment).toHaveBeenCalledWith('card');
    expect(logger.error).toHaveBeenCalledWith('Payment failed', { error: 'Payment processing error' });
    expect(eventBus.emit).toHaveBeenCalledWith('notification', { type: 'error', message: 'Payment failed!' });
    expect(result.current.isPaymentModalOpen).toBe(false);
  });
});
