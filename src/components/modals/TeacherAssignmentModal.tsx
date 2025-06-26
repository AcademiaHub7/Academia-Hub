import React, { useState } from 'react';
import FormModal from './FormModal';
import { Save, User, BookOpen, Clock, Calendar } from 'lucide-react';

interface TeacherAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assignmentData: any) => void;
  assignmentData?: any;
  isEdit?: boolean;
  teachers?: any[];
  subjects?: any[];
  classes?: any[];
  schoolYears?: any[];
}

const TeacherAssignmentModal: React.FC<TeacherAssignmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  assignmentData,
  isEdit = false,
  teachers = [],
  subjects = [],
  classes = [],
  schoolYears = []
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

  const defaultSchoolYears = [
    { id: 'SY-001', name: '2023-2024', isActive: true },
    { id: 'SY-002', name: '2022-2023', isActive: false }
  ];

  const allTeachers = teachers.length > 0 ? teachers : defaultTeachers;
  const allSubjects = subjects.length > 0 ? subjects : defaultSubjects;
  const allClasses = classes.length > 0 ? classes : defaultClasses;
  const allSchoolYears = schoolYears.length > 0 ? schoolYears : defaultSchoolYears;

  const [formData, setFormData] = useState({
    teacherId: assignmentData?.teacherId || '',
    classId: assignmentData?.classId || '',
    subjectId: assignmentData?.subjectId || '',
    schoolYearId: assignmentData?.schoolYearId || allSchoolYears.find(sy => sy.isActive)?.id || '',
    hoursPerWeek: assignmentData?.hoursPerWeek || 1,
    isMainTeacher: assignmentData?.isMainTeacher || false,
    startDate: assignmentData?.startDate || new Date().toISOString().split('T')[0],
    endDate: assignmentData?.endDate || '',
    notes: assignmentData?.notes || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  // Vérifier la charge horaire de l'enseignant
  const checkTeacherWorkload = () => {
    // Dans une implémentation réelle, vous feriez une vérification côté serveur
    // Ici, on simule une vérification
    const teacher = allTeachers.find(t => t.id === formData.teacherId);
    if (!teacher) return { isOverloaded: false, currentHours: 0, maxHours: 0 };
    
    // Simulation de la charge horaire actuelle
    const currentHours = 15; // Heures déjà assignées
    const maxHours = 20; // Maximum d'heures autorisées
    
    return {
      isOverloaded: (currentHours + formData.hoursPerWeek) > maxHours,
      currentHours,
      maxHours
    };
  };

  const workload = checkTeacherWorkload();

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Modifier une affectation" : "Nouvelle affectation d'enseignant"}
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
            form="teacher-assignment-form"
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {isEdit ? "Mettre à jour" : "Enregistrer"}
          </button>
        </div>
      }
    >
      <form id="teacher-assignment-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Informations de l'affectation
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <div>
              <label htmlFor="schoolYearId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Année scolaire*
              </label>
              <select
                id="schoolYearId"
                name="schoolYearId"
                value={formData.schoolYearId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Sélectionner une année scolaire</option>
                {allSchoolYears.map(year => (
                  <option key={year.id} value={year.id}>{year.name} {year.isActive ? '(Actuelle)' : ''}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="hoursPerWeek" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Heures par semaine*
              </label>
              <input
                type="number"
                id="hoursPerWeek"
                name="hoursPerWeek"
                value={formData.hoursPerWeek}
                onChange={handleChange}
                required
                min="1"
                max="30"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isMainTeacher"
                name="isMainTeacher"
                checked={formData.isMainTeacher}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <label htmlFor="isMainTeacher" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Professeur principal de la classe
              </label>
            </div>
          </div>
        </div>
        
        {/* Période */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
            Période d'affectation
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date de début*
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date de fin (optionnelle)
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          
          <div className="mt-4">
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
        
        {/* Vérification de la charge horaire */}
        <div className={`rounded-lg p-6 border ${
          workload.isOverloaded 
            ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30' 
            : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/30'
        }`}>
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Clock className={`w-5 h-5 mr-2 ${
              workload.isOverloaded 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-blue-600 dark:text-blue-400'
            }`} />
            Charge horaire de l'enseignant
          </h4>
          
          {formData.teacherId ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={`${
                  workload.isOverloaded 
                    ? 'text-red-800 dark:text-red-300' 
                    : 'text-blue-800 dark:text-blue-300'
                }`}>
                  Charge actuelle:
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {workload.currentHours}h / {workload.maxHours}h
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className={`${
                  workload.isOverloaded 
                    ? 'text-red-800 dark:text-red-300' 
                    : 'text-blue-800 dark:text-blue-300'
                }`}>
                  Heures à ajouter:
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formData.hoursPerWeek}h
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className={`${
                  workload.isOverloaded 
                    ? 'text-red-800 dark:text-red-300' 
                    : 'text-blue-800 dark:text-blue-300'
                }`}>
                  Nouvelle charge:
                </span>
                <span className={`font-bold ${
                  workload.isOverloaded 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  {workload.currentHours + formData.hoursPerWeek}h / {workload.maxHours}h
                </span>
              </div>
              
              {workload.isOverloaded && (
                <div className="mt-2 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-300">
                    Attention: Cette affectation dépasse la charge horaire maximale de l'enseignant.
                    Veuillez ajuster les heures ou obtenir une autorisation spéciale.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              Veuillez sélectionner un enseignant pour voir sa charge horaire.
            </p>
          )}
        </div>
      </form>
    </FormModal>
  );
};

export default TeacherAssignmentModal;