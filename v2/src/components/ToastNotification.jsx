import React from 'react';

function ToastNotification({ message }) {
  return (
    <div className="card">
      <p>Toast: {message}</p>
    </div>
  );
}

export default ToastNotification;