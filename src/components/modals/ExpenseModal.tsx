import React, { useState } from 'react';
import FormModal from './FormModal';
import { Receipt, Save, Calendar, Building, User, Upload } from 'lucide-react';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expenseData: any) => void;
  expenseData?: any;
  isEdit?: boolean;
  categories?: any[];
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  expenseData,
  isEdit = false,
  categories = []
}) => {
  const defaultCategories = [
    { id: 'personnel', name: 'Personnel' },
    { id: 'materiel', name: 'Matériel' },
    { id: 'maintenance', name: 'Maintenance' },
    { id: 'services', name: 'Services' },
    { id: 'transport', name: 'Transport' },
    { id: 'utilities', name: 'Charges (eau, électricité)' },
    { id: 'other', name: 'Autres' }
  ];

  const allCategories = categories.length > 0 ? categories : defaultCategories;

  const [formData, setFormData] = useState({
    category: expenseData?.category || '',
    description: expenseData?.description || '',
    amount: expenseData?.amount || 0,
    expenseDate: expenseData?.expenseDate || new Date().toISOString().split('T')[0],
    reference: expenseData?.reference || '',
    receiptUrl: expenseData?.receiptUrl || '',
    notes: expenseData?.notes || '',
    hasReceipt: expenseData?.hasReceipt || false,
    approvalRequired: expenseData?.approvalRequired || false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real implementation, you would upload the file to a server
      // and get back a URL to store in the form data
      console.log('File selected:', file.name);
      setFormData(prev => ({
        ...prev,
        hasReceipt: true,
        receiptUrl: URL.createObjectURL(file) // This is just for preview, not for production
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
      title={isEdit ? "Modifier une dépense" : "Nouvelle dépense"}
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
            form="expense-form"
            className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {isEdit ? "Mettre à jour" : "Enregistrer"}
          </button>
        </div>
      }
    >
      <form id="expense-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Receipt className="w-5 h-5 mr-2 text-red-600 dark:text-red-400" />
            Informations de la dépense
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {allCategories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="expenseDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date de la dépense*
              </label>
              <input
                type="date"
                id="expenseDate"
                name="expenseDate"
                value={formData.expenseDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description*
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Description de la dépense"
              />
            </div>
            
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Montant (F CFA)*
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                step="100"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="reference" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Référence
              </label>
              <input
                type="text"
                id="reference"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Numéro de facture, référence, etc."
              />
            </div>
          </div>
        </div>
        
        {/* Justificatif */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Upload className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Justificatif
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="hasReceipt"
                name="hasReceipt"
                checked={formData.hasReceipt}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <label htmlFor="hasReceipt" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Cette dépense a un justificatif
              </label>
            </div>
            
            {formData.hasReceipt && (
              <div>
                <label htmlFor="receiptFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Télécharger le justificatif
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    id="receiptFile"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="receiptFile"
                    className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 cursor-pointer flex items-center"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choisir un fichier
                  </label>
                  {formData.receiptUrl && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Justificatif ajouté
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  Formats acceptés: JPG, PNG, PDF. Taille max: 5 MB
                </p>
              </div>
            )}
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="approvalRequired"
                name="approvalRequired"
                checked={formData.approvalRequired}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <label htmlFor="approvalRequired" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Nécessite une approbation
              </label>
            </div>
          </div>
        </div>
        
        {/* Notes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
            Notes et informations complémentaires
          </h4>
          
          <div>
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
        
        {/* Récapitulatif */}
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-900/30">
          <h4 className="text-lg font-medium text-red-900 dark:text-red-300 mb-4 flex items-center">
            <Receipt className="w-5 h-5 mr-2" />
            Récapitulatif de la dépense
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-red-800 dark:text-red-300">Catégorie:</span>
                <span className="font-bold text-red-900 dark:text-red-200">
                  {formData.category ? allCategories.find(c => c.id === formData.category)?.name : 'Non sélectionnée'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-red-800 dark:text-red-300">Description:</span>
                <span className="font-medium text-red-900 dark:text-red-200">{formData.description || 'Non renseignée'}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-red-800 dark:text-red-300">Date:</span>
                <span className="font-medium text-red-900 dark:text-red-200">{formData.expenseDate}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-red-800 dark:text-red-300">Montant:</span>
                <span className="font-bold text-lg text-red-900 dark:text-red-200">
                  {formatAmount(formData.amount)} F CFA
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-red-800 dark:text-red-300">Justificatif:</span>
                <span className="font-medium text-red-900 dark:text-red-200">
                  {formData.hasReceipt ? 'Oui' : 'Non'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-red-800 dark:text-red-300">Approbation requise:</span>
                <span className="font-medium text-red-900 dark:text-red-200">
                  {formData.approvalRequired ? 'Oui' : 'Non'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormModal>
  );
};

export default ExpenseModal;