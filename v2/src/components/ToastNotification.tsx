
import React, { useState, useEffect } from 'react';
import eventBus from '../core/eventBus';

interface ToastNotificationState {
  isOpen: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

const ToastNotification: React.FC = () => {
  const [toast, setToast] = useState<ToastNotificationState>({ isOpen: false, message: '', type: 'info' });

  useEffect(() => {
    const handleNotification = (data: { message: string; type: 'success' | 'error' | 'info' }) => {
      setToast({ isOpen: true, ...data });
      setTimeout(() => {
        setToast({ isOpen: false, message: '', type: 'info' });
      }, 3000);
    };

    eventBus.on('notification', handleNotification);

    return () => {
      eventBus.off('notification', handleNotification);
    };
  }, []);

  if (!toast.isOpen) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 p-4 rounded-lg shadow-lg text-white
      ${toast.type === 'success' ? 'bg-green-500' : ''}
      ${toast.type === 'error' ? 'bg-red-500' : ''}
      ${toast.type === 'info' ? 'bg-blue-500' : ''}
    `}>
      {toast.message}
    </div>
  );
};

export default ToastNotification;
