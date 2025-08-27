
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ToastNotification from '../../src/components/ToastNotification';
import eventBus from '../../src/core/eventBus';

describe('ToastNotification', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should not be visible initially', () => {
    render(<ToastNotification />);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('should appear when a notification event is emitted', () => {
    render(<ToastNotification />);
    eventBus.emit('notification', { type: 'success', message: 'Test message' });
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should disappear after 3 seconds', () => {
    vi.useFakeTimers();
    render(<ToastNotification />);
    eventBus.emit('notification', { type: 'success', message: 'Test message' });
    expect(screen.getByText('Test message')).toBeInTheDocument();
    vi.advanceTimersByTime(3000);
    expect(screen.queryByText('Test message')).toBeNull();
  });
});
