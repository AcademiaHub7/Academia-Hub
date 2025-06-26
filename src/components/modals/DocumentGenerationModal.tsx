import React, { useState } from 'react';
import FormModal from './FormModal';
import { Save, FileText, Download, User, Calendar } from 'lucide-react';

interface DocumentGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (documentData: any) => void;
  documentTypes?: any[];
  students?: any[];
}

const DocumentGenerationModal: React.FC<DocumentGenerationModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  documentTypes = [],
  students = []
}) => {
  const defaultDocumentTypes = [
    { id: 'certificate', name: 'Certificat de scolarité', category: 'academique' },
    { id: 'attestation', name: 'Attestation de présence', category: 'academique' },
    { id: 'diploma', name: 'Diplôme', category: 'academique' },
    { id: 'student_list', name: 'Liste d\'élèves', category: 'administratif' },
    { id: 'class_report', name: 'Rapport de classe', category: 'administratif' }
  ];

  const defaultStudents = [
    { id: 'STD-001', name: 'Marie Dubois', class: '3ème A' },
    { id: 'STD-002', name: 'Pierre Martin', class: '2nde B' },
    { id: 'STD-003', name: 'Sophie Lambert', class: '1ère C' }
  ];

  const allDocumentTypes = documentTypes.length > 0 ? documentTypes : defaultDocumentTypes;
  const allStudents = students.length > 0 ? students : defaultStudents;

  const [formData, setFormData] = useState({
    documentType: '',
    studentId: '',
    studentName: '',
    studentClass: '',
    date: new Date().toISOString().split('T')[0],
    schoolYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    language: 'fr',
    format: 'pdf',
    includeSignature: true,
    includeStamp: true,
    comments: ''
  });

  const [isForClass, setIsForClass] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDocumentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const documentType = e.target.value;
    const isClassDocument = documentType === 'student_list' || documentType === 'class_report';
    
    setFormData(prev => ({
      ...prev,
      documentType,
      studentId: isClassDocument ? '' : prev.studentId
    }));
    
    setIsForClass(isClassDocument);
  };

  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const studentId = e.target.value;
    const student = allStudents.find(s => s.id === studentId);
    
    if (student) {
      setFormData(prev => ({
        ...prev,
        studentId,
        studentName: student.name,
        studentClass: student.class
      }));
    }
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const documentData = {
      ...formData,
      class: isForClass ? selectedClass : formData.studentClass
    };
    
    onGenerate(documentData);
    onClose();
  };

  // Extraire les classes uniques des élèves
  const uniqueClasses = Array.from(new Set(allStudents.map(student => student.class)));

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Générer un document"
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
            form="document-generation-form"
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Générer
          </button>
        </div>
      }
    >
      <form id="document-generation-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Type de document */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Type de document
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sélectionner un document*
              </label>
              <select
                id="documentType"
                name="documentType"
                value={formData.documentType}
                onChange={handleDocumentTypeChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Sélectionner un type de document</option>
                {allDocumentTypes.map(docType => (
                  <option key={docType.id} value={docType.id}>{docType.name}</option>
                ))}
              </select>
            </div>
            
            {formData.documentType && (
              <div className="md:col-span-2 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h5 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                  {allDocumentTypes.find(dt => dt.id === formData.documentType)?.name}
                </h5>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  {formData.documentType === 'certificate' && "Ce document atteste qu'un élève est inscrit dans l'établissement pour l'année scolaire en cours."}
                  {formData.documentType === 'attestation' && "Ce document atteste de la présence d'un élève à une date spécifique."}
                  {formData.documentType === 'diploma' && "Ce document officiel certifie la réussite d'un élève à un examen ou une formation."}
                  {formData.documentType === 'student_list' && "Ce document présente la liste complète des élèves d'une classe."}
                  {formData.documentType === 'class_report' && "Ce document présente un rapport détaillé sur une classe spécifique."}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Destinataire */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
            Destinataire
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isForClass ? (
              <div className="md:col-span-2">
                <label htmlFor="class" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Classe*
                </label>
                <select
                  id="class"
                  value={selectedClass}
                  onChange={handleClassChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Sélectionner une classe</option>
                  {uniqueClasses.map((className, index) => (
                    <option key={index} value={className}>{className}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="md:col-span-2">
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Élève*
                </label>
                <select
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleStudentChange}
                  required={!isForClass}
                  disabled={isForClass}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400"
                >
                  <option value="">Sélectionner un élève</option>
                  {allStudents.map(student => (
                    <option key={student.id} value={student.id}>{student.name} ({student.class})</option>
                  ))}
                </select>
              </div>
            )}
            
            {formData.studentId && !isForClass && (
              <div className="md:col-span-2 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Élève:</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{formData.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Classe:</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{formData.studentClass}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Options du document */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400" />
            Options du document
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date du document*
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
              <label htmlFor="schoolYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Année scolaire*
              </label>
              <input
                type="text"
                id="schoolYear"
                name="schoolYear"
                value={formData.schoolYear}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Langue
              </label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="fr">Français</option>
                <option value="en">Anglais</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="format" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Format
              </label>
              <select
                id="format"
                name="format"
                value={formData.format}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="pdf">PDF</option>
                <option value="docx">Word (DOCX)</option>
              </select>
            </div>
            
            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeSignature"
                  name="includeSignature"
                  checked={formData.includeSignature}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor="includeSignature" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Inclure la signature
                </label>
              </div>
            </div>
            
            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeStamp"
                  name="includeStamp"
                  checked={formData.includeStamp}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor="includeStamp" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Inclure le cachet
                </label>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Commentaires
              </label>
              <textarea
                id="comments"
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Commentaires ou instructions spéciales..."
              />
            </div>
          </div>
        </div>
        
        {/* Aperçu */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-900/30">
          <h4 className="text-lg font-medium text-blue-900 dark:text-blue-300 mb-4 flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Aperçu du document
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Type:</span>
                <span className="font-bold text-blue-900 dark:text-blue-200">
                  {allDocumentTypes.find(dt => dt.id === formData.documentType)?.name || 'Non sélectionné'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Destinataire:</span>
                <span className="font-medium text-blue-900 dark:text-blue-200">
                  {isForClass ? selectedClass : formData.studentName || 'Non sélectionné'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Date:</span>
                <span className="font-medium text-blue-900 dark:text-blue-200">{formData.date}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Année scolaire:</span>
                <span className="font-medium text-blue-900 dark:text-blue-200">{formData.schoolYear}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Format:</span>
                <span className="font-medium text-blue-900 dark:text-blue-200">{formData.format.toUpperCase()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Authentification:</span>
                <span className="font-medium text-blue-900 dark:text-blue-200">
                  {formData.includeSignature && formData.includeStamp 
                    ? 'Signature et cachet' 
                    : formData.includeSignature 
                      ? 'Signature uniquement' 
                      : formData.includeStamp 
                        ? 'Cachet uniquement' 
                        : 'Aucune'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormModal>
  );
};

export default DocumentGenerationModal;