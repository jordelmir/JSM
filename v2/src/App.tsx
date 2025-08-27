

import React, { useState, Suspense, lazy } from 'react';
import FuelSelector from './components/FuelSelector';
import PaymentModal from './components/PaymentModal';
import ToastNotification from './components/ToastNotification';
import DarkModeToggle from './components/DarkModeToggle';
import { PaymentFactory } from './core/payment';
import eventBus from './core/eventBus';
import logger from './core/logger';
import SanitizedHTML from './components/SanitizedHTML';
import { useTranslation } from 'react-i18next';
import { apiFacade } from './services/apiFacade';

const PurchaseHistory = lazy(() => import('./components/PurchaseHistory'));

const App: React.FC = () => {

  const { t } = useTranslation();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [userInput, setUserInput] = useState('<img src=x onerror=alert("XSS")>');



  const handleFuelSelected = (fuelType: string, liters: number) => {
    logger.log(`Fuel selected: ${liters}L of ${fuelType}`);
    setIsPaymentModalOpen(true);
  };

  const handlePayment = (paymentType: 'cash' | 'card') => {
    try {
      const payment = PaymentFactory.createPayment(paymentType);
      logger.log(payment.process());
      const purchase = { id: Date.now(), amount: 10, date: new Date().toISOString() }; // Replace with actual amount
      eventBus.emit('purchaseCompleted', purchase);
      eventBus.emit('notification', { type: 'success', message: t('Payment successful!') });
    } catch (error) {
      if (error instanceof Error) {
        logger.log('Payment failed', error.message);
        eventBus.emit('notification', { type: 'error', message: 'Payment failed!' });
      }
    }
    setIsPaymentModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="p-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">{t('Gasolinera JSM')}</h1>
        <DarkModeToggle />
      </header>
      <main role="main" className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FuelSelector onFuelSelected={handleFuelSelected} />
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">{t('Security - XSS Prevention (DOMPurify):')}</h2>
            <input 
              type="text" 
              value={userInput} 
              onChange={(e) => setUserInput(e.target.value)} 
              className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700"
            />
            <h3 className="text-lg font-bold mt-4">{t('Sanitized Output:')}</h3>
            <div className="p-2 border rounded mt-2">
              <SanitizedHTML html={userInput} />
            </div>
          </div>
          <Suspense fallback={<div>Loading history...</div>}>
            <PurchaseHistory />
          </Suspense>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">{t('API Facade Example:')}</h2>
              <button onClick={async () => {
                const prices = await apiFacade.getFuelPrices();
                logger.log('Fetched fuel prices:', prices);
                eventBus.emit('notification', { type: 'info', message: t('Fuel prices fetched!') });
              }} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mr-2">
                {t('Get Fuel Prices')}
              </button>
              <button onClick={async () => {
                const order = { fuelType: '95', liters: 20 };
                const result = await apiFacade.submitOrder(order.fuelType, order.liters);
                logger.log('Submitted order:', result);
                eventBus.emit('notification', { type: 'info', message: t('Order submitted!') });
              }} className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                {t('Submit Order')}
              </button>
            </div>
        </div>
      </main>
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPayment={handlePayment}
      />
      <ToastNotification />
    </div>
  );
};

export default App;
