import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Eye, 
  Edit, 
  Trash2, 
  Copy,
  CheckCircle,
  Settings,
  AlertTriangle
} from 'lucide-react';
import { DocumentTemplateModal, ConfirmModal, AlertModal } from '../modals';

// Import types from DocumentTemplateModal if they were exported
// Since they aren't exported, we'll recreate the necessary types here

// Match the TemplateData interface from DocumentTemplateModal
interface TemplateZone {
  id: string;
  name: string;
  type: string;
  content: string;
  position: string;
}

interface TemplateVariable {
  name: string;
  description: string;
  type: 'text' | 'number' | 'date' | 'image' | 'html';
  source: 'school' | 'document' | 'user' | 'student' | 'system';
}

// Type matching what the DocumentTemplateModal expects as input
type ModalTemplateData = {
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

// Our document template extended with additional fields for display
interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  type: string; // This maps to documentType in TemplateData
  category: string;
  lastModified: string;
  isDefault: boolean;
  isActive: boolean;
  createdBy: string;
  // Optional fields that might be needed for the modal
  htmlTemplate?: string;
  cssStyles?: string;
  zones?: TemplateZone[];
  variables?: TemplateVariable[];
}

type AlertType = 'success' | 'error' | 'info' | 'warning';

interface AlertMessage {
  title: string;
  message: string;
  type: AlertType;
}

