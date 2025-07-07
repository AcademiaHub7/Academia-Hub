import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, 
  Trash2, 
  Share2, 
  Copy, 
  ArrowLeft, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  X,
  List,
  Grid,
  Settings,
  Code,
  Eye,
  EyeOff,
  FileText,
  LayoutTemplate,
  Table2,
  ListChecks,
  ListTodo,
  ListOrdered,
  ListPlus,
  ListMinus
} from 'lucide-react';
import { Template, TemplateSubject, TEMPLATE_SUBJECTS } from '../types/template';
import { templateService } from '../services/templateService';

interface TemplateEditorProps {
  templateId?: string;
  onSave?: (template: Template) => void;
  onCancel?: () => void;
  initialTemplate?: Partial<Template>;
  readOnly?: boolean;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  templateId,
  onSave,
  onCancel,
  initialTemplate,
  readOnly = false
}) => {
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Partial<Template>>(initialTemplate || {});
  const [activeTab, setActiveTab] = useState('header');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewMode, setPreviewMode] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Load template if ID is provided
  useEffect(() => {
    if (templateId) {
      const loadTemplate = async () => {
        try {
          const loadedTemplate = await templateService.getTemplateById(templateId, 'current-user-id');
          setTemplate(loadedTemplate);
        } catch (error) {
          console.error('Error loading template:', error);
          // Handle error (show toast, etc.)
        }
      };
      loadTemplate();
    }
  }, [templateId]);

  const handleInputChange = (field: string, value: any) => {
    setTemplate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHeaderChange = (field: string, value: string) => {
    setTemplate(prev => ({
      ...prev,
      header: {
        ...prev.header,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrors({});
    
    try {
      // Basic validation
      const newErrors: Record<string, string> = {};
      if (!template.name) newErrors.name = 'Le nom est requis';
      if (!template.subject) newErrors.subject = 'La matière est requise';
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      let savedTemplate: Template;
      
      if (templateId) {
        // Update existing template
        const updated = await templateService.updateTemplate(
          templateId,
          template as Template,
          'current-user-id',
          'Mise à jour du template'
        );
        savedTemplate = updated;
      } else {
        // Create new template
        const created = await templateService.createTemplate(
          {
            ...template,
            isDefault: false,
            isShared: false,
            tags: [],
            versions: [],
            variables: {},
            planningSections: [],
            procedureTable: { columns: [], rows: [] },
            steps: []
          } as any, // Cast to Template to satisfy TypeScript
          'current-user-id'
        );
        savedTemplate = created;
      }
      
      if (onSave) {
        onSave(savedTemplate);
      } else {
        // Default behavior: navigate back
        navigate(-1);
      }
    } catch (error) {
      console.error('Error saving template:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSaving(false);
    }
  };

  const handleDuplicate = async () => {
    if (!templateId) return;
    
    try {
      const newTemplate = await templateService.createTemplateFromExisting(
        templateId,
        'current-user-id',
        `${template.name} (Copie)`,
        template.description
      );
      
      // Navigate to the new template
      navigate(`/templates/edit/${newTemplate.id}`);
    } catch (error) {
      console.error('Error duplicating template:', error);
      // Handle error
    }
  };

  const handleShare = () => {
    // Implement sharing logic
    console.log('Sharing template:', templateId);
  };

  const handleDelete = async () => {
    if (!templateId || !window.confirm('Êtes-vous sûr de vouloir supprimer ce modèle ?')) {
      return;
    }
    
    try {
      await templateService.deleteTemplate(templateId, 'current-user-id');
      // Navigate back or to templates list
      navigate('/templates');
    } catch (error) {
      console.error('Error deleting template:', error);
      // Handle error
    }
  };

  // Navigation tabs
  const tabs = [
    { id: 'header', label: 'En-tête', icon: <FileText size={16} /> },
    { id: 'sections', label: 'Sections', icon: <ListChecks size={16} /> },
    { id: 'procedure', label: 'Procédure', icon: <Table2 size={16} /> },
    { id: 'steps', label: 'Étapes', icon: <ListOrdered size={16} /> },
    { id: 'preview', label: 'Aperçu', icon: <Eye size={16} /> }
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={onCancel || (() => navigate(-1))}
              className="p-2 rounded-full hover:bg-gray-100"
              title="Retour"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold">
              {templateId ? 'Modifier le template' : 'Nouveau template'}
            </h1>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                previewMode 
                  ? 'bg-gray-200 text-gray-800' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title={previewMode ? 'Quitter le mode aperçu' : 'Aperçu'}
            >
              {previewMode ? <EyeOff size={16} /> : <Eye size={16} />}
              <span>{previewMode ? 'Quitter l\'aperçu' : 'Aperçu'}</span>
            </button>
            
            {templateId && (
              <>
                <button
                  onClick={handleDuplicate}
                  className="px-4 py-2 rounded-md flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  title="Dupliquer"
                  disabled={isSaving}
                >
                  <Copy size={16} />
                  <span>Dupliquer</span>
                </button>
                
                <button
                  onClick={handleShare}
                  className="px-4 py-2 rounded-md flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  title="Partager"
                  disabled={isSaving}
                >
                  <Share2 size={16} />
                  <span>Partager</span>
                </button>
                
                <button
                  onClick={handleDelete}
                  className="p-2 rounded-full text-red-600 hover:bg-red-50"
                  title="Supprimer"
                  disabled={isSaving}
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
            
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-md flex items-center space-x-2 bg-primary-600 text-white hover:bg-primary-700"
              disabled={isSaving || readOnly}
            >
              <Save size={16} />
              <span>{isSaving ? 'Enregistrement...' : 'Enregistrer'}</span>
            </button>
          </div>
        </div>
        
        {/* Navigation tabs */}
        <div className="mt-4 flex space-x-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-md flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'bg-white border-t border-l border-r border-gray-300 text-primary-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};
