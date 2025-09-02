import { render, screen, act, cleanup } from '@testing-library/react';
import { vi } from 'vitest';
import ToastNotification from '../../src/components/ToastNotification';
import eventBus from '../../src/core/eventBus';

describe('ToastNotification', () => {
  // Use fake timers to control setTimeout
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    vi.spyOn(eventBus, 'on').mockImplementation(() => {});
    vi.spyOn(eventBus, 'off').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.runOnlyPendingTimers(); // Clear any pending timers
    vi.useRealTimers(); // Restore real timers
    cleanup();
  });

  it('should not render initially', () => {
    render(<ToastNotification />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('should render and display message on "notification" event', () => {
    render(<ToastNotification />);
    const mockNotification = { message: 'Hello Toast!', type: 'info' as const };

    // Simulate event emission
    act(() => {
      // Find the listener that was registered with eventBus.on
      const onCall = (eventBus.on as any).mock.calls.find(call => call[0] === 'notification');
      if (onCall) {
        const listener = onCall[1];
        listener(mockNotification);
      }
    });

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Hello Toast!')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveClass('bg-blue-500'); // Check info type styling
  });

  it('should hide after default timeout', () => {
    render(<ToastNotification />);
    const mockNotification = { message: 'Auto-hide test', type: 'success' as const };

    act(() => {
      const onCall = (eventBus.on as any).mock.calls.find(call => call[0] === 'notification');
      if (onCall) {
        const listener = onCall[1];
        listener(mockNotification);
      }
    });

    expect(screen.getByText('Auto-hide test')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000); // Advance by default timeout
    });

    expect(screen.queryByText('Auto-hide test')).not.toBeInTheDocument();
  });

  it('should hide after configurable timeout', () => {
    render(<ToastNotification timeout={5000} />); // Custom timeout
    const mockNotification = { message: 'Custom timeout test', type: 'error' as const };

    act(() => {
      const onCall = (eventBus.on as any).mock.calls.find(call => call[0] === 'notification');
      if (onCall) {
        const listener = onCall[1];
        listener(mockNotification);
      }
    });

    expect(screen.getByText('Custom timeout test')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveClass('bg-red-500'); // Check error type styling

    act(() => {
      vi.advanceTimersByTime(4999); // Not enough time
    });
    expect(screen.getByText('Custom timeout test')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1); // Just enough time
    });
    expect(screen.queryByText('Custom timeout test')).not.toBeInTheDocument();
  });

  it('should unsubscribe from eventBus on unmount', () => {
    const { unmount } = render(<ToastNotification />);
    expect(eventBus.on).toHaveBeenCalledWith('notification', expect.any(Function));
    unmount();
    expect(eventBus.off).toHaveBeenCalledWith('notification', expect.any(Function));
  });

  it('should apply correct styling for different types', () => {
    const { rerender } = render(<ToastNotification />);
    const statusElement = screen.getByRole('status');

    // Info type
    act(() => {
      const onCall = (eventBus.on as any).mock.calls.find(call => call[0] === 'notification');
      if (onCall) {
        const listener = onCall[1];
        listener({ message: 'Info', type: 'info' });
      }
    });
    expect(statusElement).toHaveClass('bg-blue-500');
    expect(statusElement).not.toHaveClass('bg-green-500', 'bg-red-500');

    // Success type
    act(() => {
      const onCall = (eventBus.on as any).mock.calls.find(call => call[0] === 'notification');
      if (onCall) {
        const listener = onCall[1];
        listener({ message: 'Success', type: 'success' });
      }
    });
    expect(statusElement).toHaveClass('bg-green-500');
    expect(statusElement).not.toHaveClass('bg-blue-500', 'bg-red-500');

    // Error type
    act(() => {
      const onCall = (eventBus.on as any).mock.calls.find(call => call[0] === 'notification');
      if (onCall) {
        const listener = onCall[1];
        listener({ message: 'Error', type: 'error' });
      }
    });
    expect(statusElement).toHaveClass('bg-red-500');
    expect(statusElement).not.toHaveClass('bg-blue-500', 'bg-green-500');
  });
});