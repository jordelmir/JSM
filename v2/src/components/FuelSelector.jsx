import React from 'react';
import { getFuelTypes } from '../core/fuel'; // Import fuel types

function FuelSelector() {
  const fuelTypes = getFuelTypes();

  return (
    <div className="card">
      <h3>Fuel Selector Component</h3>
      <p>Select your fuel type and quantity.</p>
      <select style={{ padding: '8px', marginRight: '10px' }}>
        {fuelTypes.map(type => (
          <option key={type.id} value={type.id}>{type.name}</option>
        ))}
      </select>
      <input type="number" placeholder="Liters" style={{ padding: '8px', width: '80px' }} />
      <button style={{ marginLeft: '10px' }}>Calculate</button>
    </div>
  );
}

export default FuelSelector;