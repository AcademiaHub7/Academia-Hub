import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import FormModal from './FormModal';
import { Save, GraduationCap, Calendar, Users, MapPin, Clock, Upload } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  position: string;
}

interface Document {
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  url: string;
}

interface TrainingFormData {
  id: string;
  title: string;
  category: string;
  description: string;
  instructor: string;
  startDate: string;
  endDate: string;
  location: string;
  duration: string;
  maxParticipants: number;
  cost: number;
  participants: string[];
  objectives: string;
  materials: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  documents: Document[];
  notes: string;
}

interface TrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trainingData: TrainingFormData) => void;
  trainingData?: Partial<TrainingFormData>;
  isEdit?: boolean;
  employees?: Employee[];
}

const TrainingModal: React.FC<TrainingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  trainingData,
  isEdit = false,
  employees = []
}) => {
  const defaultEmployees: Employee[] = [
    { id: 'PER-2024-00001', name: 'Marie Dubois', position: 'Professeur de Français' },
    { id: 'PER-2024-00002', name: 'Pierre Martin', position: 'Professeur de Mathématiques' },
    { id: 'PER-2024-00003', name: 'Sophie Laurent', position: 'Secrétaire administrative' }
  ];

  const allEmployees: Employee[] = employees && employees.length > 0 ? employees : defaultEmployees;

  // Initialize form data with default values or provided training data
  const getInitialFormData = (): TrainingFormData => {
    const now = new Date();
    const defaultEndDate = new Date(now);
    defaultEndDate.setDate(now.getDate() + 7); // 7 days from now
    
    const defaultData: TrainingFormData = {
      id: `FORM-${now.getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      title: '',
      category: '',
      description: '',
      instructor: '',
      startDate: now.toISOString().split('T')[0],
      endDate: defaultEndDate.toISOString().split('T')[0],
      location: '',
      duration: '',
      maxParticipants: 10,
      cost: 0,
      participants: [],
      objectives: '',
      materials: '',
      status: 'scheduled',
      documents: [],
      notes: ''
    };
    
    // Merge with provided training data if it exists
    return trainingData ? { ...defaultData, ...trainingData } : defaultData;
  };

  const [formData, setFormData] = useState<TrainingFormData>(getInitialFormData());

  const [selectedParticipant, setSelectedParticipant] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => {
      // Handle different input types
      let processedValue: string | number = value;
      
      if (type === 'number') {
        processedValue = value === '' ? 0 : Number(value);
      } else if (name === 'maxParticipants' || name === 'cost') {
        processedValue = value === '' ? 0 : Number(value);
      }
      
      return {
        ...prev,
        [name]: processedValue
      };
    });
  };

  const handleAddParticipant = () => {
    if (selectedParticipant && !formData.participants.includes(selectedParticipant)) {
      setFormData(prev => ({
        ...prev,
        participants: [...prev.participants, selectedParticipant]
      }));
      setSelectedParticipant('');
    }
  };

  const handleRemoveParticipant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles: Document[] = [];
    const invalidFiles: string[] = [];

    Array.from(files).forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push(`${file.name} (Trop volumineux > 10MB)`);
      } else if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        invalidFiles.push(`${file.name} (Type de fichier non supporté)`);
      } else {
        validFiles.push({
          name: file.name,
          type: file.type,
          size: file.size,
          uploadDate: new Date().toISOString(),
          // In a real implementation, you would upload the file and store the URL
          url: URL.createObjectURL(file)
        });
      }
    });

    if (invalidFiles.length > 0) {
      alert(`Les fichiers suivants n'ont pas pu être ajoutés :\n${invalidFiles.join('\n')}`);
    }

    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...validFiles]
      }));
    }
  };

  const handleRemoveDocument = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    // Revoke object URL to prevent memory leaks
    const docToRemove = formData.documents[index];
    if (docToRemove?.url?.startsWith('blob:')) {
      URL.revokeObjectURL(docToRemove.url);
    }
    
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };
  


  const validateForm = (): boolean => {
    // Define required fields with their human-readable names
    type FormField = keyof Pick<TrainingFormData, 'title' | 'category' | 'instructor' | 'startDate' | 'endDate' | 'location' | 'duration'>;
    
    const requiredFields: { key: FormField; name: string }[] = [
      { key: 'title', name: 'titre' },
      { key: 'category', name: 'catégorie' },
      { key: 'instructor', name: 'formateur' },
      { key: 'startDate', name: 'date de début' },
      { key: 'endDate', name: 'date de fin' },
      { key: 'location', name: 'lieu' },
      { key: 'duration', name: 'durée' }
    ];
    
    // Check required fields
    for (const { key, name } of requiredFields) {
      const value = formData[key];
      if (value === '' || value === null || value === undefined) {
        alert(`Le champ "${name}" est obligatoire`);
        return false;
      }
    }
    
    // Validate dates
    const startDate = new Date(formData.startDate as string);
    const endDate = new Date(formData.endDate as string);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      alert("Les dates fournies sont invalides");
      return false;
    }
    
    if (startDate > endDate) {
      alert("La date de début doit être antérieure à la date de fin");
      return false;
    }
    
    // Validate cost
    const cost = Number(formData.cost);
    if (isNaN(cost) || cost < 0) {
      alert("Le coût doit être un nombre positif");
      return false;
    }
    
    // Validate max participants
    const maxParticipants = Number(formData.maxParticipants);
    if (isNaN(maxParticipants) || maxParticipants <= 0) {
      alert("Le nombre maximum de participants doit être un nombre supérieur à zéro");
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Create a clean copy of form data with proper types
      const formDataToSave: TrainingFormData = {
        ...formData,
        // Ensure dates are properly formatted
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        // Ensure numeric fields are numbers
        cost: Number(formData.cost) || 0,
        maxParticipants: Math.max(1, Number(formData.maxParticipants) || 1),
        // Ensure arrays are properly copied
        participants: [...formData.participants],
        documents: formData.documents.map(doc => ({ ...doc }))
      };
      
      onSave(formDataToSave);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      alert('Une erreur est survenue lors de la soumission du formulaire');
    }
  };

  // Formatage des montants en F CFA
  // Format currency amount (e.g., 1000 -> '1 000')
  const formatAmount = (amount: number): string => {
    return amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  // Clean up object URLs when component unmounts or documents change
  useEffect(() => {
    const currentDocuments = [...(formData.documents || [])];
    
    return () => {
      currentDocuments.forEach(doc => {
        if (doc?.url?.startsWith('blob:')) {
          URL.revokeObjectURL(doc.url);
        }
      });
    };
  }, [formData.documents]);
  


  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Modifier une formation" : "Nouvelle formation"}
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
            form="training-form"
            className="px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {isEdit ? "Mettre à jour" : "Enregistrer"}
          </button>
        </div>
      }
    >
      <form id="training-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <GraduationCap className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
            Informations de la formation
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Titre de la formation*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Ex: Formation numérique éducatif"
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Catégorie*
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Sélectionner une catégorie</option>
                <option value="Pédagogie">Pédagogie</option>
                <option value="Management">Management</option>
                <option value="Numérique">Numérique</option>
                <option value="Sécurité">Sécurité</option>
                <option value="Administration">Administration</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Formateur*
              </label>
              <input
                type="text"
                id="instructor"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Ex: Organisme externe"
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
                placeholder="Description détaillée de la formation..."
              />
            </div>
          </div>
        </div>
        
        {/* Dates et logistique */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
            Dates et logistique
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
                Date de fin*
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Lieu*
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Ex: Salle de conférence"
              />
            </div>
            
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Durée*
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Ex: 21h"
              />
            </div>
            
            <div>
              <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre max. de participants
              </label>
              <input
                type="number"
                id="maxParticipants"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="cost" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Coût (F CFA)
              </label>
              <input
                type="number"
                id="cost"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Statut*
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="scheduled">Planifiée</option>
                <option value="in-progress">En cours</option>
                <option value="completed">Terminée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Participants */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Participants
          </h4>
          
          <div className="space-y-4">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <select
                  id="participant-select"
                  value={selectedParticipant}
                  onChange={(e) => setSelectedParticipant(e.target.value)}
                  aria-label="Sélectionner un participant à ajouter"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none"
                >
                  <option value="">Sélectionner un participant</option>
                  {allEmployees
                    .filter(emp => !formData.participants.includes(emp.id))
                    .map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} ({employee.position})
                      </option>
                    ))
                  }
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddParticipant}
                disabled={!selectedParticipant}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                aria-label="Ajouter le participant sélectionné"
              >
                Ajouter
              </button>
            </div>
            
            {formData.participants.length > 0 ? (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Participant
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Poste
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {formData.participants.map((participantId, index) => {
                      const participant = allEmployees.find(emp => emp.id === participantId);
                      const participantName = participant ? participant.name : '';
                      return participant ? (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                            {participantName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {participant.position}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => handleRemoveParticipant(index)}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded"
                              aria-label={`Retirer ${participantName}`}
                              title="Retirer le participant"
                            >
                              <span className="sr-only">Retirer {participantName}</span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ) : null;
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                Aucun participant ajouté
              </div>
            )}
            
            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
              <span>Participants: {formData.participants.length}</span>
              <span>Maximum: {formData.maxParticipants}</span>
            </div>
          </div>
        </div>
        
        {/* Contenu et objectifs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-red-600 dark:text-red-400" />
            Contenu et objectifs
          </h4>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="objectives" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Objectifs de la formation
              </label>
              <textarea
                id="objectives"
                name="objectives"
                value={formData.objectives}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Objectifs pédagogiques..."
              />
            </div>
            
            <div>
              <label htmlFor="materials" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Matériel pédagogique
              </label>
              <textarea
                id="materials"
                name="materials"
                value={formData.materials}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Supports, matériel nécessaire..."
              />
            </div>
          </div>
        </div>
        
        {/* Documents */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Upload className="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400" />
            Documents
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <label 
                htmlFor="document-upload"
                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 cursor-pointer flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && document.getElementById('document-upload')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" aria-hidden="true" />
                <span>Ajouter des documents</span>
                <input
                  type="file"
                  id="document-upload"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  aria-label="Ajouter des documents"
                />
              </label>
              <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                Formats acceptés: PDF, DOCX, PPTX (max 10MB)
              </span>
            </div>
            
            {formData.documents.length > 0 ? (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Nom
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Taille
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {formData.documents.map((doc, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                          {doc.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {doc.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {(doc.size / 1024).toFixed(2)} KB
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            onClick={(e) => handleRemoveDocument(index, e)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded p-1"
                            aria-label={`Supprimer le document ${doc.name}`}
                            title="Supprimer le document"
                          >
                            <span className="sr-only">Supprimer {doc.name}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                Aucun document ajouté
              </div>
            )}
          </div>
        </div>
        
        {/* Notes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-400" />
            Notes et informations complémentaires
          </h4>
          
          <div>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Notes supplémentaires..."
            />
          </div>
        </div>
        
        {/* Récapitulatif */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-900/30">
          <h4 className="text-lg font-medium text-purple-900 dark:text-purple-300 mb-4 flex items-center">
            <GraduationCap className="w-5 h-5 mr-2" />
            Récapitulatif de la formation
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-purple-800 dark:text-purple-300">Titre:</span>
                <span className="font-bold text-purple-900 dark:text-purple-200">
                  {formData.title || 'Non renseigné'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-purple-800 dark:text-purple-300">Dates:</span>
                <span className="font-medium text-purple-900 dark:text-purple-200">
                  Du {formData.startDate} au {formData.endDate}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-purple-800 dark:text-purple-300">Durée:</span>
                <span className="font-medium text-purple-900 dark:text-purple-200">{formData.duration || 'Non renseignée'}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-purple-800 dark:text-purple-300">Formateur:</span>
                <span className="font-medium text-purple-900 dark:text-purple-200">{formData.instructor || 'Non renseigné'}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-purple-800 dark:text-purple-300">Participants:</span>
                <span className="font-medium text-purple-900 dark:text-purple-200">
                  {formData.participants.length}/{formData.maxParticipants}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-purple-800 dark:text-purple-300">Coût:</span>
                <span className="font-medium text-purple-900 dark:text-purple-200">
                  {formData.cost > 0 ? `${formatAmount(formData.cost)} F CFA` : 'Gratuit'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-purple-800 dark:text-purple-300">Statut:</span>
                <span className="font-medium text-purple-900 dark:text-purple-200">
                  {formData.status === 'scheduled' ? 'Planifiée' : 
                   formData.status === 'in-progress' ? 'En cours' : 
                   formData.status === 'completed' ? 'Terminée' : 'Annulée'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-purple-800 dark:text-purple-300">Référence:</span>
                <span className="font-medium text-purple-900 dark:text-purple-200">{formData.id}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormModal>
  );
};

export default TrainingModal;