import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Props for the PaymentModal component.
 */
interface PaymentModalProps {
  /**
   * Controls the visibility of the modal.
   */
  isOpen: boolean;
  /**
   * Callback function to be called when the modal should be closed.
   */
  onClose: () => void;
  /**
   * Callback function to be called when a payment method is selected.
   * @param {'cash' | 'card'} paymentType - The selected payment method.
   */
  onPayment: (paymentType: 'cash' | 'card') => void;
}

/**
 * A modal component for selecting a payment method.
 * It includes accessibility features such as focus trapping and keyboard navigation (Escape key to close, Tab to cycle focus).
 */
const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onPayment }) => {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null); // To store the element that had focus

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
      // Focus trapping logic
      if (event.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) { // Shift + Tab
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            event.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            event.preventDefault();
          }
        }
      }
    };

    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement; // Store focus
      document.addEventListener('keydown', handleKeyDown);
      modalRef.current?.focus(); // Focus the modal itself
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus to the element that was focused before the modal opened
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
        previouslyFocusedElement.current = null; // Clear reference
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Ensure focus is restored even if component unmounts while modal is open
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
        previouslyFocusedElement.current = null;
      }
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
        tabIndex={-1} // Make the modal div focusable
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

