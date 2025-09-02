import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import paymentFactory from '../core/payment';
import eventBus from '../core/eventBus';
import logger from '../core/logger';

/**
 * Custom hook to manage the payment flow logic, including modal state and payment processing.
 * It encapsulates the interaction with payment factory, event bus, and logger.
 * @returns {{ isPaymentModalOpen: boolean, handleFuelSelected: (fuelType: string, liters: number) => void, handlePayment: (paymentType: 'cash' | 'card') => void, closePaymentModal: () => void }}
 *   - `isPaymentModalOpen`: Boolean state indicating if the payment modal is open.
 *   - `handleFuelSelected`: Function to call when a fuel type and liters are selected, which opens the payment modal.
 *   - `handlePayment`: Function to call when a payment is confirmed within the modal.
 *   - `closePaymentModal`: Function to explicitly close the payment modal.
 */
export const usePaymentFlow = () => {
  const { t } = useTranslation();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  /**
   * Handles the selection of fuel, logs the selection, and opens the payment modal.
   * @param {string} fuelType - The type of fuel selected (e.g., '95', 'diesel').
   * @param {number} liters - The amount of fuel in liters.
   */
  const handleFuelSelected = (fuelType: string, liters: number) => {
    logger.info(`Fuel selected: ${liters}L of ${fuelType}`);
    // Here we could also store the selected fuel info in state if needed by the payment handler
    setIsPaymentModalOpen(true);
  };

  /**
   * Processes the payment based on the selected payment type.
   * Emits success or error notifications via the event bus.
   * @param {'cash' | 'card'} paymentType - The type of payment chosen.
   */
  const handlePayment = (paymentType: 'cash' | 'card') => {
    try {
      const payment = paymentFactory.createPayment(paymentType);
      logger.info(payment.process());
      // In a real app, the amount would come from the fuel selection
      const purchase = { id: Date.now(), amount: 10, date: new Date().toISOString() };
      eventBus.emit('purchaseCompleted', purchase);
      eventBus.emit('notification', { type: 'success', message: t('Payment successful!') });
    } catch (error) {
      if (error instanceof Error) {
        logger.error('Payment failed', { error: error.message });
        eventBus.emit('notification', { type: 'error', message: t('Payment failed!') });
      }
    }
    setIsPaymentModalOpen(false);
  };

  /**
   * Closes the payment modal.
   */
  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  return {
    isPaymentModalOpen,
    handleFuelSelected,
    handlePayment,
    closePaymentModal,
  };
};