
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FuelSelectorProps {
  onFuelSelected: (fuelType: string, liters: number) => void;
}

const FuelSelector: React.FC<FuelSelectorProps> = ({ onFuelSelected }) => {
  const { t } = useTranslation();
  const [fuelType, setFuelType] = useState('95');
  const [liters, setLiters] = useState(10);

  const handleFuelSelection = () => {
    onFuelSelected(fuelType, liters);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">{t('Fuel Selector')}</h2>
      <div className="mb-4">
        <label htmlFor="fuelType" className="block mb-2">{t('Fuel Type')}:</label>
        <select id="fuelType" value={fuelType} onChange={(e) => setFuelType(e.target.value)} className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700">
          <option value="95">95</option>
          <option value="98">98</option>
          <option value="diesel">Diesel</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="liters" className="block mb-2">{t('Liters')}:</label>
        <input
          type="number"
          id="liters"
          value={liters}
          onChange={(e) => setLiters(Number(e.target.value))}
          min="1"
          step="1"
          className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700"
        />
      </div>
      <button onClick={handleFuelSelection} aria-label={t('Select Fuel')} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        {t('Select Fuel')}
      </button>
    </div>
  );
};

export default FuelSelector;
