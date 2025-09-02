import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { vi } from 'vitest';
import ErrorBoundary from '../../../src/components/ErrorBoundary'; // Adjust path

describe('ErrorBoundary', () => {
  const mockT = vi.fn((key) => key); // Mock translation function
  const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
    mockConsoleError.mockClear();
  });

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary t={mockT}>
        <Text>Child Component</Text>
      </ErrorBoundary>
    );
    expect(screen.getByText('Child Component')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong.')).not.toBeInTheDocument();
  });

  it('should render fallback UI when an error occurs', () => {
    const ThrowError = () => {
      throw new Error('Test Error');
    };

    render(
      <ErrorBoundary t={mockT}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(screen.getByText('Please restart the application.')).toBeInTheDocument();
    expect(mockConsoleError).toHaveBeenCalledTimes(1);
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Uncaught error:',
      expect.any(Error),
      expect.any(Object)
    );
  });

  it('should display translated messages in fallback UI', () => {
    const ThrowError = () => {
      throw new Error('Test Error');
    };

    mockT.mockImplementation((key) => `Translated: ${key}`);

    render(
      <ErrorBoundary t={mockT}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Translated: Something went wrong.')).toBeInTheDocument();
    expect(screen.getByText('Translated: Please restart the application.')).toBeInTheDocument();
  });
});
