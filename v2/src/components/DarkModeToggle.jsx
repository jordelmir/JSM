import React from 'react';

function DarkModeToggle() {
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    // In a real app, you'd save this preference to localStorage
  };

  return (
    <div className="card">
      <h3>Dark Mode Toggle</h3>
      <button onClick={toggleDarkMode}>Toggle Dark Mode</button>
    </div>
  );
}

export default DarkModeToggle;