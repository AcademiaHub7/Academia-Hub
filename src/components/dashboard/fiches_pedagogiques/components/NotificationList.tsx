import React from 'react';
import { Bell, CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useFicheContext } from '../context/FicheContext';
import { Notification } from '../types';

const NotificationList: React.FC = () => {
  const { notifications, markNotificationAsRead } = useFicheContext();

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    
    // Moins d'une minute
    if (diff < 60000) {
      return 'À l\'instant';
    }
    
    // Moins d'une heure
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    
    // Moins d'un jour
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    }
    
    // Moins d'une semaine
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    }
    
    // Format date standard
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-lg flex items-center">
          <Bell className="h-5 w-5 mr-2" /> Notifications
          {unreadCount > 0 && (
            <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
              {unreadCount}
            </span>
          )}
        </h3>
        {notifications.length > 0 && (
          <button 
            className="text-sm text-blue-600 hover:underline"
            onClick={() => notifications.forEach(n => !n.read && markNotificationAsRead(n.id))}
          >
            Tout marquer comme lu
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <Bell className="h-10 w-10 mx-auto mb-2 text-gray-400" />
          <p>Aucune notification</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`p-3 rounded-md border ${
                notification.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
              } flex items-start justify-between`}
            >
              <div className="flex items-start">
                <div className="mr-3 mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <div>
                  <p className={`text-sm ${notification.read ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(notification.date)}
                  </p>
                  {notification.link && (
                    <a 
                      href={notification.link} 
                      className="text-xs text-blue-600 hover:underline mt-1 block"
                    >
                      Voir détails
                    </a>
                  )}
                </div>
              </div>
              {!notification.read && (
                <button 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => handleMarkAsRead(notification.id)}
                  title="Marquer comme lu"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { NotificationList };
