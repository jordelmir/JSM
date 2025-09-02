import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Props for the FuelSelector component.
 */
interface FuelSelectorProps {
  /**
   * Callback function triggered when a fuel type and liters are selected.
   * @param {string} fuelType - The selected fuel type (e.g., '95', '98', 'diesel').
   * @param {number} liters - The selected amount of fuel in liters.
   */
  onFuelSelected: (fuelType: string, liters: number) => void;
}

// Define fuel options dynamically
const FUEL_OPTIONS = [
  { value: '95', label: '95' },
  { value: '98', label: '98' },
  { value: 'diesel', label: 'Diesel' },
];

/**
 * A component for selecting fuel type and quantity.
 * It includes input validation for liters and dynamic fuel options.
 */
const FuelSelector: React.FC<FuelSelectorProps> = ({ onFuelSelected }) => {
  const { t } = useTranslation();
  const [fuelType, setFuelType] = useState(FUEL_OPTIONS[0].value); // Default to first option
  const [liters, setLiters] = useState(10);
  const [litersError, setLitersError] = useState<string | null>(null);

  const handleLitersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (isNaN(value) || value <= 0) {
      setLitersError(t('Liters must be a positive number.'));
      setLiters(0); // Set to 0 or previous valid value
    } else {
      setLitersError(null);
      setLiters(value);
    }
  };

  const handleFuelSelection = () => {
    if (litersError || liters <= 0) {
      setLitersError(t('Please enter a valid amount of liters.'));
      return;
    }
    onFuelSelected(fuelType, liters);
  };

  const isButtonDisabled = litersError !== null || liters <= 0;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">{t('Fuel Selector')}</h2>
      <div className="mb-4">
        <label htmlFor="fuelType" className="block mb-2">{t('Fuel Type')}:</label>
        <select
          id="fuelType"
          value={fuelType}
          onChange={(e) => setFuelType(e.target.value)}
          className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700"
        >
          {FUEL_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="liters" className="block mb-2">{t('Liters')}:</label>
        <input
          type="number"
          id="liters"
          value={liters}
          onChange={handleLitersChange}
          min="1"
          step="1"
          className={`w-full p-2 border rounded bg-gray-200 dark:bg-gray-700 ${litersError ? 'border-red-500' : ''}`}
        />
        {litersError && <p className="text-red-500 text-sm mt-1">{litersError}</p>}
      </div>
      <button
        onClick={handleFuelSelection}
        aria-label={t('Select Fuel')}
        className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isButtonDisabled}
      >
        {t('Select Fuel')}
      </button>
    </div>
  );
};

export default FuelSelector;
