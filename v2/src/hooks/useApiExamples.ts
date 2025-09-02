import { useTranslation } from 'react-i18next';
import { apiFacade } from '../services/apiFacade';
import logger from '../core/logger';
import eventBus from '../core/eventBus';

/**
 * Custom hook to encapsulate API interaction examples for the UI.
 * It provides functions to fetch fuel prices and submit orders, handling notifications via the event bus.
 * @returns {{ handleGetFuelPrices: () => Promise<void>, handleSubmitOrder: () => Promise<void> }}
 *   - `handleGetFuelPrices`: Asynchronous function to fetch and log fuel prices, and emit a notification.
 *   - `handleSubmitOrder`: Asynchronous function to submit a sample order, log the result, and emit a notification.
 */
export const useApiExamples = () => {
  const { t } = useTranslation();

  /**
   * Fetches fuel prices using the API facade and emits a notification.
   */
  const handleGetFuelPrices = async () => {
    const prices = await apiFacade.getFuelPrices();
    logger.info('Fetched fuel prices:', prices);
    eventBus.emit('notification', { type: 'info', message: t('Fuel prices fetched!') });
  };

  /**
   * Submits a sample order using the API facade and emits a notification.
   */
  const handleSubmitOrder = async () => {
    const order = { fuelType: '95', liters: 20 };
    const result = await apiFacade.submitOrder(order.fuelType, order.liters);
    logger.info('Submitted order:', result);
    eventBus.emit('notification', { type: 'info', message: t('Order submitted!') });
  };

  return {
    handleGetFuelPrices,
    handleSubmitOrder,
  };
};