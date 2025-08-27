
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PaymentModal from '../../src/components/PaymentModal';

describe('PaymentModal', () => {
  it('should not render if isOpen is false', () => {
    render(<PaymentModal isOpen={false} onClose={() => {}} onPayment={() => {}} />);
    expect(screen.queryByText('Select Payment Method')).toBeNull();
  });

  it('should render if isOpen is true', () => {
    render(<PaymentModal isOpen={true} onClose={() => {}} onPayment={() => {}} />);
    expect(screen.getByText('Select Payment Method')).toBeInTheDocument();
  });

  it('should call onPayment with "cash" when the cash button is clicked', () => {
    const onPayment = vi.fn();
    render(<PaymentModal isOpen={true} onClose={() => {}} onPayment={onPayment} />);
    fireEvent.click(screen.getByText('Pay with Cash'));
    expect(onPayment).toHaveBeenCalledWith('cash');
  });

  it('should call onPayment with "card" when the card button is clicked', () => {
    const onPayment = vi.fn();
    render(<PaymentModal isOpen={true} onClose={() => {}} onPayment={onPayment} />);
    fireEvent.click(screen.getByText('Pay with Card'));
    expect(onPayment).toHaveBeenCalledWith('card');
  });

  it('should call onClose when the cancel button is clicked', () => {
    const onClose = vi.fn();
    render(<PaymentModal isOpen={true} onClose={onClose} onPayment={() => {}} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });
});
