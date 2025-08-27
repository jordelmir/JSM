
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../src/App';

describe('App', () => {
  it('should open the payment modal when fuel is selected', () => {
    render(<App />);
    const selectButton = screen.getByText('Select Fuel');
    fireEvent.click(selectButton);
    expect(screen.getByText('Select Payment Method')).toBeInTheDocument();
  });

  it('should close the payment modal when payment is made', () => {
    render(<App />);
    const selectButton = screen.getByText('Select Fuel');
    fireEvent.click(selectButton);
    const cashButton = screen.getByText('Pay with Cash');
    fireEvent.click(cashButton);
    expect(screen.queryByText('Select Payment Method')).toBeNull();
  });
});
