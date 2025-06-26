import React, { useState } from 'react';
import FormModal from './FormModal';
import { Save, Building, Users, BookOpen } from 'lucide-react';

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (classData: any) => void;
  classData?: any;
  isEdit?: boolean;
  educationLevels?: any[];
  teachers?: any[];
}

const ClassModal: React.FC<ClassModalProps> = ({
  isOpen,
  onClose,
  onSave,
  classData,
  isEdit = false,
  educationLevels = [],
  teachers = []
}) => {
  const defaultEducationLevels = [
    { id: 'LVL-001', name: 'Primaire' },
    { id: 'LVL-002', name: 'Collège' },
    { id: 'LVL-003', name: 'Lycée' }
  ];

  const defaultTeachers = [
    { id: 'TCH-001', name: 'M. Dubois', subject: 'Mathématiques' },
    { id: 'TCH-002', name: 'Mme Martin', subject: 'Français' },
    { id: 'TCH-003', name: 'M. Laurent', subject: 'Histoire-Géographie' }
  ];

  const allEducationLevels = educationLevels.length > 0 ? educationLevels : defaultEducationLevels;
  const allTeachers = teachers.length > 0 ? teachers : defaultTeachers;

  const [formData, setFormData] = useState({
    name: classData?.name || '',
    code: classData?.code || '',
    educationLevelId: classData?.educationLevelId || '',
    capacity: classData?.capacity || 30,
    mainTeacherId: classData?.mainTeacherId || '',
    room: classData?.room || '',
    description: classData?.description || '',
    isActive: classData?.isActive !== undefined ? classData.isActive : true
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

  // Générer un code basé sur le nom si le code est vide
  const generateCode = () => {
    if (!formData.code && formData.name) {
      const code = formData.name
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .substring(0, 8);
      
      setFormData(prev => ({
        ...prev,
        code
      }));
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Modifier une classe" : "Créer une nouvelle classe"}
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
            form="class-form"
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {isEdit ? "Mettre à jour" : "Enregistrer"}
          </button>
        </div>
      }
    >
      <form id="class-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Building className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Informations de la classe
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom de la classe*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={generateCode}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Ex: 6ème A"
              />
            </div>
            
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Code*
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Ex: 6A"
              />
            </div>
            
            <div>
              <label htmlFor="educationLevelId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Niveau d'éducation*
              </label>
              <select
                id="educationLevelId"
                name="educationLevelId"
                value={formData.educationLevelId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Sélectionner un niveau</option>
                {allEducationLevels.map(level => (
                  <option key={level.id} value={level.id}>{level.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Capacité*
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="mainTeacherId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Professeur principal
              </label>
              <select
                id="mainTeacherId"
                name="mainTeacherId"
                value={formData.mainTeacherId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Sélectionner un enseignant</option>
                {allTeachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>{teacher.name} ({teacher.subject})</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="room" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Salle
              </label>
              <input
                type="text"
                id="room"
                name="room"
                value={formData.room}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Ex: Salle 101"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Description de la classe..."
              />
            </div>
            
            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Classe active
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Informations d'aide */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start space-x-3">
          <Building className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">Information</p>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              {isEdit 
                ? "La modification de cette classe sera enregistrée dans l'historique des changements."
                : "Un identifiant unique au format CLS-YYYY-NNNNN sera automatiquement généré pour cette nouvelle classe."}
            </p>
          </div>
        </div>
      </form>
    </FormModal>
  );
};

export default ClassModal;