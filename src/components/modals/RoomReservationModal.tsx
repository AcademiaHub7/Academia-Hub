import React, { useState } from 'react';
import FormModal from './FormModal';
import { Save, MapPin, Calendar, Clock, BookOpen, User } from 'lucide-react';

interface RoomReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reservationData: any) => void;
  reservationData?: any;
  isEdit?: boolean;
  rooms?: any[];
  teachers?: any[];
  subjects?: any[];
  classes?: any[];
}

const RoomReservationModal: React.FC<RoomReservationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  reservationData,
  isEdit = false,
  rooms = [],
  teachers = [],
  subjects = [],
  classes = []
}) => {
  const defaultRooms = [
    { id: 'ROOM-001', name: 'Salle 101', type: 'Salle de classe', capacity: 30 },
    { id: 'ROOM-002', name: 'Salle 102', type: 'Salle de classe', capacity: 30 },
    { id: 'LAB-001', name: 'Laboratoire SVT', type: 'Laboratoire', capacity: 24 },
    { id: 'LAB-002', name: 'Laboratoire Physique', type: 'Laboratoire', capacity: 24 },
    { id: 'ROOM-003', name: 'Salle informatique', type: 'Salle spécialisée', capacity: 20 }
  ];

  const defaultTeachers = [
    { id: 'TCH-001', name: 'M. Dubois', subject: 'Mathématiques' },
    { id: 'TCH-002', name: 'Mme Martin', subject: 'Français' },
    { id: 'TCH-003', name: 'M. Laurent', subject: 'Histoire-Géographie' }
  ];

  const defaultSubjects = [
    { id: 'SUB-001', name: 'Mathématiques', code: 'MATH' },
    { id: 'SUB-002', name: 'Français', code: 'FR' },
    { id: 'SUB-003', name: 'Histoire-Géographie', code: 'HIST-GEO' },
    { id: 'SUB-004', name: 'Sciences Physiques', code: 'PHYS' },
    { id: 'SUB-005', name: 'SVT', code: 'SVT' }
  ];

  const defaultClasses = [
    { id: 'CLS-001', name: '6ème A' },
    { id: 'CLS-002', name: '5ème B' },
    { id: 'CLS-003', name: '4ème A' },
    { id: 'CLS-004', name: '3ème A' },
    { id: 'CLS-005', name: '2nde B' }
  ];

  const allRooms = rooms.length > 0 ? rooms : defaultRooms;
  const allTeachers = teachers.length > 0 ? teachers : defaultTeachers;
  const allSubjects = subjects.length > 0 ? subjects : defaultSubjects;
  const allClasses = classes.length > 0 ? classes : defaultClasses;

  const [formData, setFormData] = useState({
    title: reservationData?.title || '',
    roomId: reservationData?.roomId || '',
    teacherId: reservationData?.teacherId || '',
    subjectId: reservationData?.subjectId || '',
    classId: reservationData?.classId || '',
    date: reservationData?.date || new Date().toISOString().split('T')[0],
    startTime: reservationData?.startTime || '08:00',
    endTime: reservationData?.endTime || '09:00',
    isRecurring: reservationData?.isRecurring || false,
    recurrencePattern: reservationData?.recurrencePattern || 'weekly',
    recurrenceEndDate: reservationData?.recurrenceEndDate || (() => {
      const date = new Date();
      date.setMonth(date.getMonth() + 3);
      return date.toISOString().split('T')[0];
    })(),
    notes: reservationData?.notes || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  // Vérifier si la salle est disponible
  const checkRoomAvailability = () => {
    // Dans une implémentation réelle, vous feriez une vérification côté serveur
    // Ici, on simule une vérification
    return true;
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Modifier une réservation" : "Nouvelle réservation de salle"}
      size="lg"
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
            form="room-reservation-form"
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {isEdit ? "Mettre à jour" : "Réserver"}
          </button>
        </div>
      }
    >
      <form id="room-reservation-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Informations de la réservation
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Titre de la réservation*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Ex: Cours de Mathématiques 6ème A"
              />
            </div>
            
            <div>
              <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Salle*
              </label>
              <select
                id="roomId"
                name="roomId"
                value={formData.roomId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Sélectionner une salle</option>
                {allRooms.map(room => (
                  <option key={room.id} value={room.id}>{room.name} ({room.type}, {room.capacity} places)</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Enseignant*
              </label>
              <select
                id="teacherId"
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Sélectionner un enseignant</option>
                {allTeachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>{teacher.name} ({teacher.subject})</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="subjectId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Matière*
              </label>
              <select
                id="subjectId"
                name="subjectId"
                value={formData.subjectId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Sélectionner une matière</option>
                {allSubjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name} ({subject.code})</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="classId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Classe*
              </label>
              <select
                id="classId"
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Sélectionner une classe</option>
                {allClasses.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Date et heure */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
            Date et heure
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date*
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Heure de début*
              </label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Heure de fin*
              </label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isRecurring"
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <label htmlFor="isRecurring" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Réservation récurrente
              </label>
            </div>
            
            {formData.isRecurring && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor="recurrencePattern" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fréquence*
                  </label>
                  <select
                    id="recurrencePattern"
                    name="recurrencePattern"
                    value={formData.recurrencePattern}
                    onChange={handleChange}
                    required={formData.isRecurring}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="daily">Quotidienne</option>
                    <option value="weekly">Hebdomadaire</option>
                    <option value="biweekly">Toutes les deux semaines</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="recurrenceEndDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date de fin de récurrence*
                  </label>
                  <input
                    type="date"
                    id="recurrenceEndDate"
                    name="recurrenceEndDate"
                    value={formData.recurrenceEndDate}
                    onChange={handleChange}
                    required={formData.isRecurring}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Notes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
            Notes et informations complémentaires
          </h4>
          
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Informations complémentaires..."
            />
          </div>
        </div>
        
        {/* Vérification de disponibilité */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-900/30">
          <h4 className="text-lg font-medium text-blue-900 dark:text-blue-300 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Vérification de disponibilité
          </h4>
          
          {checkRoomAvailability() ? (
            <div className="flex items-center text-green-600 dark:text-green-400">
              <div className="w-4 h-4 bg-green-600 dark:bg-green-400 rounded-full mr-2"></div>
              <span>La salle est disponible pour ce créneau</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600 dark:text-red-400">
              <div className="w-4 h-4 bg-red-600 dark:bg-red-400 rounded-full mr-2"></div>
              <span>La salle n'est pas disponible pour ce créneau</span>
            </div>
          )}
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Salle:</span>
                <span className="font-bold text-blue-900 dark:text-blue-200">
                  {formData.roomId ? allRooms.find(r => r.id === formData.roomId)?.name || 'Non sélectionnée' : 'Non sélectionnée'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Date:</span>
                <span className="font-medium text-blue-900 dark:text-blue-200">{formData.date}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Horaire:</span>
                <span className="font-medium text-blue-900 dark:text-blue-200">{formData.startTime} - {formData.endTime}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Enseignant:</span>
                <span className="font-medium text-blue-900 dark:text-blue-200">
                  {formData.teacherId ? allTeachers.find(t => t.id === formData.teacherId)?.name || 'Non sélectionné' : 'Non sélectionné'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Matière:</span>
                <span className="font-medium text-blue-900 dark:text-blue-200">
                  {formData.subjectId ? allSubjects.find(s => s.id === formData.subjectId)?.name || 'Non sélectionnée' : 'Non sélectionnée'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Classe:</span>
                <span className="font-medium text-blue-900 dark:text-blue-200">
                  {formData.classId ? allClasses.find(c => c.id === formData.classId)?.name || 'Non sélectionnée' : 'Non sélectionnée'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormModal>
  );
};

export default RoomReservationModal;