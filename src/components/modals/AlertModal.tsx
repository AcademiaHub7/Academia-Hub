import React from 'react';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />;
      default:
        return <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getHeaderColor = () => {
    switch (type) {
      case 'error':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'success':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      default:
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* This element prevents the click from propagating to the overlay */}
        <div 
          className="inline-block w-full max-w-md overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`flex items-center p-4 ${getHeaderColor()}`}>
            {getIcon()}
            <h3 className="ml-3 text-lg font-medium">{title}</h3>
            <button
              type="button"
              className="ml-auto text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              onClick={onClose}
            >
              <span className="sr-only">Fermer</span>
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {message}
            </p>
            
            <div className="mt-6">
              <button
                type="button"
                onClick={onClose}
                className="w-full px-4 py-2 text-center font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-lg transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;