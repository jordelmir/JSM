import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Spinner } from '../../../src/components/Spinner'; // Adjust path

describe('Spinner', () => {
  it('should render with default size and color', () => {
    render(<Spinner />);
    const activityIndicator = screen.getByTestId('activity-indicator'); // Assuming testID is added
    expect(activityIndicator).toBeInTheDocument();
    // Note: Testing specific props of ActivityIndicator might require more advanced mocking
    // or direct inspection of component props if exposed by testing-library/react-native.
  });

  it('should render with custom size and color', () => {
    render(<Spinner size="small" color="red" />);
    const activityIndicator = screen.getByTestId('activity-indicator');
    expect(activityIndicator).toBeInTheDocument();
  });
});
