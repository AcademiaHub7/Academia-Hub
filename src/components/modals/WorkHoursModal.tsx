import React, { useState } from 'react';
import FormModal from './FormModal';
import { Save, Clock, User, Calendar, DollarSign } from 'lucide-react';

interface WorkHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workHoursData: any) => void;
  workHoursData?: any;
  isEdit?: boolean;
  teachers?: any[];
}

const WorkHoursModal: React.FC<WorkHoursModalProps> = ({
  isOpen,
  onClose,
  onSave,
  workHoursData,
  isEdit = false,
  teachers = []
}) => {
  const defaultTeachers = [
    { id: 'TCH-001', name: 'M. Dubois', subject: 'Mathématiques' },
    { id: 'TCH-002', name: 'Mme Martin', subject: 'Français' },
    { id: 'TCH-003', name: 'M. Laurent', subject: 'Histoire-Géographie' }
  ];

  const allTeachers = teachers.length > 0 ? teachers : defaultTeachers;

  const [formData, setFormData] = useState({
    teacherId: workHoursData?.teacherId || '',
    month: workHoursData?.month || new Date().toISOString().split('-').slice(0, 2).join('-'),
    regularHours: workHoursData?.regularHours || 0,
    overtimeHours: workHoursData?.overtimeHours || 0,
    replacementHours: workHoursData?.replacementHours || 0,
    supportHours: workHoursData?.supportHours || 0,
    absenceHours: workHoursData?.absenceHours || 0,
    comments: workHoursData?.comments || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  // Calculer le total des heures
  const calculateTotalHours = () => {
    return (
      formData.regularHours +
      formData.overtimeHours +
      formData.replacementHours +
      formData.supportHours -
      formData.absenceHours
    );
  };

  // Calculer l'impact financier (simulation)
  const calculateFinancialImpact = () => {
    const baseHourlyRate = 2500; // Taux horaire de base en F CFA
    const overtimeRate = 1.25; // Majoration des heures supplémentaires
    const replacementRate = 1.5; // Majoration des heures de remplacement
    const supportRate = 1.1; // Majoration des heures de soutien
    
    const regularAmount = formData.regularHours * baseHourlyRate;
    const overtimeAmount = formData.overtimeHours * baseHourlyRate * overtimeRate;
    const replacementAmount = formData.replacementHours * baseHourlyRate * replacementRate;
    const supportAmount = formData.supportHours * baseHourlyRate * supportRate;
    const absenceDeduction = formData.absenceHours * baseHourlyRate;
    
    return {
      regularAmount,
      overtimeAmount,
      replacementAmount,
      supportAmount,
      absenceDeduction,
      totalAmount: regularAmount + overtimeAmount + replacementAmount + supportAmount - absenceDeduction
    };
  };

  const financialImpact = calculateFinancialImpact();

  // Formatage des montants en F CFA
  const formatAmount = (amount: number): string => {
    return amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Modifier les heures de travail" : "Saisie des heures de travail"}
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
            form="work-hours-form"
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {isEdit ? "Mettre à jour" : "Enregistrer"}
          </button>
        </div>
      }
    >
      <form id="work-hours-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Enseignant et période
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
              <label htmlFor="month" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mois*
              </label>
              <input
                type="month"
                id="month"
                name="month"
                value={formData.month}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>
        
        {/* Heures de travail */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
            Heures de travail
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="regularHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Heures normales*
              </label>
              <input
                type="number"
                id="regularHours"
                name="regularHours"
                value={formData.regularHours}
                onChange={handleChange}
                required
                min="0"
                step="0.5"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="overtimeHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Heures supplémentaires
              </label>
              <input
                type="number"
                id="overtimeHours"
                name="overtimeHours"
                value={formData.overtimeHours}
                onChange={handleChange}
                min="0"
                step="0.5"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="replacementHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Heures de remplacement
              </label>
              <input
                type="number"
                id="replacementHours"
                name="replacementHours"
                value={formData.replacementHours}
                onChange={handleChange}
                min="0"
                step="0.5"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="supportHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Heures de soutien
              </label>
              <input
                type="number"
                id="supportHours"
                name="supportHours"
                value={formData.supportHours}
                onChange={handleChange}
                min="0"
                step="0.5"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="absenceHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Heures d'absence
              </label>
              <input
                type="number"
                id="absenceHours"
                name="absenceHours"
                value={formData.absenceHours}
                onChange={handleChange}
                min="0"
                step="0.5"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
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
                placeholder="Commentaires ou précisions..."
              />
            </div>
          </div>
        </div>
        
        {/* Récapitulatif */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-900/30">
          <h4 className="text-lg font-medium text-blue-900 dark:text-blue-300 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Récapitulatif et impact financier
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Heures normales:</span>
                <span className="font-medium text-blue-900 dark:text-blue-200">{formData.regularHours}h</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Heures supplémentaires:</span>
                <span className="font-medium text-blue-900 dark:text-blue-200">{formData.overtimeHours}h</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Heures de remplacement:</span>
                <span className="font-medium text-blue-900 dark:text-blue-200">{formData.replacementHours}h</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Heures de soutien:</span>
                <span className="font-medium text-blue-900 dark:text-blue-200">{formData.supportHours}h</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Heures d'absence:</span>
                <span className="font-medium text-red-600 dark:text-red-400">-{formData.absenceHours}h</span>
              </div>
              
              <div className="pt-2 border-t border-blue-200 dark:border-blue-800 flex justify-between">
                <span className="font-semibold text-blue-800 dark:text-blue-300">Total des heures:</span>
                <span className="font-bold text-blue-900 dark:text-blue-200">{calculateTotalHours()}h</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Montant heures normales:</span>
                <span className="font-medium text-blue-900 dark:text-blue-200">{formatAmount(financialImpact.regularAmount)} F CFA</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Montant heures sup.:</span>
                <span className="font-medium text-blue-900 dark:text-blue-200">{formatAmount(financialImpact.overtimeAmount)} F CFA</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Montant remplacements:</span>
                <span className="font-medium text-blue-900 dark:text-blue-200">{formatAmount(financialImpact.replacementAmount)} F CFA</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Montant soutien:</span>
                <span className="font-medium text-blue-900 dark:text-blue-200">{formatAmount(financialImpact.supportAmount)} F CFA</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Déduction absences:</span>
                <span className="font-medium text-red-600 dark:text-red-400">-{formatAmount(financialImpact.absenceDeduction)} F CFA</span>
              </div>
              
              <div className="pt-2 border-t border-blue-200 dark:border-blue-800 flex justify-between">
                <span className="font-semibold text-blue-800 dark:text-blue-300">Impact financier total:</span>
                <span className="font-bold text-lg text-blue-900 dark:text-blue-200">{formatAmount(financialImpact.totalAmount)} F CFA</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormModal>
  );
};

export default WorkHoursModal;