
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../src/App';

describe('Fuel Flow Integration Test', () => {
  it('should allow a user to select fuel, pay, and see a confirmation', () => {
    render(<App />);

    // 1. Select fuel
    const fuelTypeSelect = screen.getByLabelText('Fuel Type:');
    const litersInput = screen.getByLabelText('Liters:');
    const selectButton = screen.getByText('Select Fuel');

    fireEvent.change(fuelTypeSelect, { target: { value: '98' } });
    fireEvent.change(litersInput, { target: { value: '30' } });
    fireEvent.click(selectButton);

    // 2. Pay
    const cashButton = screen.getByText('Pay with Cash');
    fireEvent.click(cashButton);

    // 3. See confirmation
    expect(screen.getByText('Payment successful!')).toBeInTheDocument();
  });
});
