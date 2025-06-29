import React, { useState, useRef, ChangeEvent } from 'react';
import FormModal from './FormModal';
import { FileText, Save, Upload, Download, Code, Eye, Trash2, Plus, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface DocumentType {
  id: string;
  name: string;
  category: string;
}

interface TemplateVariable {
  name: string;
  description: string;
  type: 'text' | 'number' | 'date' | 'image' | 'html';
  source: 'school' | 'document' | 'user' | 'student' | 'system';
}

interface TemplateZone {
  id: string;
  name: string;
  type: string;
  content: string;
  position: string;
}

interface TemplateData {
  name: string;
  description: string;
  documentType: string;
  htmlTemplate: string;
  cssStyles: string;
  zones: TemplateZone[];
  variables: TemplateVariable[];
  isDefault: boolean;
  isActive: boolean;
}

interface DocumentTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (templateData: TemplateData) => void;
  templateData?: Partial<TemplateData>;
  isEdit?: boolean;
  documentTypes?: DocumentType[];
}

const DocumentTemplateModal: React.FC<DocumentTemplateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  templateData,
  isEdit = false,
  documentTypes = []
}) => {
  const defaultDocumentTypes = [
    { id: 'invoice', name: 'Facture', category: 'boutique' },
    { id: 'receipt', name: 'Reçu', category: 'boutique' },
    { id: 'delivery_note', name: 'Bon de livraison', category: 'boutique' },
    { id: 'report_card', name: 'Bulletin de notes', category: 'academique' },
    { id: 'certificate', name: 'Certificat', category: 'academique' },
    { id: 'diploma', name: 'Diplôme', category: 'academique' },
    { id: 'letter', name: 'Courrier', category: 'administratif' },
    { id: 'convocation', name: 'Convocation', category: 'administratif' },
    { id: 'payment_reminder', name: 'Rappel de paiement', category: 'financier' },
    { id: 'statistics', name: 'Statistiques', category: 'rapports' }
  ];

  const [documentTypesState] = useState<DocumentType[]>(documentTypes || defaultDocumentTypes);
  const allDocumentTypes = documentTypesState;

  const [formData, setFormData] = useState<TemplateData>({
    name: templateData?.name || '',
    description: templateData?.description || '',
    documentType: templateData?.documentType || '',
    htmlTemplate: templateData?.htmlTemplate || '<div class="document">\n  <header class="header">\n    <!-- En-tête du document -->\n    <div class="logo">{logo_ecole}</div>\n    <div class="school-info">\n      <h1>{nom_ecole}</h1>\n      <p>{adresse_ecole}</p>\n      <p>{telephone_ecole}</p>\n    </div>\n    <div class="document-info">\n      <p>Référence: {numero_document}</p>\n      <p>Date: {date_document}</p>\n    </div>\n  </header>\n\n  <main class="body">\n    <!-- Corps du document -->\n    <h2>{titre_document}</h2>\n    <div class="content">\n      <!-- Contenu spécifique au type de document -->\n    </div>\n  </main>\n\n  <footer class="footer">\n    <!-- Pied de page du document -->\n    <div class="signature">{signature}</div>\n    <div class="legal">{mentions_legales}</div>\n    <div class="page-number">Page {page_number} sur {total_pages}</div>\n  </footer>\n</div>',
    cssStyles: templateData?.cssStyles || '.document {\n  font-family: Arial, sans-serif;\n  max-width: 210mm; /* A4 width */\n  margin: 0 auto;\n  padding: 20mm;\n}\n\n.header {\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 20mm;\n  border-bottom: 1px solid #ccc;\n  padding-bottom: 5mm;\n}\n\n.logo {\n  max-width: 30mm;\n  height: auto;\n}\n\n.school-info h1 {\n  font-size: 18pt;\n  margin-bottom: 5mm;\n}\n\n.body {\n  min-height: 100mm;\n}\n\n.footer {\n  margin-top: 20mm;\n  border-top: 1px solid #ccc;\n  padding-top: 5mm;\n  display: flex;\n  justify-content: space-between;\n}\n',
    zones: templateData?.zones || [
      { id: 'header', name: 'En-tête', type: 'header', content: '', position: 'top' },
      { id: 'body', name: 'Corps', type: 'body', content: '', position: 'middle' },
      { id: 'footer', name: 'Pied de page', type: 'footer', content: '', position: 'bottom' }
    ],
    variables: templateData?.variables || [
      { name: 'nom_ecole', description: 'Nom de l\'école', type: 'text', source: 'school' },
      { name: 'adresse_ecole', description: 'Adresse de l\'école', type: 'text', source: 'school' },
      { name: 'telephone_ecole', description: 'Téléphone de l\'école', type: 'text', source: 'school' },
      { name: 'logo_ecole', description: 'Logo de l\'école', type: 'image', source: 'school' },
      { name: 'numero_document', description: 'Numéro du document', type: 'text', source: 'document' },
      { name: 'date_document', description: 'Date du document', type: 'date', source: 'document' },
      { name: 'titre_document', description: 'Titre du document', type: 'text', source: 'document' },
      { name: 'signature', description: 'Signature', type: 'image', source: 'user' },
      { name: 'mentions_legales', description: 'Mentions légales', type: 'text', source: 'school' },
      { name: 'page_number', description: 'Numéro de page', type: 'number', source: 'system' },
      { name: 'total_pages', description: 'Nombre total de pages', type: 'number', source: 'system' }
    ],
    isDefault: templateData?.isDefault || false,
    isActive: templateData?.isActive !== undefined ? templateData.isActive : true
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  type ActiveTab = 'general' | 'content' | 'zones' | 'variables' | 'preview' | 'html' | 'css';
  const [activeTab, setActiveTab] = useState<ActiveTab>('general');

  const [newVariable, setNewVariable] = useState<{
    name: string;
    description: string;
    type: 'text' | 'number' | 'date' | 'image' | 'html';
    source: 'school' | 'document' | 'user' | 'student' | 'system';
  }>({
    name: '',
    description: '',
    type: 'text',
    source: 'document',
  });

  const htmlEditorRef = useRef<HTMLTextAreaElement>(null);
  const cssEditorRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const { name, value, type } = target;
    
    setFormData(prev => {
      // Handle checkbox inputs
      if (type === 'checkbox' && 'checked' in target) {
        return {
          ...prev,
          [name]: (target as HTMLInputElement).checked
        };
      }
      
      // Handle other input types
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleZoneChange = (index: number, field: keyof TemplateZone, value: string): void => {
    setFormData(prev => {
      const newZones = [...prev.zones];
      newZones[index] = { ...newZones[index], [field]: value };
      return { ...prev, zones: newZones };
    });
  };

  const handleAddVariable = (): void => {
    if (newVariable.name && newVariable.description) {
      setFormData(prev => ({
        ...prev,
        variables: [...prev.variables, { 
          ...newVariable,
          type: newVariable.type as 'text' | 'number' | 'date' | 'image' | 'html',
          source: newVariable.source as 'school' | 'document' | 'user' | 'student' | 'system'
        }]
      }));
      setNewVariable({ name: '', description: '', type: 'text', source: 'document' });
    }
  };

  const handleVariableTypeChange = (index: number, value: string) => {
    const newVariables = [...formData.variables];
    newVariables[index].type = value as 'text' | 'number' | 'date' | 'image' | 'html';
    setFormData(prev => ({
      ...prev,
      variables: newVariables
    }));
  };

  const handleVariableSourceChange = (index: number, value: string) => {
    const newVariables = [...formData.variables];
    newVariables[index].source = value as 'school' | 'document' | 'user' | 'student' | 'system';
    setFormData(prev => ({
      ...prev,
      variables: newVariables
    }));
  };

  const handleRemoveVariable = (index: number): void => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.filter((_, i) => i !== index)
    }));
  };

  // Overload the function to handle both one and two arguments
  function insertVariable(variableName: string): void;
  function insertVariable(variableName: string, target: 'html' | 'css'): void;
  function insertVariable(variableName: string, target: 'html' | 'css' = 'html'): void {
    const ref = target === 'html' ? htmlEditorRef : cssEditorRef;
    const currentValue = target === 'html' ? formData.htmlTemplate : formData.cssStyles;
    
    if (ref.current) {
      const cursorPos = ref.current.selectionStart;
      const textBefore = currentValue.substring(0, cursorPos);
      const textAfter = currentValue.substring(cursorPos);
      const variableSyntax = target === 'html' ? `{${variableName}}` : `var(--${variableName})`;
      
      const update = {
        ...formData,
        [target === 'html' ? 'htmlTemplate' : 'cssStyles']: `${textBefore}${variableSyntax}${textAfter}`
      };
      
      setFormData(update);
      
      // Set focus back to the textarea
      setTimeout(() => {
        if (ref.current) {
          const newCursorPos = cursorPos + variableSyntax.length;
          ref.current.focus();
          ref.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Le nom du template est requis';
    }
    
    if (!formData.documentType) {
      errors.documentType = 'Veuillez sélectionner un type de document';
    }
    
    if (!formData.htmlTemplate.trim()) {
      errors.htmlTemplate = 'Le modèle HTML est requis';
    }
    
    // Validate variable names (must be alphanumeric with underscores)
    const variableNameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    formData.variables.forEach((variable, index) => {
      if (!variableNameRegex.test(variable.name)) {
        errors[`variable-${index}-name`] = 'Le nom de la variable ne peut contenir que des lettres, des chiffres et des underscores';
      }
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstError = Object.keys(formErrors)[0];
      if (firstError) {
        const element = document.getElementById(firstError);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus({ preventScroll: true });
        }
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave(formData);
      
      // Show success message
      toast.success(
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          <span>Template {isEdit ? 'mis à jour' : 'créé'} avec succès</span>
        </div>,
        { duration: 3000 }
      );
      
      onClose();
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error(
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span>Une erreur est survenue lors de la sauvegarde du template</span>
        </div>,
        { duration: 5000 }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Modifier un template de document" : "Créer un template de document"}
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
            form="document-template-form"
            disabled={isSubmitting}
            className={`px-4 py-2 ${
              isSubmitting 
                ? 'bg-blue-400 dark:bg-blue-600 cursor-not-allowed' 
                : 'bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800'
            } text-white rounded-lg flex items-center`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEdit ? "Mettre à jour" : "Enregistrer"}
              </>
            )}
          </button>
        </div>
      }
    >
      <form 
        id="document-template-form" 
        ref={formRef}
        onSubmit={handleSubmit} 
        className="space-y-6"
        noValidate
      >
        {/* Informations de base */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Informations du template
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom du template*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                aria-required="true"
                aria-describedby={formErrors.name ? 'name-error' : undefined}
                required
                className={`w-full px-3 py-2 border ${
                  formErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                placeholder="Ex: Facture standard"
              />
              {formErrors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {formErrors.name}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type de document*
              </label>
              <select
                id="documentType"
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Sélectionner un type</option>
                {formErrors.documentType && (
                  <p id="documentType-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {formErrors.documentType}
                  </p>
                )}
                {allDocumentTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name} ({type.category})</option>
                ))}
              </select>
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
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Description du template..."
              />
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Définir comme template par défaut
                </span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Template actif
                </span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Éditeur de template */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
              <Code className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
              Éditeur de template
            </h4>
            
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 flex items-center"
              >
                <Eye className="w-4 h-4 mr-1" />
                {previewMode ? "Éditer" : "Prévisualiser"}
              </button>
              
              <button
                type="button"
                className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm hover:bg-green-200 dark:hover:bg-green-900/50 flex items-center"
              >
                <Download className="w-4 h-4 mr-1" />
                Exporter
              </button>
              
              <button
                type="button"
                className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50 flex items-center"
              >
                <Upload className="w-4 h-4 mr-1" />
                Importer
              </button>
            </div>
          </div>
          
          {previewMode ? (
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-900 min-h-[400px] overflow-auto">
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: `<style>${formData.cssStyles}</style>${formData.htmlTemplate}` 
                }}
                className="preview-container"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('general')}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'general'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Général
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('html')}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'html' || activeTab === 'css'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Contenu
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('zones')}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'zones'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Zones
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('variables')}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'variables'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Variables
                </button>
              </div>
              
              {/* Content sub-tabs */}
              {(activeTab === 'html' || activeTab === 'css') && (
                <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700 mb-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('html')}
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === 'html'
                        ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    HTML
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('css')}
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === 'css'
                        ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    CSS
                  </button>
                </div>
              )}
              
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nom du template*
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        aria-required="true"
                        aria-describedby={formErrors.name ? 'name-error' : undefined}
                        required
                        className={`w-full px-3 py-2 border ${
                          formErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                        placeholder="Ex: Facture standard"
                      />
                      {formErrors.name && (
                        <p id="name-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {formErrors.name}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Type de document*
                      </label>
                      <select
                        id="documentType"
                        name="documentType"
                        value={formData.documentType}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="">Sélectionner un type</option>
                        {documentTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
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
                        placeholder="Description du template"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isDefault"
                        name="isDefault"
                        checked={formData.isDefault}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                      />
                      <label htmlFor="isDefault" className="text-sm text-gray-700 dark:text-gray-300">
                        Définir comme template par défaut
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                      />
                      <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">
                        Actif
                      </label>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'html' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.variables.map((variable, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => insertVariable(variable.name)}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-900/50"
                      >
                        {variable.name}
                      </button>
                    ))}
                  </div>
                  
                  <label htmlFor="htmlTemplate" className="sr-only">Modèle HTML</label>
                  <div>
                    <textarea
                      id="htmlTemplate"
                      ref={htmlEditorRef}
                      name="htmlTemplate"
                      value={formData.htmlTemplate}
                      onChange={handleChange}
                      aria-label="Modèle HTML"
                      aria-required="true"
                      rows={15}
                      className={`w-full px-3 py-2 border ${
                        formErrors.htmlTemplate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono`}
                      aria-describedby={formErrors.htmlTemplate ? 'htmlTemplate-error' : undefined}
                    />
                    {formErrors.htmlTemplate && (
                      <p id="htmlTemplate-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {formErrors.htmlTemplate}
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'css' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.variables.map((variable, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => insertVariable(variable.name, 'css' as const)}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-900/50"
                      >
                        {variable.name}
                      </button>
                    ))}
                  </div>
                  <label htmlFor="cssStyles" className="sr-only">Styles CSS</label>
                  <div>
                    <textarea
                      id="cssStyles"
                      ref={cssEditorRef}
                      name="cssStyles"
                      value={formData.cssStyles}
                      onChange={handleChange}
                      rows={15}
                      aria-label="Styles CSS"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono"
                      aria-describedby={formErrors.cssStyles ? 'cssStyles-error' : undefined}
                    />
                    {formErrors.cssStyles && (
                      <p id="cssStyles-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {formErrors.cssStyles}
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'variables' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-5 gap-4 mb-2 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
                    <div className="col-span-1 font-medium text-gray-700 dark:text-gray-300 text-sm">Nom</div>
                    <div className="col-span-2 font-medium text-gray-700 dark:text-gray-300 text-sm">Description</div>
                    <div className="col-span-1 font-medium text-gray-700 dark:text-gray-300 text-sm">Type</div>
                    <div className="col-span-1 font-medium text-gray-700 dark:text-gray-300 text-sm">Source</div>
                  </div>
                  
                  {formData.variables.map((variable, index) => (
                    <div key={index} className="grid grid-cols-5 gap-4 items-center">
                      <div className="col-span-1">
                        <label htmlFor={`variable-name-${index}`} className="sr-only">Nom de la variable</label>
                        <div>
                          <input
                            type="text"
                            id={`variable-name-${index}`}
                            aria-label={`Nom de la variable ${index + 1}`}
                            aria-required="true"
                            aria-describedby={formErrors[`variable-${index}-name`] ? `variable-${index}-name-error` : undefined}
                            value={variable.name}
                            onChange={(e) => {
                              const newVariables = [...formData.variables];
                              newVariables[index] = {
                                ...newVariables[index],
                                name: e.target.value
                              };
                              setFormData({...formData, variables: newVariables});
                              
                              // Clear error when user starts typing
                              if (formErrors[`variable-${index}-name`]) {
                                const newErrors = {...formErrors};
                                delete newErrors[`variable-${index}-name`];
                                setFormErrors(newErrors);
                              }
                            }}
                            className={`w-full px-3 py-2 border ${
                              formErrors[`variable-${index}-name`] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                          />
                          {formErrors[`variable-${index}-name`] && (
                            <p id={`variable-${index}-name-error`} className="mt-1 text-xs text-red-600 dark:text-red-400">
                              {formErrors[`variable-${index}-name`]}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <label htmlFor={`variable-description-${index}`} className="sr-only">Description de la variable</label>
                        <input
                          id={`variable-description-${index}`}
                          type="text"
                          value={variable.description}
                          onChange={(e) => {
                            const newVariables = [...formData.variables];
                            newVariables[index] = {
                              ...newVariables[index],
                              description: e.target.value
                            };
                            setFormData({...formData, variables: newVariables});
                          }}
                          aria-label={`Description de la variable ${index + 1}`}
                          aria-required="true"
                          aria-describedby={formErrors[`variable-${index}-description`] ? `variable-${index}-description-error` : undefined}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                        {formErrors[`variable-${index}-description`] && (
                          <p id={`variable-${index}-description-error`} className="mt-1 text-xs text-red-600 dark:text-red-400">
                            {formErrors[`variable-${index}-description`]}
                          </p>
                        )}
                      </div>
                      <div className="col-span-1">
                        <label htmlFor={`variable-type-${index}`} className="sr-only">Type de variable</label>
                        <select
                          id={`variable-type-${index}`}
                          value={variable.type}
                          onChange={(e) => handleVariableTypeChange(index, e.target.value)}
                          aria-label={`Type de la variable ${index + 1}`}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                          <option value="text">Texte</option>
                          <option value="number">Nombre</option>
                          <option value="date">Date</option>
                          <option value="image">Image</option>
                          <option value="html">HTML</option>
                        </select>
                      </div>
                      <div className="col-span-1 flex items-center">
                        <label htmlFor={`variable-source-${index}`} className="sr-only">Source de la variable</label>
                        <select
                          id={`variable-source-${index}`}
                          value={variable.source}
                          onChange={(e) => handleVariableSourceChange(index, e.target.value)}
                          aria-label={`Source de la variable ${index + 1}`}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                          <option value="school">École</option>
                          <option value="document">Document</option>
                          <option value="user">Utilisateur</option>
                          <option value="student">Élève</option>
                          <option value="system">Système</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariable(index)}
                          aria-label={`Supprimer la variable ${variable.name || index + 1}`}
                          title={`Supprimer la variable ${variable.name || index + 1}`}
                          className="ml-2 p-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="grid grid-cols-5 gap-4 items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="col-span-1">
                      <input
                        type="text"
                        value={newVariable.name}
                        onChange={(e) => setNewVariable({...newVariable, name: e.target.value})}
                        placeholder="Nom"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={newVariable.description}
                        onChange={(e) => setNewVariable({...newVariable, description: e.target.value})}
                        aria-label="Description de la nouvelle variable"
                        placeholder="Description"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div className="col-span-1">
                      <label htmlFor="new-variable-type" className="sr-only">Type de la nouvelle variable</label>
                      <select
                        id="new-variable-type"
                        value={newVariable.type}
                        onChange={(e) => {
                          const value = e.target.value as 'text' | 'number' | 'date' | 'image' | 'html';
                          setNewVariable(prev => ({
                            ...prev,
                            type: value
                          }));
                        }}
                        aria-label="Type de la nouvelle variable"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="text">Texte</option>
                        <option value="number">Nombre</option>
                        <option value="date">Date</option>
                        <option value="image">Image</option>
                        <option value="html">HTML</option>
                      </select>
                    </div>
                    <div className="col-span-1 flex items-center">
                      <label htmlFor="new-variable-source" className="sr-only">Source de la nouvelle variable</label>
                      <select
                        id="new-variable-source"
                        value={newVariable.source}
                        onChange={(e) => {
                          const value = e.target.value as 'school' | 'document' | 'user' | 'student' | 'system';
                          setNewVariable(prev => ({
                            ...prev,
                            source: value
                          }));
                        }}
                        aria-label="Source de la nouvelle variable"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="school">École</option>
                        <option value="document">Document</option>
                        <option value="user">Utilisateur</option>
                        <option value="student">Élève</option>
                        <option value="system">Système</option>
                      </select>
                      <button
                        type="button"
                        onClick={handleAddVariable}
                        aria-label="Ajouter une nouvelle variable"
                        title="Ajouter une nouvelle variable"
                        className="ml-2 p-1 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Zones du template */}
        {!previewMode && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
              Zones du template
            </h4>
            
            <div className="space-y-4">
              {formData.zones.map((zone, index) => (
                <div key={zone.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-medium text-gray-900 dark:text-gray-100">{zone.name}</h5>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">
                      {zone.type}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={`zone-name-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nom de la zone
                      </label>
                      <input
                        type="text"
                        id={`zone-name-${index}`}
                        value={zone.name}
                        onChange={(e) => handleZoneChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor={`zone-position-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Position
                      </label>
                      <select
                        id={`zone-position-${index}`}
                        value={zone.position}
                        onChange={(e) => handleZoneChange(index, 'position', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="top">Haut</option>
                        <option value="middle">Milieu</option>
                        <option value="bottom">Bas</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Informations d'aide */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start space-x-3">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">Utilisation des variables</p>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Utilisez les variables en les entourant d'accolades, par exemple: {'{nom_ecole}'}. 
              Les variables seront automatiquement remplacées par les valeurs correspondantes lors de la génération du document.
            </p>
          </div>
        </div>
      </form>
    </FormModal>
  );
};

export default DocumentTemplateModal;