const DocumentTemplates: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [alertMessage, setAlertMessage] = useState<AlertMessage>({ title: '', message: '', type: 'success' });

  // Données fictives pour les templates
  const templates = [
    {
      id: 'TPL-001',
      name: 'Facture standard',
      description: 'Template de facture avec en-tête et pied de page personnalisés',
      type: 'invoice',
      category: 'boutique',
      lastModified: '2024-01-15',
      isDefault: true,
      isActive: true,
      createdBy: 'Admin'
    },
    {
      id: 'TPL-002',
      name: 'Bulletin de notes trimestriel',
      description: 'Format officiel pour les bulletins de notes',
      type: 'report_card',
      category: 'academique',
      lastModified: '2024-01-10',
      isDefault: true,
      isActive: true,
      createdBy: 'Admin'
    },
    {
      id: 'TPL-003',
      name: 'Certificat de scolarité',
      description: 'Attestation de présence dans l\'établissement',
      type: 'certificate',
      category: 'academique',
      lastModified: '2024-01-08',
      isDefault: true,
      isActive: true,
      createdBy: 'Admin'
    },
    {
      id: 'TPL-004',
      name: 'Convocation parents',
      description: 'Modèle de convocation pour les parents d\'élèves',
      type: 'convocation',
      category: 'administratif',
      lastModified: '2024-01-05',
      isDefault: true,
      isActive: true,
      createdBy: 'Admin'
    },
    {
      id: 'TPL-005',
      name: 'Rappel de paiement',
      description: 'Lettre de rappel pour les frais impayés',
      type: 'payment_reminder',
      category: 'financier',
      lastModified: '2024-01-03',
      isDefault: true,
      isActive: true,
      createdBy: 'Admin'
    }
  ];

  // Catégories de documents
  const categories = [
    { id: 'all', name: 'Toutes les catégories' },
    { id: 'boutique', name: 'Boutique' },
    { id: 'academique', name: 'Académique' },
    { id: 'administratif', name: 'Administratif' },
    { id: 'financier', name: 'Financier' },
    { id: 'rapports', name: 'Rapports' }
  ];

  // Filtrage des templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Handlers pour les modals
  const handleNewTemplate = () => {
    setIsEditMode(false);
    setSelectedTemplate(null);
    setIsTemplateModalOpen(true);
  };

  const handleEditTemplate = (template: DocumentTemplate) => {
    setIsEditMode(true);
    setSelectedTemplate(template);
    setIsTemplateModalOpen(true);
  };

  const handleDeleteTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setIsConfirmModalOpen(true);
  };

  const handleDuplicateTemplate = (template: DocumentTemplate) => {
    // Create a duplicate template with a new ID and modified name
    // In a real application, we would save this template here
    // For demonstration purposes, we'll just show an alert message
    
    setAlertMessage({
      title: 'Template dupliqué',
      message: `Le template "${template.name}" a été dupliqué avec succès.`,
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  const handleSaveTemplate = (templateData: DocumentTemplate) => {
    setIsTemplateModalOpen(false);
    
    setAlertMessage({
      title: isEditMode ? 'Template modifié' : 'Template créé',
      message: isEditMode 
        ? `Le template "${templateData.name}" a été modifié avec succès.`
        : `Le nouveau template "${templateData.name}" a été créé avec succès.`,
      type: 'success'
    });
    
    setIsAlertModalOpen(true);
  };

  const confirmDeleteTemplate = () => {
    console.log('Deleting template:', selectedTemplate);
    setIsConfirmModalOpen(false);
    setAlertMessage({
      title: 'Template supprimé',
      message: `Le template "${selectedTemplate?.name}" a été supprimé avec succès.`,
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Paramétrage des Documents</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestion des templates pour tous les documents générés</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Upload className="w-4 h-4 mr-2" />
            Importer
          </button>
          <button 
            onClick={handleNewTemplate}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau template
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher un template..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filtrer par catégorie"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{template.name}</h4>
                    {template.isDefault && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs">
                        Par défaut
                      </span>
                    )}
                    {!template.isActive && (
                      <span className="ml-2 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-xs">
                        Inactif
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{template.description}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-500">ID: {template.id}</span>
                    <span className="mx-2 text-gray-300 dark:text-gray-700">•</span>
                    <span className="text-xs text-gray-500 dark:text-gray-500">Type: {template.type}</span>
                    <span className="mx-2 text-gray-300 dark:text-gray-700">•</span>
                    <span className="text-xs text-gray-500 dark:text-gray-500">Modifié le: {template.lastModified}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg"
                  title="Prévisualiser"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleEditTemplate(template)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  title="Modifier"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDuplicateTemplate(template)}
                  className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-lg"
                  title="Dupliquer"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteTemplate(template)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <FileText className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Aucun template trouvé</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm || selectedCategory !== 'all' 
              ? "Aucun résultat ne correspond à votre recherche. Essayez de modifier vos critères."
              : "Vous n'avez pas encore créé de templates. Commencez par en créer un nouveau."}
          </p>
          <button 
            onClick={handleNewTemplate}
            className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer un template
          </button>
        </div>
      )}

      {/* Information section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-900/30">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-3">
            <Settings className="w-6 h-6 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-blue-900 dark:text-blue-300 mb-2">Paramétrage des documents</h3>
            <p className="text-blue-800 dark:text-blue-400 mb-4">
              Les templates de documents permettent de personnaliser l'apparence de tous les documents générés par l'application.
              Vous pouvez créer des templates pour chaque type de document et les personnaliser selon vos besoins.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                  Bonnes pratiques
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                  <li>• Utilisez des variables pour les données dynamiques</li>
                  <li>• Testez vos templates avant de les utiliser</li>
                  <li>• Créez des templates distincts pour chaque type de document</li>
                  <li>• Respectez la charte graphique de votre établissement</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600 dark:text-yellow-400" />
                  Points d'attention
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                  <li>• Vérifiez la compatibilité avec l'impression</li>
                  <li>• Assurez-vous que toutes les variables sont définies</li>
                  <li>• Limitez la taille des images pour optimiser les performances</li>
                  <li>• Testez sur différents formats de papier si nécessaire</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DocumentTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSave={(data: ModalTemplateData) => {
          // Convert TemplateData to DocumentTemplate if needed
          const templateData: DocumentTemplate = {
            id: selectedTemplate?.id || `TPL-${Math.floor(Math.random() * 1000)}`,
            name: data.name,
            description: data.description,
            type: data.documentType, // Map documentType to type
            category: selectedTemplate?.category || 'default',
            lastModified: new Date().toISOString().split('T')[0],
            isDefault: data.isDefault,
            isActive: data.isActive,
            createdBy: selectedTemplate?.createdBy || 'Admin',
            htmlTemplate: data.htmlTemplate,
            cssStyles: data.cssStyles,
            zones: data.zones,
            variables: data.variables
          };
          handleSaveTemplate(templateData);
        }}
        templateData={selectedTemplate ? {
          name: selectedTemplate.name,
          description: selectedTemplate.description,
          documentType: selectedTemplate.type,
          htmlTemplate: selectedTemplate.htmlTemplate || '',
          cssStyles: selectedTemplate.cssStyles || '',
          zones: selectedTemplate.zones || [],
          variables: selectedTemplate.variables || [],
          isDefault: selectedTemplate.isDefault,
          isActive: selectedTemplate.isActive
        } : undefined}
        isEdit={isEditMode}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDeleteTemplate}
        title="Supprimer ce template ?"
        message={`Êtes-vous sûr de vouloir supprimer le template "${selectedTemplate?.name}" ? Cette action est irréversible.`}
        type="danger"
        confirmText="Supprimer"
        cancelText="Annuler"
      />

      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        title={alertMessage.title}
        message={alertMessage.message}
        type={alertMessage.type}
      />
    </div>
  );
};

export default DocumentTemplates;