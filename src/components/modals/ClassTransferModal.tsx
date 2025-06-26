import React, { useState } from 'react';
import FormModal from './FormModal';
import { Save, UserCheck, ArrowRight, Calendar, MessageSquare } from 'lucide-react';

interface ClassTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transferData: any) => void;
  transferData?: any;
  students?: any[];
  classes?: any[];
}

const ClassTransferModal: React.FC<ClassTransferModalProps> = ({
  isOpen,
  onClose,
  onSave,
  transferData,
  students = [],
  classes = []
}) => {
  const defaultStudents = [
    { id: 'STD-001', name: 'Marie Dubois', class: '3ème A' },
    { id: 'STD-002', name: 'Pierre Martin', class: '2nde B' },
    { id: 'STD-003', name: 'Sophie Lambert', class: '1ère C' }
  ];

  const defaultClasses = [
    { id: 'CLS-001', name: '6ème A' },
    { id: 'CLS-002', name: '5ème B' },
    { id: 'CLS-003', name: '4ème A' },
    { id: 'CLS-004', name: '3ème A' },
    { id: 'CLS-005', name: '3ème B' },
    { id: 'CLS-006', name: '2nde A' },
    { id: 'CLS-007', name: '2nde B' },
    { id: 'CLS-008', name: '1ère C' },
    { id: 'CLS-009', name: 'Terminale S' }
  ];

  const allStudents = students.length > 0 ? students : defaultStudents;
  const allClasses = classes.length > 0 ? classes : defaultClasses;

  const [formData, setFormData] = useState({
    studentId: transferData?.studentId || '',
    studentName: transferData?.studentName || '',
    currentClass: transferData?.currentClass || '',
    targetClassId: transferData?.targetClassId || '',
    transferDate: transferData?.transferDate || new Date().toISOString().split('T')[0],
    reason: transferData?.reason || '',
    notifyParent: transferData?.notifyParent !== undefined ? transferData.notifyParent : true,
    comments: transferData?.comments || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const studentId = e.target.value;
    const student = allStudents.find(s => s.id === studentId);
    
    if (student) {
      setFormData(prev => ({
        ...prev,
        studentId,
        studentName: student.name,
        currentClass: student.class
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Transfert d'élève"
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
            form="transfer-form"
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Enregistrer
          </button>
        </div>
      }
    >
      <form id="transfer-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de l'élève */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <UserCheck className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Élève à transférer
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Élève*
              </label>
              <select
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleStudentChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Sélectionner un élève</option>
                {allStudents.map(student => (
                  <option key={student.id} value={student.id}>{student.name} ({student.class})</option>
                ))}
              </select>
            </div>
            
            {formData.studentId && (
              <div className="md:col-span-2 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Élève:</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{formData.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Classe actuelle:</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{formData.currentClass}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Détails du transfert */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <ArrowRight className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
            Détails du transfert
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="targetClassId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Classe de destination*
              </label>
              <select
                id="targetClassId"
                name="targetClassId"
                value={formData.targetClassId}
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
              <label htmlFor="transferDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date du transfert*
              </label>
              <input
                type="date"
                id="transferDate"
                name="transferDate"
                value={formData.transferDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Motif du transfert*
              </label>
              <select
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Sélectionner un motif</option>
                <option value="Rééquilibrage des effectifs">Rééquilibrage des effectifs</option>
                <option value="Changement d'option">Changement d'option</option>
                <option value="Demande des parents">Demande des parents</option>
                <option value="Problèmes disciplinaires">Problèmes disciplinaires</option>
                <option value="Niveau inadapté">Niveau inadapté</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Notifications et commentaires */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
            Notifications et commentaires
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifyParent"
                name="notifyParent"
                checked={formData.notifyParent}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <label htmlFor="notifyParent" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Notifier le parent/tuteur du transfert
              </label>
            </div>
            
            <div>
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
                placeholder="Commentaires supplémentaires..."
              />
            </div>
          </div>
        </div>
      </form>
    </FormModal>
  );
};

export default ClassTransferModal;