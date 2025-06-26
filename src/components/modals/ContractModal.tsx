import React, { useState } from 'react';
import FormModal from './FormModal';
import { Save, FileText, User, Calendar, DollarSign, Download } from 'lucide-react';

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contractData: any) => void;
  contractData?: any;
  isEdit?: boolean;
  employees?: any[];
}

const ContractModal: React.FC<ContractModalProps> = ({
  isOpen,
  onClose,
  onSave,
  contractData,
  isEdit = false,
  employees = []
}) => {
  const defaultEmployees = [
    { id: 'PER-2024-00001', name: 'Marie Dubois', position: 'Professeur de Français' },
    { id: 'PER-2024-00002', name: 'Pierre Martin', position: 'Professeur de Mathématiques' },
    { id: 'PER-2024-00003', name: 'Sophie Laurent', position: 'Secrétaire administrative' }
  ];

  const allEmployees = employees.length > 0 ? employees : defaultEmployees;

  const [formData, setFormData] = useState({
    id: contractData?.id || `CONT-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    employeeId: contractData?.employeeId || '',
    employeeName: contractData?.employeeName || '',
    position: contractData?.position || '',
    contractType: contractData?.contractType || 'CDI',
    startDate: contractData?.startDate || new Date().toISOString().split('T')[0],
    endDate: contractData?.endDate || '',
    salary: contractData?.salary || 0,
    workingHours: contractData?.workingHours || '40h/semaine',
    probationPeriod: contractData?.probationPeriod || '3 mois',
    benefits: contractData?.benefits || '',
    specialClauses: contractData?.specialClauses || '',
    status: contractData?.status || 'active',
    renewalDate: contractData?.renewalDate || '',
    signatureDate: contractData?.signatureDate || new Date().toISOString().split('T')[0],
    notes: contractData?.notes || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value ? parseFloat(value) : 0) : value
    }));
  };

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const employeeId = e.target.value;
    const employee = allEmployees.find(emp => emp.id === employeeId);
    
    if (employee) {
      setFormData(prev => ({
        ...prev,
        employeeId,
        employeeName: employee.name,
        position: employee.position
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

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
      title={isEdit ? "Modifier un contrat" : "Nouveau contrat"}
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
            form="contract-form"
            className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {isEdit ? "Mettre à jour" : "Enregistrer"}
          </button>
        </div>
      }
    >
      <form id="contract-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Informations du contrat
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Employé*
              </label>
              <select
                id="employeeId"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleEmployeeChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Sélectionner un employé</option>
                {allEmployees.map(employee => (
                  <option key={employee.id} value={employee.id}>{employee.name} ({employee.position})</option>
                ))}
              </select>
            </div>
            
            {formData.employeeId && (
              <div className="md:col-span-2 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Employé:</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{formData.employeeName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Poste:</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{formData.position}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="contractType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type de contrat*
              </label>
              <select
                id="contractType"
                name="contractType"
                value={formData.contractType}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="Vacataire">Vacataire</option>
                <option value="Stage">Stage</option>
                <option value="Freelance">Freelance</option>
              </select>
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
                <option value="active">Actif</option>
                <option value="pending">En attente de signature</option>
                <option value="terminated">Terminé</option>
                <option value="suspended">Suspendu</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Dates et durée */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
            Dates et durée
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
                Date de fin {formData.contractType === 'CDI' ? '(optionnelle)' : '*'}
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required={formData.contractType !== 'CDI'}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="signatureDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date de signature*
              </label>
              <input
                type="date"
                id="signatureDate"
                name="signatureDate"
                value={formData.signatureDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="renewalDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date de renouvellement
              </label>
              <input
                type="date"
                id="renewalDate"
                name="renewalDate"
                value={formData.renewalDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="probationPeriod" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Période d'essai
              </label>
              <input
                type="text"
                id="probationPeriod"
                name="probationPeriod"
                value={formData.probationPeriod}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Ex: 3 mois"
              />
            </div>
          </div>
        </div>
        
        {/* Conditions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-400" />
            Conditions et rémunération
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Salaire (F CFA)*
              </label>
              <input
                type="number"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="workingHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Horaires de travail*
              </label>
              <input
                type="text"
                id="workingHours"
                name="workingHours"
                value={formData.workingHours}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Ex: 40h/semaine"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Avantages
              </label>
              <textarea
                id="benefits"
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Avantages, primes, etc."
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="specialClauses" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Clauses particulières
              </label>
              <textarea
                id="specialClauses"
                name="specialClauses"
                value={formData.specialClauses}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Clauses spécifiques, obligations particulières, etc."
              />
            </div>
          </div>
        </div>
        
        {/* Notes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
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
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-900/30">
          <h4 className="text-lg font-medium text-green-900 dark:text-green-300 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Récapitulatif du contrat
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-green-800 dark:text-green-300">Employé:</span>
                <span className="font-bold text-green-900 dark:text-green-200">
                  {formData.employeeName || 'Non sélectionné'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-green-800 dark:text-green-300">Type de contrat:</span>
                <span className="font-medium text-green-900 dark:text-green-200">{formData.contractType}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-green-800 dark:text-green-300">Dates:</span>
                <span className="font-medium text-green-900 dark:text-green-200">
                  {formData.startDate} {formData.endDate ? `au ${formData.endDate}` : '(sans fin)'}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-green-800 dark:text-green-300">Salaire:</span>
                <span className="font-medium text-green-900 dark:text-green-200">
                  {formatAmount(formData.salary)} F CFA
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-green-800 dark:text-green-300">Horaires:</span>
                <span className="font-medium text-green-900 dark:text-green-200">{formData.workingHours}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-green-800 dark:text-green-300">Statut:</span>
                <span className="font-medium text-green-900 dark:text-green-200">
                  {formData.status === 'active' ? 'Actif' : 
                   formData.status === 'pending' ? 'En attente' : 
                   formData.status === 'terminated' ? 'Terminé' : 'Suspendu'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Aperçu du contrat
            </button>
          </div>
        </div>
      </form>
    </FormModal>
  );
};

export default ContractModal;