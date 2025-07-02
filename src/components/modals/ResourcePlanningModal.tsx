import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Search, Filter, Download, Printer, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

interface ResourcePlanningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  resource: any;
}

const ResourcePlanningModal: React.FC<ResourcePlanningModalProps> = ({
  isOpen,
  onClose,
  onSave,
  resource
}) => {
  const [selectedView, setSelectedView] = useState('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState<any[]>([]);

  // Charger les événements initiaux
  useEffect(() => {
    // Simuler le chargement des événements
    const mockEvents = [
      {
        id: '1',
        title: 'Réunion équipe',
        start: new Date(2024, 6, 2, 9, 0),
        end: new Date(2024, 6, 2, 10, 30),
        resourceId: resource?.id || 'all',
        type: 'meeting'
      },
      // Ajoutez plus d'événements de test si nécessaire
    ];
    setEvents(mockEvents);
  }, [resource]);

  // Fonction pour obtenir la date formatée
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fonction pour naviguer entre les jours/semaines/mois
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (selectedView === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'prev' ? -1 : 1));
    } else if (selectedView === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'prev' ? -7 : 7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'prev' ? -1 : 1));
    }
    setSelectedDate(newDate);
  };

  // Générateur d'horaires de la journée (8h-20h)
  const timeSlots = Array.from({ length: 13 }, (_, i) => ({
    time: `${8 + i}:00`,
    events: events.filter(event => {
      const eventHour = event.start.getHours();
      return eventHour === 8 + i;
    })
  }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* En-tête */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            <Calendar className="inline-block w-6 h-6 mr-2 text-blue-500" />
            Planning {resource ? `- ${resource.name}` : 'des ressources'}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setSelectedView('day')}
                className={`px-3 py-1 rounded-md text-sm ${selectedView === 'day' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
              >
                Jour
              </button>
              <button
                onClick={() => setSelectedView('week')}
                className={`px-3 py-1 rounded-md text-sm ${selectedView === 'week' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
              >
                Semaine
              </button>
              <button
                onClick={() => setSelectedView('month')}
                className={`px-3 py-1 rounded-md text-sm ${selectedView === 'month' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
              >
                Mois
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateDate('prev')}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium">
                {formatDate(selectedDate)}
              </span>
              <button
                onClick={() => navigateDate('next')}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Barre d'outils */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center text-sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </button>
            <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center text-sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </button>
            <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center text-sm">
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </button>
            <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center text-sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </button>
          </div>
        </div>

        {/* Corps du planning */}
        <div className="flex-1 overflow-auto p-4">
          {selectedView === 'day' && (
            <div className="space-y-2">
              <div className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {formatDate(selectedDate)}
              </div>
              <div className="space-y-4">
                {timeSlots.map((slot) => (
                  <div key={slot.time} className="flex">
                    <div className="w-20 text-sm text-gray-500 dark:text-gray-400">
                      {slot.time}
                    </div>
                    <div className="flex-1 border-t border-gray-200 dark:border-gray-700 pt-2">
                      {slot.events.map((event) => (
                        <div 
                          key={event.id}
                          className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg"
                        >
                          <div className="font-medium text-blue-800 dark:text-blue-200">{event.title}</div>
                          <div className="text-xs text-blue-600 dark:text-blue-300">
                            {event.start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - {event.end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {selectedView === 'week' && (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              Vue semaine - En développement
            </div>
          )}
          
          {selectedView === 'month' && (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              Vue mois - En développement
            </div>
          )}
        </div>

        {/* Pied de page */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Fermer
          </button>
          <button
            onClick={() => {
              onSave({ date: selectedDate, view: selectedView });
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourcePlanningModal;
