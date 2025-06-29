import React, { useState } from 'react';
import FormModal from './FormModal';
import { Save, Clock, User, DollarSign } from 'lucide-react';

interface WorkHoursData {
  id?: string;
  employeeId: string;
  employeeName: string;
  month: string;
  hours: number;
  rate: number;
  totalAmount: number;
  // Additional fields for detailed tracking
  regularHours?: number;
  overtimeHours?: number;
  replacementHours?: number;
  supportHours?: number;
  absenceHours?: number;
  comments?: string;
}

interface Teacher {
  id: string;
  name: string;
}

interface WorkHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workHoursData: WorkHoursData) => void;
  workHoursData?: Partial<WorkHoursData>;
  isEdit?: boolean;
  teachers?: Teacher[];
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

  // Filter out default teachers with complete Teacher interface properties
  const allTeachers: Teacher[] = teachers?.length ? teachers : defaultTeachers.map(teacher => ({
    id: teacher.id,
    name: teacher.name
  }));

  const [formData, setFormData] = useState<Omit<WorkHoursData, 'totalAmount'>>({
    id: workHoursData?.id,
    employeeId: workHoursData?.employeeId || '',
    employeeName: workHoursData?.employeeName || '',
    month: workHoursData?.month || new Date().toISOString().split('-').slice(0, 2).join('-'),
    hours: workHoursData?.hours || 0,
    rate: workHoursData?.rate || 0,
    // Additional fields for detailed tracking
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
    // Calculate total hours
    const totalHours = (
      (formData.regularHours || 0) +
      (formData.overtimeHours || 0) +
      (formData.replacementHours || 0) +
      (formData.supportHours || 0)
    );
    
    // Get employee name
    const selectedTeacher = allTeachers.find(t => t.id === formData.employeeId);
    const employeeName = selectedTeacher?.name || formData.employeeName || 'Inconnu';
    
    // Prepare data for submission
    const submitData: WorkHoursData = {
      id: formData.id || `WH-${Date.now()}`,
      employeeId: formData.employeeId,
      employeeName,
      month: formData.month,
      hours: totalHours,
      rate: formData.rate || 25, // Default rate if not provided
      totalAmount: totalHours * (formData.rate || 25) // Calculate total amount
    };
    
    onSave(submitData);
    onClose();
  };

  // Calculer le total des heures
  const calculateTotalHours = () => {
    return (
      (formData.regularHours || 0) +
      (formData.overtimeHours || 0) +
      (formData.replacementHours || 0) +
      (formData.supportHours || 0) -
      (formData.absenceHours || 0)
    );
  };

  // We directly use rate calculations in the JSX for financial display
  
  // Format montant en F CFA
  const formatAmount = (amount: number | undefined): string => {
    return (amount || 0).toLocaleString('fr-FR');
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
              <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Enseignant*
              </label>
              <select
                id="employeeId"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                aria-label="Sélectionner un enseignant"
              >
                <option value="" disabled>Sélectionnez un enseignant</option>
                {allTeachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mois*
              </label>
              <div className="flex space-x-2">
                <div className="w-1/2">
                  <select
                    id="month-select"
                    name="month-select"
                    aria-label="Sélectionner le mois"
                    value={formData.month ? formData.month.split('-')[1] : ''}
                    onChange={(e) => {
                      const year = formData.month ? formData.month.split('-')[0] : new Date().getFullYear().toString();
                      setFormData({
                        ...formData,
                        month: `${year}-${e.target.value.padStart(2, '0')}`
                      });
                    }}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Mois</option>
                    <option value="01">Janvier</option>
                    <option value="02">Février</option>
                    <option value="03">Mars</option>
                    <option value="04">Avril</option>
                    <option value="05">Mai</option>
                    <option value="06">Juin</option>
                    <option value="07">Juillet</option>
                    <option value="08">Août</option>
                    <option value="09">Septembre</option>
                    <option value="10">Octobre</option>
                    <option value="11">Novembre</option>
                    <option value="12">Décembre</option>
                  </select>
                </div>
                <div className="w-1/2">
                  <select
                    id="year-select"
                    name="year-select"
                    aria-label="Sélectionner l'année"
                    value={formData.month ? formData.month.split('-')[0] : new Date().getFullYear().toString()}
                    onChange={(e) => {
                      const month = formData.month ? formData.month.split('-')[1] : '01';
                      setFormData({
                        ...formData,
                        month: `${e.target.value}-${month}`
                      });
                    }}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() - 2 + i;
                      return <option key={year} value={year}>{year}</option>;
                    })}
                  </select>
                </div>
                {/* Hidden input to maintain compatibility with existing code */}
                <input
                  type="hidden"
                  id="month"
                  name="month"
                  value={formData.month || ''}
                />
              </div>
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
                <span className="font-medium text-blue-900 dark:text-blue-200">{formData.regularHours || 0}h</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Heures supplémentaires:</span>
                <span className="font-medium text-blue-900 dark:text-blue-200">{formData.overtimeHours || 0}h</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Heures de remplacement:</span>
                <span className="font-medium text-blue-900 dark:text-blue-200">{formData.replacementHours || 0}h</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Heures de soutien:</span>
                <span className="font-medium text-blue-900 dark:text-blue-200">{formData.supportHours !== null ? formData.supportHours : 0}h</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Absences:</span>
                <span className="font-medium text-red-600 dark:text-red-400">-{formData.absenceHours !== null ? formData.absenceHours : 0}h</span>
              </div>
              
              <div className="pt-2 border-t border-blue-200 dark:border-blue-800 flex justify-between">
                <span className="font-semibold text-blue-800 dark:text-blue-300">Total des heures:</span>
                <span className="font-bold text-blue-900 dark:text-blue-200">{calculateTotalHours()}h</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Taux horaire:</span>
                <span className="font-medium text-blue-900 dark:text-blue-200">{formatAmount(formData.rate)} F CFA/h</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Montant heures régulières:</span>
                <span className="font-medium text-blue-900 dark:text-blue-200">{formatAmount((formData.regularHours || 0) * (formData.rate || 0))} F CFA</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Montant heures sup.:</span>
                <span className="font-medium text-blue-900 dark:text-blue-200">{formatAmount((formData.overtimeHours || 0) * (formData.rate || 0) * 1.25)} F CFA</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Montant remplacements:</span>
                <span className="font-medium text-blue-900 dark:text-blue-200">{formatAmount((formData.replacementHours || 0) * (formData.rate || 0) * 1.5)} F CFA</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300">Montant soutien:</span>
                <span className="font-medium text-blue-900 dark:text-blue-200">{formatAmount((formData.supportHours || 0) * (formData.rate || 0) * 1.1)} F CFA</span>
              </div>
              
              <div className="pt-2 border-t border-blue-200 dark:border-blue-800 flex justify-between">
                <span className="font-bold text-blue-800 dark:text-blue-300">Total à payer:</span>
                <span className="font-bold text-green-600 dark:text-green-400">{formatAmount(calculateTotalHours() * (formData.rate || 0))} F CFA</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormModal>
  );
};

export default WorkHoursModal;