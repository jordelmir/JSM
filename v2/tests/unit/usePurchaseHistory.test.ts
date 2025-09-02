import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { usePurchaseHistory } from '../src/hooks/usePurchaseHistory';
import * as storage from '../src/core/storage';
import eventBus from '../src/core/eventBus';

describe('usePurchaseHistory', () => {
  const MOCK_INITIAL_HISTORY = [
    { id: 1, amount: 10, date: '2023-01-01T10:00:00Z' },
    { id: 2, amount: 20, date: '2023-01-02T11:00:00Z' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(storage, 'get').mockReturnValue(null);
    vi.spyOn(storage, 'set').mockImplementation(() => {});
    vi.spyOn(eventBus, 'on').mockImplementation(() => {});
    vi.spyOn(eventBus, 'off').mockImplementation(() => {});
  });

  it('should load initial history from storage', () => {
    (storage.get as any).mockReturnValue(MOCK_INITIAL_HISTORY);
    const { result } = renderHook(() => usePurchaseHistory());
    expect(result.current).toEqual(MOCK_INITIAL_HISTORY);
    expect(storage.get).toHaveBeenCalledWith('purchaseHistory');
  });

  it('should initialize with empty history if storage is empty', () => {
    const { result } = renderHook(() => usePurchaseHistory());
    expect(result.current).toEqual([]);
    expect(storage.get).toHaveBeenCalledWith('purchaseHistory');
  });

  it('should add new purchase and persist to storage when purchaseCompleted event is emitted', () => {
    const { result } = renderHook(() => usePurchaseHistory());
    const newPurchase = { id: 3, amount: 30, date: '2023-01-03T12:00:00Z' };

    // Simulate event emission
    act(() => {
      // Find the listener that was registered with eventBus.on
      const onCall = (eventBus.on as any).mock.calls.find(call => call[0] === 'purchaseCompleted');
      if (onCall) {
        const listener = onCall[1];
        listener(newPurchase);
      }
    });

    expect(result.current).toEqual([newPurchase]);
    expect(storage.set).toHaveBeenCalledWith('purchaseHistory', [newPurchase]);
  });

  it('should unsubscribe from eventBus on unmount', () => {
    const { unmount } = renderHook(() => usePurchaseHistory());
    expect(eventBus.on).toHaveBeenCalledWith('purchaseCompleted', expect.any(Function));
    unmount();
    expect(eventBus.off).toHaveBeenCalledWith('purchaseCompleted', expect.any(Function));
  });
});
