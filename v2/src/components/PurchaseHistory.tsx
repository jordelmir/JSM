
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as storage from '../core/storage';
import eventBus from '../core/eventBus';

interface Purchase {
  id: number;
  amount: number;
  date: string;
}

const PurchaseHistory: React.FC = () => {
  const { t } = useTranslation();
  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);

  useEffect(() => {
    const history = storage.get<Purchase[]>('purchaseHistory') || [];
    setPurchaseHistory(history);

    const handlePurchaseCompleted = (purchase: Purchase) => {
      const updatedHistory = [...purchaseHistory, purchase];
      setPurchaseHistory(updatedHistory);
      storage.set('purchaseHistory', updatedHistory);
    };

    eventBus.on('purchaseCompleted', handlePurchaseCompleted);

    return () => {
      eventBus.off('purchaseCompleted', handlePurchaseCompleted);
    };
  }, [purchaseHistory]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">{t('Purchase History')}</h2>
      {purchaseHistory.length === 0 ? (
        <p>{t('No purchases yet.')}</p>
      ) : (
        <ul className="space-y-2">
          {purchaseHistory.map(p => (
            <li key={p.id} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <span>{t('Amount')}: ${p.amount.toFixed(2)}</span>
              <span>{t('Date')}: {new Date(p.date).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PurchaseHistory;
