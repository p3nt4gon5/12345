import React from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

const Toast: React.FC<ToastProps> = ({ message, type }) => {
  const bg =
    type === 'success' ? 'bg-green-500' :
    type === 'error' ? 'bg-red-500' : 'bg-blue-500';

  return (
    <div className={`fixed top-6 right-6 z-50 px-5 py-3 text-white rounded shadow-lg ${bg} animate-fade-in-out`}>
      {message}
    </div>
  );
};

export default Toast;
