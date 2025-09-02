import { useState, useEffect } from 'react';
import * as storage from '../core/storage';
import eventBus from '../core/eventBus';

interface Purchase {
  id: number;
  amount: number;
  date: string;
}

/**
 * Custom hook to manage and persist purchase history.
 * It loads history from local storage, listens for new purchases via event bus,
 * and updates the history, persisting it back to local storage.
 * @returns {Purchase[]} The current list of purchase history items, updated in real-time.
 */
export const usePurchaseHistory = () => {
  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);

  useEffect(() => {
    // Load initial history from local storage
    const initialHistory = storage.get<Purchase[]>('purchaseHistory') || [];
    setPurchaseHistory(initialHistory);

    // Event listener for new purchases
    const handlePurchaseCompleted = (purchase: Purchase) => {
      setPurchaseHistory((prevHistory) => {
        const updatedHistory = [...prevHistory, purchase];
        storage.set('purchaseHistory', updatedHistory);
        return updatedHistory;
      });
    };

    // Subscribe to the event
    eventBus.on('purchaseCompleted', handlePurchaseCompleted);

    // Cleanup: Unsubscribe from the event when the component unmounts
    return () => {
      eventBus.off('purchaseCompleted', handlePurchaseCompleted);
    };
  }, []); // Empty dependency array ensures effect runs only once on mount

  return purchaseHistory;
};