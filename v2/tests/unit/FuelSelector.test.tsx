
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FuelSelector from '../../src/components/FuelSelector';

describe('FuelSelector', () => {
  it('should call onFuelSelected with the selected fuel type and liters', () => {
    const onFuelSelected = vi.fn();
    render(<FuelSelector onFuelSelected={onFuelSelected} />);

    const fuelTypeSelect = screen.getByLabelText('Fuel Type:');
    const litersInput = screen.getByLabelText('Liters:');
    const selectButton = screen.getByText('Select Fuel');

    fireEvent.change(fuelTypeSelect, { target: { value: '98' } });
    fireEvent.change(litersInput, { target: { value: '20' } });
    fireEvent.click(selectButton);

    expect(onFuelSelected).toHaveBeenCalledWith('98', 20);
  });
});
