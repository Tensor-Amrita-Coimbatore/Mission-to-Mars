import React from 'react';

function Spinner({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-mono text-primary-cyan">
      <div className="w-16 h-16 border-4 border-primary-cyan border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-lg animate-pulse">{message}</p>
    </div>
  );
}

export default Spinner;