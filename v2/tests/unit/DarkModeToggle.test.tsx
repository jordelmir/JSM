
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DarkModeToggle from '../../src/components/DarkModeToggle';

describe('DarkModeToggle', () => {
  it('should toggle dark mode on click', () => {
    render(<DarkModeToggle />);
    const toggleButton = screen.getByRole('button');

    // Initial state: light mode
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(toggleButton.textContent).toBe('Dark Mode');

    // Click to toggle to dark mode
    fireEvent.click(toggleButton);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(toggleButton.textContent).toBe('Light Mode');

    // Click to toggle back to light mode
    fireEvent.click(toggleButton);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(toggleButton.textContent).toBe('Dark Mode');
  });
});
