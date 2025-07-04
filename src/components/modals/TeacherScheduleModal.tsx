import React, { useState } from 'react';
import { X, Calendar, Clock, BookOpen, MapPin, Users } from 'lucide-react';

interface TeacherScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: {
    id: string;
    name: string;
    subject: string;
    classes: string[];
    weeklyHours: number;
    maxHours: number;
  } | null;
}

// Données factices pour le planning de l'enseignant
interface ScheduleEntry {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  class: string;
  room: string;
}

const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

const TeacherScheduleModal: React.FC<TeacherScheduleModalProps> = ({ isOpen, onClose, teacher }) => {
  const [activeDay, setActiveDay] = useState('Lundi');

  if (!isOpen || !teacher) return null;

  // Données factices pour le planning de l'enseignant
  const scheduleData: ScheduleEntry[] = [
    { id: 'SCH001', day: 'Lundi', startTime: '08:00', endTime: '10:00', subject: 'Mathématiques', class: '6ème A', room: 'Salle 101' },
    { id: 'SCH002', day: 'Lundi', startTime: '10:00', endTime: '12:00', subject: 'Mathématiques', class: '5ème B', room: 'Salle 102' },
    { id: 'SCH003', day: 'Lundi', startTime: '14:00', endTime: '16:00', subject: 'Mathématiques', class: '4ème C', room: 'Salle 103' },
    { id: 'SCH004', day: 'Mardi', startTime: '08:00', endTime: '10:00', subject: 'Mathématiques', class: '3ème A', room: 'Salle 104' },
    { id: 'SCH005', day: 'Mardi', startTime: '10:00', endTime: '12:00', subject: 'Mathématiques', class: '6ème B', room: 'Salle 105' },
    { id: 'SCH006', day: 'Mercredi', startTime: '08:00', endTime: '10:00', subject: 'Mathématiques', class: '5ème A', room: 'Salle 101' },
    { id: 'SCH007', day: 'Jeudi', startTime: '10:00', endTime: '12:00', subject: 'Mathématiques', class: '4ème A', room: 'Salle 102' },
    { id: 'SCH008', day: 'Jeudi', startTime: '14:00', endTime: '16:00', subject: 'Mathématiques', class: '3ème B', room: 'Salle 103' },
    { id: 'SCH009', day: 'Vendredi', startTime: '08:00', endTime: '10:00', subject: 'Mathématiques', class: '6ème C', room: 'Salle 104' },
    { id: 'SCH010', day: 'Vendredi', startTime: '10:00', endTime: '12:00', subject: 'Mathématiques', class: '5ème C', room: 'Salle 105' },
  ];

  // Filtrer les entrées du planning pour le jour actif
  const filteredSchedule = scheduleData.filter(entry => entry.day === activeDay);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isOpen ? '' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Planning de {teacher.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {teacher.subject} • {teacher.weeklyHours}h/{teacher.maxHours}h
              </p>
            </div>
          </div>
          
          <button 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={onClose}
            title="Fermer"
            aria-label="Fermer le modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Tabs pour les jours de la semaine */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {daysOfWeek.map(day => (
            <button
              key={day}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                activeDay === day
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
              onClick={() => setActiveDay(day)}
            >
              {day}
            </button>
          ))}
        </div>
        
        {/* Contenu du planning */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredSchedule.length > 0 ? (
            <div className="space-y-4">
              {filteredSchedule.map(entry => (
                <div 
                  key={entry.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex flex-col items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <span className="text-xs font-medium text-purple-600 dark:text-purple-400 mt-1">
                          {entry.startTime}
                        </span>
                        <span className="text-xs text-purple-600 dark:text-purple-400">
                          {entry.endTime}
                        </span>
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <BookOpen className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
                            {entry.subject}
                          </h3>
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-1">
                          <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {entry.class}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-1">
                          <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {entry.room}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                        {parseInt(entry.endTime) - parseInt(entry.startTime)}h
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Aucun cours programmé pour {activeDay}
              </p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total: {filteredSchedule.reduce((acc, curr) => acc + (parseInt(curr.endTime) - parseInt(curr.startTime)), 0)}h sur {activeDay}
            </div>
            <button 
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
              onClick={onClose}
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherScheduleModal;
