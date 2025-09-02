import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { vi } from 'vitest';
import { Button } from '../../../src/components/Button'; // Adjust path
import { useTranslation } from 'react-i18next';

// Mock useTranslation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Simple mock: returns the key itself
  }),
}));

describe('Button', () => {
  const mockOnPress = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly with title', () => {
    render(<Button title="Test Button" onPress={mockOnPress} />);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
    expect(screen.getByA11yLabel('Test Button')).toBeInTheDocument();
  });

  it('should call onPress when button is pressed', () => {
    render(<Button title="Press Me" onPress={mockOnPress} />);
    fireEvent.press(screen.getByText('Press Me'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should display ActivityIndicator when loading is true', () => {
    render(<Button title="Loading" onPress={mockOnPress} loading={true} />);
    expect(screen.queryByText('Loading')).not.toBeInTheDocument();
    expect(screen.getByTestId('activity-indicator')).toBeInTheDocument(); // Assuming ActivityIndicator has testID
  });

  it('should disable button when loading is true', () => {
    render(<Button title="Loading" onPress={mockOnPress} loading={true} />);
    expect(screen.getByText('Loading').parent).toBeDisabled();
  });

  it('should disable button when disabled prop is true', () => {
    render(<Button title="Disabled" onPress={mockOnPress} disabled={true} />);
    expect(screen.getByText('Disabled').parent).toBeDisabled();
  });

  it('should not call onPress when button is disabled', () => {
    render(<Button title="Disabled" onPress={mockOnPress} disabled={true} />);
    fireEvent.press(screen.getByText('Disabled'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('should apply custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    const customTextStyle = { color: 'blue' };
    render(<Button title="Styled" onPress={mockOnPress} style={customStyle} textStyle={customTextStyle} />);
    expect(screen.getByText('Styled').parent).toHaveStyle(customStyle);
    expect(screen.getByText('Styled')).toHaveStyle(customTextStyle);
  });
});
