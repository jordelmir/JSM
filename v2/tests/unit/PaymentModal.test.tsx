import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { vi } from 'vitest';
import PaymentModal from '../../src/components/PaymentModal';
import { useTranslation } from 'react-i18next';

// Mock useTranslation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Simple mock: returns the key itself
  }),
}));

describe('PaymentModal', () => {
  const mockOnClose = vi.fn();
  const mockOnPayment = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock document.activeElement for focus restoration tests
    Object.defineProperty(document, 'activeElement', {
      value: document.body, // Default active element
      writable: true,
    });
    // Mock focus method for elements
    vi.spyOn(HTMLElement.prototype, 'focus').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup(); // Clean up DOM after each test
  });

  it('should not render when isOpen is false', () => {
    render(<PaymentModal isOpen={false} onClose={mockOnClose} onPayment={mockOnPayment} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(<PaymentModal isOpen={true} onClose={mockOnClose} onPayment={mockOnPayment} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Select Payment Method')).toBeInTheDocument();
  });

  it('should call onClose when Escape key is pressed', () => {
    render(<PaymentModal isOpen={true} onClose={mockOnClose} onPayment={mockOnPayment} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onPayment with "cash" when "Pay with Cash" button is clicked', () => {
    render(<PaymentModal isOpen={true} onClose={mockOnClose} onPayment={mockOnPayment} />);
    fireEvent.click(screen.getByText('Pay with Cash'));
    expect(mockOnPayment).toHaveBeenCalledTimes(1);
    expect(mockOnPayment).toHaveBeenCalledWith('cash');
  });

  it('should call onPayment with "card" when "Pay with Card" button is clicked', () => {
    render(<PaymentModal isOpen={true} onClose={mockOnClose} onPayment={mockOnPayment} />);
    fireEvent.click(screen.getByText('Pay with Card'));
    expect(mockOnPayment).toHaveBeenCalledTimes(1);
    expect(mockOnPayment).toHaveBeenCalledWith('card');
  });

  it('should call onClose when "Cancel" button is clicked', () => {
    render(<PaymentModal isOpen={true} onClose={mockOnClose} onPayment={mockOnPayment} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  // --- Accessibility (Focus Trapping) Tests ---

  it('should focus the modal itself on open', () => {
    render(<PaymentModal isOpen={true} onClose={mockOnClose} onPayment={mockOnPayment} />);
    expect(screen.getByRole('dialog')).toHaveFocus();
  });

  it('should trap focus within the modal when tabbing forward', () => {
    render(<PaymentModal isOpen={true} onClose={mockOnClose} onPayment={mockOnPayment} />);
    const cashButton = screen.getByText('Pay with Cash');
    const cardButton = screen.getByText('Pay with Card');
    const cancelButton = screen.getByText('Cancel');

    // Simulate tabbing from the modal itself to the first focusable element
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Tab' });
    expect(cashButton).toHaveFocus();

    // Tab from cash to card
    fireEvent.keyDown(cashButton, { key: 'Tab' });
    expect(cardButton).toHaveFocus();

    // Tab from card to cancel
    fireEvent.keyDown(cardButton, { key: 'Tab' });
    expect(cancelButton).toHaveFocus();

    // Tab from cancel (last element) should loop back to cash (first element)
    fireEvent.keyDown(cancelButton, { key: 'Tab' });
    expect(cashButton).toHaveFocus();
  });

  it('should trap focus within the modal when tabbing backward (Shift+Tab)', () => {
    render(<PaymentModal isOpen={true} onClose={mockOnClose} onPayment={mockOnPayment} />);
    const cashButton = screen.getByText('Pay with Cash');
    const cardButton = screen.getByText('Pay with Card');
    const cancelButton = screen.getByText('Cancel');

    // Set focus to the last element first
    cancelButton.focus();
    expect(cancelButton).toHaveFocus();

    // Shift+Tab from cancel to card
    fireEvent.keyDown(cancelButton, { key: 'Tab', shiftKey: true });
    expect(cardButton).toHaveFocus();

    // Shift+Tab from card to cash
    fireEvent.keyDown(cardButton, { key: 'Tab', shiftKey: true });
    expect(cashButton).toHaveFocus();

    // Shift+Tab from cash (first element) should loop back to cancel (last element)
    fireEvent.keyDown(cashButton, { key: 'Tab', shiftKey: true });
    expect(cancelButton).toHaveFocus();
  });

  it('should restore focus to the previously focused element on close', () => {
    const mockTriggerButton = document.createElement('button');
    mockTriggerButton.textContent = 'Open Modal';
    document.body.appendChild(mockTriggerButton);
    mockTriggerButton.focus(); // Simulate button having focus before modal opens

    render(<PaymentModal isOpen={true} onClose={mockOnClose} onPayment={mockOnPayment} />);
    expect(screen.getByRole('dialog')).toHaveFocus(); // Modal gets focus on open

    fireEvent.click(screen.getByText('Cancel')); // Close the modal
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockTriggerButton).toHaveFocus(); // Focus should return to the button
    
    document.body.removeChild(mockTriggerButton); // Clean up
  });
});