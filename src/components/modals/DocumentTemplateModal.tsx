import React, { useState, useRef } from 'react';
import FormModal from './FormModal';
import { FileText, Save, Upload, Download, Code, Eye, Trash2, Plus } from 'lucide-react';

interface DocumentTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (templateData: any) => void;
  templateData?: any;
  isEdit?: boolean;
  documentTypes?: any[];
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

  const allDocumentTypes = documentTypes.length > 0 ? documentTypes : defaultDocumentTypes;

  const [formData, setFormData] = useState({
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
  const [activeTab, setActiveTab] = useState('html');
  const [newVariable, setNewVariable] = useState({ name: '', description: '', type: 'text', source: 'document' });
  
  const htmlEditorRef = useRef<HTMLTextAreaElement>(null);
  const cssEditorRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleZoneChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newZones = [...prev.zones];
      newZones[index] = { ...newZones[index], [field]: value };
      return { ...prev, zones: newZones };
    });
  };

  const handleAddVariable = () => {
    if (newVariable.name && newVariable.description) {
      setFormData(prev => ({
        ...prev,
        variables: [...prev.variables, { ...newVariable }]
      }));
      setNewVariable({ name: '', description: '', type: 'text', source: 'document' });
    }
  };

  const handleRemoveVariable = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.filter((_, i) => i !== index)
    }));
  };

  const insertVariable = (variable: string) => {
    if (htmlEditorRef.current) {
      const cursorPos = htmlEditorRef.current.selectionStart;
      const textBefore = formData.htmlTemplate.substring(0, cursorPos);
      const textAfter = formData.htmlTemplate.substring(cursorPos);
      
      setFormData(prev => ({
        ...prev,
        htmlTemplate: `${textBefore}{${variable}}${textAfter}`
      }));
      
      // Restore focus and cursor position
      setTimeout(() => {
        if (htmlEditorRef.current) {
          htmlEditorRef.current.focus();
          htmlEditorRef.current.selectionStart = cursorPos + variable.length + 2; // +2 for the braces
          htmlEditorRef.current.selectionEnd = cursorPos + variable.length + 2;
        }
      }, 0);
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
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {isEdit ? "Mettre à jour" : "Enregistrer"}
          </button>
        </div>
      }
    >
      <form id="document-template-form" onSubmit={handleSubmit} className="space-y-6">
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
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Ex: Facture standard"
              />
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
              <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
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
                  
                  <textarea
                    ref={htmlEditorRef}
                    name="htmlTemplate"
                    value={formData.htmlTemplate}
                    onChange={handleChange}
                    rows={15}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono"
                  />
                </div>
              )}
              
              {activeTab === 'css' && (
                <div>
                  <textarea
                    ref={cssEditorRef}
                    name="cssStyles"
                    value={formData.cssStyles}
                    onChange={handleChange}
                    rows={15}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono"
                  />
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
                        <input
                          type="text"
                          value={variable.name}
                          onChange={(e) => {
                            const newVariables = [...formData.variables];
                            newVariables[index].name = e.target.value;
                            setFormData({...formData, variables: newVariables});
                          }}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={variable.description}
                          onChange={(e) => {
                            const newVariables = [...formData.variables];
                            newVariables[index].description = e.target.value;
                            setFormData({...formData, variables: newVariables});
                          }}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <div className="col-span-1">
                        <select
                          value={variable.type}
                          onChange={(e) => {
                            const newVariables = [...formData.variables];
                            newVariables[index].type = e.target.value;
                            setFormData({...formData, variables: newVariables});
                          }}
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
                        <select
                          value={variable.source}
                          onChange={(e) => {
                            const newVariables = [...formData.variables];
                            newVariables[index].source = e.target.value;
                            setFormData({...formData, variables: newVariables});
                          }}
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
                          className="ml-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
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
                        placeholder="Description"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div className="col-span-1">
                      <select
                        value={newVariable.type}
                        onChange={(e) => setNewVariable({...newVariable, type: e.target.value})}
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
                      <select
                        value={newVariable.source}
                        onChange={(e) => setNewVariable({...newVariable, source: e.target.value})}
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
                        className="ml-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
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