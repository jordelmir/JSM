

import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPayment: (paymentType: 'cash' | 'card') => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onPayment }) => {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      modalRef.current?.focus();
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 md:w-1/3"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-modal-title"
        ref={modalRef}
        tabIndex={-1}
      >
        <h2 id="payment-modal-title" className="text-xl font-bold mb-4">{t('Select Payment Method')}</h2>
        <div className="flex flex-col space-y-4">
          <button onClick={() => onPayment('cash')} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            {t('Pay with Cash')}
          </button>
          <button onClick={() => onPayment('card')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            {t('Pay with Card')}
          </button>
          <button onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            {t('Cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

