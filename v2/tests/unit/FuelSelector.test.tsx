import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import FuelSelector from '../../src/components/FuelSelector';
import { useTranslation } from 'react-i18next';

// Mock useTranslation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Simple mock: returns the key itself
  }),
}));

describe('FuelSelector', () => {
  const mockOnFuelSelected = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly with default values', () => {
    render(<FuelSelector onFuelSelected={mockOnFuelSelected} />);

    expect(screen.getByText('Fuel Selector')).toBeInTheDocument();
    expect(screen.getByLabelText('Fuel Type:')).toBeInTheDocument();
    expect(screen.getByLabelText('Liters:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Select Fuel' })).toBeInTheDocument();

    expect(screen.getByLabelText('Fuel Type:')).toHaveValue('95');
    expect(screen.getByLabelText('Liters:')).toHaveValue(10);
  });

  it('should update fuel type on selection', () => {
    render(<FuelSelector onFuelSelected={mockOnFuelSelected} />);
    const fuelTypeSelect = screen.getByLabelText('Fuel Type:');

    fireEvent.change(fuelTypeSelect, { target: { value: 'diesel' } });
    expect(fuelTypeSelect).toHaveValue('diesel');
  });

  it('should update liters on input change', () => {
    render(<FuelSelector onFuelSelected={mockOnFuelSelected} />);
    const litersInput = screen.getByLabelText('Liters:');

    fireEvent.change(litersInput, { target: { value: '25' } });
    expect(litersInput).toHaveValue(25);
  });

  it('should call onFuelSelected with correct values when button is clicked', () => {
    render(<FuelSelector onFuelSelected={mockOnFuelSelected} />);
    const fuelTypeSelect = screen.getByLabelText('Fuel Type:');
    const litersInput = screen.getByLabelText('Liters:');
    const selectButton = screen.getByRole('button', { name: 'Select Fuel' });

    fireEvent.change(fuelTypeSelect, { target: { value: '98' } });
    fireEvent.change(litersInput, { target: { value: '15' } });
    fireEvent.click(selectButton);

    expect(mockOnFuelSelected).toHaveBeenCalledTimes(1);
    expect(mockOnFuelSelected).toHaveBeenCalledWith('98', 15);
  });

  it('should show error and disable button for invalid liters (zero)', () => {
    render(<FuelSelector onFuelSelected={mockOnFuelSelected} />);
    const litersInput = screen.getByLabelText('Liters:');
    const selectButton = screen.getByRole('button', { name: 'Select Fuel' });

    fireEvent.change(litersInput, { target: { value: '0' } });
    expect(screen.getByText('Liters must be a positive number.')).toBeInTheDocument();
    expect(selectButton).toBeDisabled();
    fireEvent.click(selectButton);
    expect(mockOnFuelSelected).not.toHaveBeenCalled();
  });

  it('should show error and disable button for invalid liters (negative)', () => {
    render(<FuelSelector onFuelSelected={mockOnFuelSelected} />);
    const litersInput = screen.getByLabelText('Liters:');
    const selectButton = screen.getByRole('button', { name: 'Select Fuel' });

    fireEvent.change(litersInput, { target: { value: '-5' } });
    expect(screen.getByText('Liters must be a positive number.')).toBeInTheDocument();
    expect(selectButton).toBeDisabled();
    fireEvent.click(selectButton);
    expect(mockOnFuelSelected).not.toHaveBeenCalled();
  });

  it('should show error and disable button for invalid liters (non-numeric)', () => {
    render(<FuelSelector onFuelSelected={mockOnFuelSelected} />);
    const litersInput = screen.getByLabelText('Liters:');
    const selectButton = screen.getByRole('button', { name: 'Select Fuel' });

    fireEvent.change(litersInput, { target: { value: 'abc' } });
    expect(screen.getByText('Liters must be a positive number.')).toBeInTheDocument();
    expect(selectButton).toBeDisabled();
    fireEvent.click(selectButton);
    expect(mockOnFuelSelected).not.toHaveBeenCalled();
  });

  it('should enable button and clear error when liters become valid', () => {
    render(<FuelSelector onFuelSelected={mockOnFuelSelected} />);
    const litersInput = screen.getByLabelText('Liters:');
    const selectButton = screen.getByRole('button', { name: 'Select Fuel' });

    fireEvent.change(litersInput, { target: { value: '0' } }); // Make it invalid
    expect(selectButton).toBeDisabled();
    expect(screen.getByText('Liters must be a positive number.')).toBeInTheDocument();

    fireEvent.change(litersInput, { target: { value: '10' } }); // Make it valid
    expect(selectButton).not.toBeDisabled();
    expect(screen.queryByText('Liters must be a positive number.')).not.toBeInTheDocument();
  });
});