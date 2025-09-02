import React, { useState, useEffect } from 'react';
import eventBus from '../core/eventBus';

/**
 * Props for the ToastNotification component.
 */
interface ToastNotificationProps {
  /**
   * The duration in milliseconds after which the toast notification will automatically hide.
   * Defaults to 3000ms (3 seconds).
   */
  timeout?: number;
}

interface ToastNotificationState {
  isOpen: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

/**
 * A component that displays temporary, event-driven toast notifications.
 * It listens for 'notification' events on the event bus and displays them for a configurable duration.
 * Includes ARIA live region attributes for improved accessibility.
 */
const ToastNotification: React.FC<ToastNotificationProps> = ({ timeout = 3000 }) => { // Default timeout to 3000ms
  const [toast, setToast] = useState<ToastNotificationState>({ isOpen: false, message: '', type: 'info' });

  useEffect(() => {
    const handleNotification = (data: { message: string; type: 'success' | 'error' | 'info' }) => {
      setToast({ isOpen: true, ...data });
      setTimeout(() => {
        setToast({ isOpen: false, message: '', type: 'info' });
      }, timeout); // Use the configurable timeout
    };

    eventBus.on('notification', handleNotification);

    return () => {
      eventBus.off('notification', handleNotification);
    };
  }, [timeout]); // Add timeout to dependency array

  if (!toast.isOpen) {
    return null;
  }

  return (
    <div
      role="status" // ARIA live region role
      aria-live="polite" // Announce changes politely
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 p-4 rounded-lg shadow-lg text-white
      ${toast.type === 'success' ? 'bg-green-500' : ''}
      ${toast.type === 'error' ? 'bg-red-500' : ''}
      ${toast.type === 'info' ? 'bg-blue-500' : ''}
    `}>
      {toast.message}
    </div>
  );
};

export default ToastNotification;
