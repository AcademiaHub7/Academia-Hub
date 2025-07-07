import React, { useState } from 'react';
import { Plus, X, CheckCircle, AlertCircle, FileText, Share2, Edit, Trash2 } from 'lucide-react';
import { Template } from './types';

interface TemplateManagerProps {
  templates: Template[];
  onTemplateSelect: (template: Template) => void;
  onTemplateUpdate: (template: Template) => void;
  onTemplateDelete: (templateId: string) => void;
  onTemplateShare: (template: Template) => void;
  selectedTemplateId: string;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({
  templates,
  onTemplateSelect,
  onTemplateUpdate,
  onTemplateDelete,
  onTemplateShare,
  selectedTemplateId
}) => {
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const handleTemplateSelect = (template: Template) => {
    onTemplateSelect(template);
    setSelectedTemplate(template);
  };

  const handleTemplateEdit = (template: Template) => {
    setSelectedTemplate(template);
    setShowTemplateModal(true);
  };

  const handleTemplateDelete = (template: Template) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le template "${template.nom}" ?`)) {
      onTemplateDelete(template.id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Barre d'outils */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Gestion des Templates</h3>
        <button
          onClick={() => setShowTemplateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau template
        </button>
      </div>

      {/* Liste des templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`p-4 rounded-lg border transition-colors duration-200 ${
              selectedTemplateId === template.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <FileText className="w-5 h-5 text-blue-500 mr-2" />
                <span className="font-medium">{template.nom}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleTemplateSelect(template)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                </button>
                <button
                  onClick={() => handleTemplateEdit(template)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <Edit className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => handleTemplateDelete(template)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onTemplateShare(template)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <Share2 className="w-4 h-4 text-green-500" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
            <div className="mt-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{template.matiere}</span>
              <span>{template.type}</span>
              <span>V{template.version}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de création/modification */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {selectedTemplate ? 'Modifier' : 'Créer'} Template
              </h2>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              {/* Formulaire de template */}
              <TemplateForm
                template={selectedTemplate}
                onSubmit={(template) => {
                  onTemplateUpdate(template);
                  setShowTemplateModal(false);
                }}
                onCancel={() => setShowTemplateModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateManager;
