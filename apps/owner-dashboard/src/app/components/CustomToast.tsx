import React from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

interface CustomToastProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const colorMap = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-blue-500',
  warning: 'text-orange-500',
};

export const CustomToast: React.FC<CustomToastProps> = ({ type, message }) => {
  const Icon = iconMap[type];
  const colorClass = colorMap[type];

  return (
    <div className="flex items-center p-4 rounded-lg shadow-lg bg-white border border-gray-200">
      {Icon && <Icon className={`w-6 h-6 mr-3 ${colorClass}`} />}
      <p className="text-gray-800 text-sm font-medium">{message}</p>
    </div>
  );
};
