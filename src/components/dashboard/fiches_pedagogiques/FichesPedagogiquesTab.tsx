import React, { useState, useEffect, useCallback } from 'react';
import { Bell } from 'lucide-react';
import { FicheList } from "./components/FicheList";
import { Fiche, Notification, SecurityContext } from './types';


interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface FichesPedagogiquesTabProps {
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  updateFiche: (id: string, updates: Partial<Fiche>) => void;
  securityContext: SecurityContext;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const FichesPedagogiquesTab: React.FC<FichesPedagogiquesTabProps> = ({
  onEdit,
  onView,
  updateFiche,
  securityContext,
  setNotifications,
}) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  // Define main tabs
  const mainTabs: Tab[] = [
    {
      id: 'fiches',
      label: 'Fiches',
      content: (
        <FicheList
          onEdit={onEdit}
          onView={onView}
        />
      )
    }
  ];

  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [notifications, setNotificationsState] = useState<Notification[]>([]);

  const handleNotificationClick = useCallback((notification: Notification) => {
    setNotificationsOpen(false);
    if (notification.link) {
      window.location.href = notification.link;
    }
  }, []);

  const handleCreateNew = useCallback(() => {
    if (securityContext.permissions.canWrite) {
      const newFiche: Fiche = {
        id: crypto.randomUUID(),
        title: '',
        subject: '',
        class: '',
        level: '',
        duration: 0,
        date: new Date(),
        description: '',
        objectives: [] as string[],
        activities: [] as { title: string; description: string; duration: number }[],
        resources: [] as string[],
        status: 'draft',
        createdBy: securityContext.user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      updateFiche(newFiche.id, newFiche);
      
      // Créer une notification
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: 'success' as const,
        message: 'Nouvelle fiche créée avec succès',
        date: new Date(),
        read: false,
        link: `/fiches/${newFiche.id}`,
        relatedFicheId: newFiche.id
      };
      setNotificationsState(prev => [...prev, newNotification]);
    }
  }, [securityContext.permissions.canWrite, securityContext.user.id, updateFiche]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const [tab] = hash.split('/');
        setActiveTab(tab || 'fiches');
      } else {
        setActiveTab('fiches');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Fiches Pédagogiques</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-lg hover:bg-gray-100"
            aria-label="Notifications"
            aria-expanded={notificationsOpen ? 'true' : 'false'}
            aria-controls="notifications-panel"
            role="button"
            tabIndex={0}
            title="Voir les notifications"
          >
            <Bell className="w-5 h-5" />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            title="Créer une nouvelle fiche pédagogique"
          >
            Nouvelle Fiche
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="-mb-px flex space-x-8" role="tablist" aria-label="Navigation des fiches pédagogiques">
          {mainTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-current={activeTab === tab.id ? 'true' : 'false'}
              role="tab"
              aria-selected={activeTab === tab.id ? 'true' : 'false'}
              aria-controls={`tab-content-${tab.id}`}
              id={`tab-${tab.id}`}
              title={`Afficher ${tab.label}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {mainTabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            id={`tab-content-${tab.id}`}
            hidden={activeTab !== tab.id}
            aria-hidden={activeTab !== tab.id}
            title={`Contenu de ${tab.label}`}
          >
            {tab.content}
          </div>
        ))}
      </div>
      {notificationsOpen && (
        <div id="notifications-panel" className="fixed top-16 right-4 w-80 bg-white rounded-lg shadow-lg">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Notifications</h3>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex justify-between items-start p-3 border-b last:border-0 hover:bg-gray-50"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div>
                    <p className="font-medium">{notification.message}</p>
                    <small className="text-gray-500">
                      {notification.date.toLocaleString()}
                    </small>
                  </div>
                  {notification.read && (
                    <span className="text-green-500">✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FichesPedagogiquesTab;
