import React, { useState } from 'react';
import FormModal from './FormModal';
import { Save, User, Calendar, Clock, CheckCircle, X } from 'lucide-react';

interface TeacherAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (availabilityData: any) => void;
  teacherId?: string;
  teacherName?: string;
  existingAvailability?: any[];
}

const TeacherAvailabilityModal: React.FC<TeacherAvailabilityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  teacherId,
  teacherName,
  existingAvailability = []
}) => {
  // Heures de début possibles (de 8h à 18h)
  const timeSlots = Array.from({ length: 11 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  // Jours de la semaine
  const weekDays = [
    { id: 1, name: 'Lundi' },
    { id: 2, name: 'Mardi' },
    { id: 3, name: 'Mercredi' },
    { id: 4, name: 'Jeudi' },
    { id: 5, name: 'Vendredi' },
    { id: 6, name: 'Samedi' }
  ];

  // Initialiser la disponibilité
  const initializeAvailability = () => {
    if (existingAvailability.length > 0) {
      return existingAvailability;
    }
    
    // Créer une disponibilité par défaut (tous les jours de 8h à 18h)
    return weekDays.map(day => ({
      dayId: day.id,
      slots: timeSlots.map(time => ({
        time,
        available: true
      }))
    }));
  };

  const [availability, setAvailability] = useState(initializeAvailability());
  const [notes, setNotes] = useState('');

  // Mettre à jour la disponibilité d'un créneau
  const toggleAvailability = (dayId: number, time: string) => {
    setAvailability(prev => 
      prev.map(day => 
        day.dayId === dayId 
          ? {
              ...day,
              slots: day.slots.map(slot => 
                slot.time === time 
                  ? { ...slot, available: !slot.available } 
                  : slot
              )
            }
          : day
      )
    );
  };

  // Définir tous les créneaux d'une journée comme disponibles ou non
  const setDayAvailability = (dayId: number, available: boolean) => {
    setAvailability(prev => 
      prev.map(day => 
        day.dayId === dayId 
          ? {
              ...day,
              slots: day.slots.map(slot => ({ ...slot, available }))
            }
          : day
      )
    );
  };

  // Définir tous les créneaux d'une heure comme disponibles ou non (pour tous les jours)
  const setTimeAvailability = (time: string, available: boolean) => {
    setAvailability(prev => 
      prev.map(day => ({
        ...day,
        slots: day.slots.map(slot => 
          slot.time === time 
            ? { ...slot, available } 
            : slot
        )
      }))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      teacherId,
      availability,
      notes
    });
    onClose();
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Disponibilités de ${teacherName || 'l\'enseignant'}`}
      size="xl"
      footer={
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Annuler
          </button>
          <button
            type="submit"
            form="availability-form"
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Enregistrer
          </button>
        </div>
      }
    >
      <form id="availability-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Grille de disponibilité
          </h4>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Jour / Heure
                  </th>
                  {timeSlots.map(time => (
                    <th key={time} className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {time}
                      <div className="mt-1">
                        <button
                          type="button"
                          onClick={() => setTimeAvailability(time, true)}
                          className="p-1 text-xs text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/20 rounded mr-1"
                          title="Disponible pour tous les jours"
                        >
                          <CheckCircle className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setTimeAvailability(time, false)}
                          className="p-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                          title="Indisponible pour tous les jours"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {availability.map(day => {
                  const dayObj = weekDays.find(d => d.id === day.dayId);
                  return (
                    <tr key={day.dayId} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900 dark:text-gray-100">{dayObj?.name}</span>
                          <div className="ml-2">
                            <button
                              type="button"
                              onClick={() => setDayAvailability(day.dayId, true)}
                              className="p-1 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/20 rounded mr-1"
                              title="Disponible toute la journée"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDayAvailability(day.dayId, false)}
                              className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                              title="Indisponible toute la journée"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </td>
                      {day.slots.map(slot => (
                        <td key={slot.time} className="px-4 py-4 whitespace-nowrap text-center">
                          <button
                            type="button"
                            onClick={() => toggleAvailability(day.dayId, slot.time)}
                            className={`w-6 h-6 rounded-full ${
                              slot.available 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50' 
                                : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                            }`}
                          >
                            {slot.available ? <CheckCircle className="w-4 h-4 mx-auto" /> : <X className="w-4 h-4 mx-auto" />}
                          </button>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes et contraintes particulières
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Contraintes particulières, préférences horaires, etc."
            />
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start space-x-3">
          <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">Légende</p>
            <div className="mt-2 flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-1">
                  <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm text-blue-700 dark:text-blue-400">Disponible</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mr-1">
                  <X className="w-3 h-3 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-sm text-blue-700 dark:text-blue-400">Indisponible</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormModal>
  );
};

export default TeacherAvailabilityModal;