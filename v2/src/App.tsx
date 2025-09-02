import React, { Suspense, lazy, useState } from 'react';
import FuelSelector from './components/FuelSelector';
import PaymentModal from './components/PaymentModal';
import ToastNotification from './components/ToastNotification';
import DarkModeToggle from './components/DarkModeToggle';
import SanitizedHTML from './components/SanitizedHTML';
import { useTranslation } from 'react-i18next';
import { apiFacade } from './services/apiFacade'; // Still needed for useApiExamples
import { usePaymentFlow } from './hooks/usePaymentFlow';
import { useApiExamples } from './hooks/useApiExamples'; // New import
import logger from './core/logger'; // Still needed for useApiExamples
import eventBus from './core/eventBus'; // Still needed for useApiExamples

const PurchaseHistory = lazy(() => import('./components/PurchaseHistory'));

const App: React.FC = () => {

  const { t } = useTranslation();
  const [userInput, setUserInput] = useState('<img src=x onerror=alert("XSS")>');

  const {
    isPaymentModalOpen,
    handleFuelSelected,
    handlePayment,
    closePaymentModal,
  } = usePaymentFlow();

  const {
    handleGetFuelPrices,
    handleSubmitOrder,
  } = useApiExamples(); // Call the new hook

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
              <button onClick={handleGetFuelPrices} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mr-2">
                {t('Get Fuel Prices')}
              </button>
              <button onClick={handleSubmitOrder} className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                {t('Submit Order')}
              </button>
            </div>
        </div>
      </main>
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={closePaymentModal}
        onPayment={handlePayment}
      />
      <ToastNotification />
    </div>
  );
};

export default App;
