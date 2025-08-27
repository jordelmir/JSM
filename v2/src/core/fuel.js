// v2/src/core/fuel.js

const fuelTypes = {
  '95': { name: 'Gasoline 95', pricePerLiter: 1.50 },
  '98': { name: 'Gasoline 98', pricePerLiter: 1.65 },
  'diesel': { name: 'Diesel', pricePerLiter: 1.30 },
};

export const getFuelTypes = () => {
  return Object.keys(fuelTypes).map(key => ({ id: key, ...fuelTypes[key] }));
};

export const getFuelPrice = (type) => {
  return fuelTypes[type]?.pricePerLiter;
};

export const calculateCost = (type, liters) => {
  const price = getFuelPrice(type);
  if (!price || liters <= 0) {
    throw new Error("Invalid fuel type or liters");
  }
  return (price * liters).toFixed(2);
};
