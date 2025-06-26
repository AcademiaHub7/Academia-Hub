import React, { useState } from 'react';
import FormModal from './FormModal';
import { Save, Calendar, Clock, MapPin, User, BookOpen, AlertTriangle } from 'lucide-react';

interface ScheduleEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scheduleData: any) => void;
  scheduleData?: any;
  isEdit?: boolean;
  teachers?: any[];
  subjects?: any[];
  classes?: any[];
  rooms?: any[];
}

const ScheduleEntryModal: React.FC<ScheduleEntryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  scheduleData,
  isEdit = false,
  teachers = [],
  subjects = [],
  classes = [],
  rooms = []
}) => {
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

  const defaultRooms = [
    { id: 'ROOM-001', name: 'Salle 101', type: 'Salle de classe', capacity: 30 },
    { id: 'ROOM-002', name: 'Salle 102', type: 'Salle de classe', capacity: 30 },
    { id: 'LAB-001', name: 'Laboratoire SVT', type: 'Laboratoire', capacity: 24 },
    { id: 'LAB-002', name: 'Laboratoire Physique', type: 'Laboratoire', capacity: 24 },
    { id: 'ROOM-003', name: 'Salle informatique', type: 'Salle spécialisée', capacity: 20 }
  ];

  const allTeachers = teachers.length > 0 ? teachers : defaultTeachers;
  const allSubjects = subjects.length > 0 ? subjects : defaultSubjects;
  const allClasses = classes.length > 0 ? classes : defaultClasses;
  const allRooms = rooms.length > 0 ? rooms : defaultRooms;

  const [formData, setFormData] = useState({
    dayOfWeek: scheduleData?.dayOfWeek || 1,
    startTime: scheduleData?.startTime || '08:00',
    endTime: scheduleData?.endTime || '09:00',
    teacherId: scheduleData?.teacherId || '',
    subjectId: scheduleData?.subjectId || '',
    classId: scheduleData?.classId || '',
    roomId: scheduleData?.roomId || '',
    notes: scheduleData?.notes || ''
  });

  const [conflicts, setConflicts] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Vérifier les conflits à chaque changement
    checkConflicts();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier les conflits avant de soumettre
    const hasConflicts = checkConflicts();
    if (hasConflicts && !window.confirm('Il y a des conflits avec cet horaire. Voulez-vous continuer quand même?')) {
      return;
    }
    
    onSave(formData);
    onClose();
  };

  // Vérifier les conflits d'horaire
  const checkConflicts = (): boolean => {
    const newConflicts: string[] = [];
    
    // Dans une implémentation réelle, vous feriez une vérification côté serveur
    // Ici, on simule quelques conflits pour démonstration
    
    // Conflit de salle
    if (formData.roomId === 'ROOM-001' && formData.dayOfWeek === 1 && formData.startTime === '08:00') {
      newConflicts.push('La salle est déjà réservée pour ce créneau');
    }
    
    // Conflit d'enseignant
    if (formData.teacherId === 'TCH-001' && formData.dayOfWeek === 1 && formData.startTime === '08:00') {
      newConflicts.push('L\'enseignant a déjà un cours programmé à ce moment');
    }
    
    // Conflit de classe
    if (formData.classId === 'CLS-001' && formData.dayOfWeek === 1 && formData.startTime === '08:00') {
      newConflicts.push('La classe a déjà un cours programmé à ce moment');
    }
    
    setConflicts(newConflicts);
    return newConflicts.length > 0;
  };

  const getDayName = (day: number): string => {
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    return days[day - 1] || '';
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Modifier un cours" : "Ajouter un cours à l'emploi du temps"}
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
            form="schedule-entry-form"
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {isEdit ? "Mettre à jour" : "Enregistrer"}
          </button>
        </div>
      }
    >
      <form id="schedule-entry-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Horaire */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Jour et horaire
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Jour de la semaine*
              </label>
              <select
                id="dayOfWeek"
                name="dayOfWeek"
                value={formData.dayOfWeek}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="1">Lundi</option>
                <option value="2">Mardi</option>
                <option value="3">Mercredi</option>
                <option value="4">Jeudi</option>
                <option value="5">Vendredi</option>
                <option value="6">Samedi</option>
              </select>
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
        </div>
        
        {/* Informations du cours */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
            Informations du cours
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <option key={room.id} value={room.id}>{room.name} ({room.type})</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
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
        </div>
        
        {/* Conflits */}
        {conflicts.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-900/30">
            <h4 className="text-lg font-medium text-red-900 dark:text-red-300 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Conflits d'horaire détectés
            </h4>
            
            <ul className="space-y-2">
              {conflicts.map((conflict, index) => (
                <li key={index} className="flex items-start">
                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 mr-2" />
                  <span className="text-red-800 dark:text-red-300">{conflict}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Récapitulatif */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-900/30">
          <h4 className="text-lg font-medium text-blue-900 dark:text-blue-300 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Récapitulatif du cours
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Jour:</span>
                <span className="font-bold text-blue-900 dark:text-blue-200">
                  {getDayName(parseInt(formData.dayOfWeek.toString()))}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Horaire:</span>
                <span className="font-medium text-blue-900 dark:text-blue-200">
                  {formData.startTime} - {formData.endTime}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Matière:</span>
                <span className="font-medium text-blue-900 dark:text-blue-200">
                  {formData.subjectId ? allSubjects.find(s => s.id === formData.subjectId)?.name || 'Non sélectionnée' : 'Non sélectionnée'}
                </span>
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
                <span className="text-blue-800 dark:text-blue-300">Classe:</span>
                <span className="font-medium text-blue-900 dark:text-blue-200">
                  {formData.classId ? allClasses.find(c => c.id === formData.classId)?.name || 'Non sélectionnée' : 'Non sélectionnée'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Salle:</span>
                <span className="font-medium text-blue-900 dark:text-blue-200">
                  {formData.roomId ? allRooms.find(r => r.id === formData.roomId)?.name || 'Non sélectionnée' : 'Non sélectionnée'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormModal>
  );
};

export default ScheduleEntryModal;