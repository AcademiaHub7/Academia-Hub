import React, { useState } from 'react';
import FormModal from './FormModal';
import { FileText, Download, Calendar, Filter, BarChart3, PieChart, DollarSign } from 'lucide-react';

interface PayrollReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (reportOptions: any) => void;
}

const PayrollReportModal: React.FC<PayrollReportModalProps> = ({
  isOpen,
  onClose,
  onGenerate
}) => {
  const [formData, setFormData] = useState({
    reportType: 'payroll_journal',
    period: 'month',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    employeeTypes: ['permanent', 'vacataire'],
    departments: [],
    includeDetails: true,
    includeSummary: true,
    format: 'pdf'
  });

  // Données fictives pour les départements
  const departmentOptions = [
    { id: 'admin', name: 'Administration' },
    { id: 'teaching', name: 'Enseignement' },
    { id: 'support', name: 'Services de soutien' },
    { id: 'maintenance', name: 'Maintenance' }
  ];

  // Types de rapports disponibles
  const reportTypes = [
    { id: 'payroll_journal', name: 'Journal de paie' },
    { id: 'cnss_declaration', name: 'Déclaration CNSS' },
    { id: 'irpp_declaration', name: 'Déclaration IRPP' },
    { id: 'employee_summary', name: 'Récapitulatif par employé' },
    { id: 'department_summary', name: 'Récapitulatif par département' },
    { id: 'annual_summary', name: 'Récapitulatif annuel' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'departments') {
      // Gestion des sélections multiples pour les départements
      const select = e.target as HTMLSelectElement;
      const selectedOptions = Array.from(select.selectedOptions).map(option => option.value);
      setFormData(prev => ({
        ...prev,
        departments: selectedOptions
      }));
    } else if (name === 'employeeTypes') {
      // Gestion des cases à cocher pour les types d'employés
      const employeeType = value;
      setFormData(prev => ({
        ...prev,
        employeeTypes: checked 
          ? [...prev.employeeTypes, employeeType]
          : prev.employeeTypes.filter(type => type !== employeeType)
      }));
    } else {
      // Gestion des autres champs
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Mise à jour de la période en fonction du type de rapport
  React.useEffect(() => {
    if (formData.reportType === 'annual_summary') {
      setFormData(prev => ({
        ...prev,
        period: 'year'
      }));
    } else if (formData.reportType === 'cnss_declaration') {
      setFormData(prev => ({
        ...prev,
        period: 'month'
      }));
    }
  }, [formData.reportType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
    onClose();
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Générer un rapport de paie"
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
            form="payroll-report-form"
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Générer le rapport
          </button>
        </div>
      }
    >
      <form id="payroll-report-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Type de rapport */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Type de rapport
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sélectionner un rapport*
              </label>
              <select
                id="reportType"
                name="reportType"
                value={formData.reportType}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {reportTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="format" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Format de sortie*
              </label>
              <select
                id="format"
                name="format"
                value={formData.format}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h5 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Description du rapport</h5>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                {formData.reportType === 'payroll_journal' && "Le journal de paie détaille toutes les transactions de paie pour la période sélectionnée, incluant les salaires bruts, les déductions et les salaires nets."}
                {formData.reportType === 'cnss_declaration' && "La déclaration CNSS est un document officiel à soumettre à la Caisse Nationale de Sécurité Sociale, détaillant les cotisations sociales pour chaque employé."}
                {formData.reportType === 'irpp_declaration' && "La déclaration IRPP (Impôt sur le Revenu des Personnes Physiques) est un document fiscal à soumettre à la Direction Générale des Impôts."}
                {formData.reportType === 'employee_summary' && "Le récapitulatif par employé présente un résumé des paiements et déductions pour chaque employé sur la période sélectionnée."}
                {formData.reportType === 'department_summary' && "Le récapitulatif par département présente les coûts salariaux agrégés par département pour la période sélectionnée."}
                {formData.reportType === 'annual_summary' && "Le récapitulatif annuel fournit une vue d'ensemble des coûts salariaux pour l'année entière, avec des analyses de tendances."}
              </p>
            </div>
          </div>
        </div>
        
        {/* Période */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
            Période du rapport
          </h4>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="period" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type de période*
              </label>
              <select
                id="period"
                name="period"
                value={formData.period}
                onChange={handleChange}
                required
                disabled={formData.reportType === 'annual_summary' || formData.reportType === 'cnss_declaration'}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400"
              >
                <option value="month">Mensuelle</option>
                <option value="quarter">Trimestrielle</option>
                <option value="year">Annuelle</option>
                <option value="custom">Personnalisée</option>
              </select>
            </div>
            
            {formData.period === 'custom' ? (
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
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {formData.period === 'month' && "Le rapport couvrira le mois en cours."}
                  {formData.period === 'quarter' && "Le rapport couvrira le trimestre en cours."}
                  {formData.period === 'year' && "Le rapport couvrira l'année civile en cours."}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Filtres */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Filter className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
            Filtres
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Types d'employés à inclure*
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="employeeTypes-permanent"
                    name="employeeTypes"
                    value="permanent"
                    checked={formData.employeeTypes.includes('permanent')}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <label htmlFor="employeeTypes-permanent" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Personnel permanent (CDI, CDD)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="employeeTypes-vacataire"
                    name="employeeTypes"
                    value="vacataire"
                    checked={formData.employeeTypes.includes('vacataire')}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <label htmlFor="employeeTypes-vacataire" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Personnel vacataire et contractuel
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="departments" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Départements (laisser vide pour tous)
              </label>
              <select
                id="departments"
                name="departments"
                multiple
                value={formData.departments}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                size={4}
              >
                {departmentOptions.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Maintenez Ctrl (ou Cmd) pour sélectionner plusieurs départements
              </p>
            </div>
          </div>
        </div>
        
        {/* Options */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400" />
            Options du rapport
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeDetails"
                name="includeDetails"
                checked={formData.includeDetails}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <label htmlFor="includeDetails" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Inclure les détails par employé
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeSummary"
                name="includeSummary"
                checked={formData.includeSummary}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <label htmlFor="includeSummary" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Inclure le résumé et les totaux
              </label>
            </div>
          </div>
        </div>
        
        {/* Aperçu */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-900/30">
          <h4 className="text-lg font-medium text-blue-900 dark:text-blue-300 mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2" />
            Aperçu du rapport
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h5 className="font-medium text-blue-900 dark:text-blue-300 mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                {reportTypes.find(type => type.id === formData.reportType)?.name}
              </h5>
              <p className="text-sm text-blue-800 dark:text-blue-400">
                {formData.period === 'month' && "Période: Mensuelle"}
                {formData.period === 'quarter' && "Période: Trimestrielle"}
                {formData.period === 'year' && "Période: Annuelle"}
                {formData.period === 'custom' && `Période: Du ${formData.startDate} au ${formData.endDate}`}
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-400 mt-1">
                Format: {formData.format.toUpperCase()}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h5 className="font-medium text-blue-900 dark:text-blue-300 mb-2 flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Contenu
              </h5>
              <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                <li>• Types d'employés: {formData.employeeTypes.includes('permanent') && 'Permanents'} {formData.employeeTypes.includes('vacataire') && 'Vacataires'}</li>
                <li>• Départements: {formData.departments.length > 0 ? formData.departments.length + ' sélectionnés' : 'Tous'}</li>
                <li>• Détails: {formData.includeDetails ? 'Inclus' : 'Non inclus'}</li>
                <li>• Résumé: {formData.includeSummary ? 'Inclus' : 'Non inclus'}</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </FormModal>
  );
};

export default PayrollReportModal;