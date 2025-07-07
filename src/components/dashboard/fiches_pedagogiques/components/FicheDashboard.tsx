import React from 'react';
import { BarChart, Calendar, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useFicheContext } from '../context/FicheContext';
import NotificationList from './NotificationList';
import { SUBJECTS } from '../types';

const FicheDashboard: React.FC = () => {
  const { stats, fiches } = useFicheContext();

  // Fonction pour obtenir le nom complet d'une matière
  const getSubjectName = (code: string): string => {
    const subject = SUBJECTS.find(s => s.value === code);
    return subject ? subject.label : code;
  };

  // Fonction pour générer une couleur basée sur une chaîne
  const stringToColor = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 60%)`;
  };

  // Générer les dates du mois courant pour le calendrier
  const generateCalendarDays = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const days = [];
    const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Lundi = 0
    
    // Jours du mois précédent
    const prevMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    for (let i = startOffset - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        currentMonth: false,
        hasEvent: false
      });
    }
    
    // Jours du mois courant
    for (let i = 1; i <= lastDay.getDate(); i++) {
      // Vérifier si des fiches sont prévues ce jour
      const date = new Date(today.getFullYear(), today.getMonth(), i);
      const hasEvent = fiches.some(fiche => {
        const ficheDate = new Date(fiche.date);
        return ficheDate.getDate() === date.getDate() && 
               ficheDate.getMonth() === date.getMonth() && 
               ficheDate.getFullYear() === date.getFullYear();
      });
      
      days.push({
        day: i,
        currentMonth: true,
        hasEvent,
        isToday: i === today.getDate()
      });
    }
    
    // Compléter avec les jours du mois suivant
    const remainingDays = 42 - days.length; // 6 semaines complètes
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        currentMonth: false,
        hasEvent: false
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const currentMonth = new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Tableau de bord</h2>
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total fiches</p>
              <p className="text-2xl font-semibold">{stats?.created || 0}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Validées</p>
              <p className="text-2xl font-semibold">{stats?.validated || 0}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">En attente</p>
              <p className="text-2xl font-semibold">{stats?.pending || 0}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Rejetées</p>
              <p className="text-2xl font-semibold">{stats?.rejected || 0}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition par matière */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center mb-4">
            <BarChart className="h-5 w-5 mr-2 text-gray-500" />
            <h3 className="font-medium">Répartition par matière</h3>
          </div>
          
          {stats && Object.keys(stats.bySubject).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(stats.bySubject).map(([subject, count]) => (
                <div key={subject} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: stringToColor(subject) }}
                  ></div>
                  <span className="text-sm flex-1">{getSubjectName(subject)}</span>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>Aucune donnée disponible</p>
            </div>
          )}
        </div>
        
        {/* Calendrier */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center mb-4">
            <Calendar className="h-5 w-5 mr-2 text-gray-500" />
            <h3 className="font-medium">{currentMonth}</h3>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                {day}
              </div>
            ))}
            
            {calendarDays.map((day, index) => (
              <div 
                key={index}
                className={`text-center text-sm p-1 rounded-full ${
                  day.currentMonth 
                    ? day.isToday
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-800'
                    : 'text-gray-400'
                }`}
              >
                <div className="relative">
                  {day.day}
                  {day.hasEvent && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-green-500"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Notifications */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 lg:col-span-2">
          <NotificationList />
        </div>
      </div>
    </div>
  );
};

export { FicheDashboard };
