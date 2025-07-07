import React, { useState } from 'react';
import { Building2, Plus, X, Edit, Trash2, Share2, CheckCircle, AlertCircle } from 'lucide-react';
import { Template } from './types';

interface TemplateEstablishmentManagerProps {
  establishmentTemplates: Template[];
  onTemplateAdd: (template: Template) => void;
  onTemplateUpdate: (template: Template) => void;
  onTemplateDelete: (templateId: string) => void;
  onTemplateShare: (template: Template) => void;
  onTemplateValidate: (template: Template) => void;
}

const TemplateEstablishmentManager: React.FC<TemplateEstablishmentManagerProps> = ({
  establishmentTemplates,
  onTemplateAdd,
  onTemplateUpdate,
  onTemplateDelete,
  onTemplateShare,
  onTemplateValidate
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const handleTemplateAdd = () => {
    setShowAddModal(true);
  };

  const handleTemplateEdit = (template: Template) => {
    setSelectedTemplate(template);
    setShowAddModal(true);
  };

  const handleTemplateDelete = (template: Template) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le template "${template.nom}" de l'établissement ?`)) {
      onTemplateDelete(template.id);
    }
  };

  const handleTemplateShare = (template: Template) => {
    onTemplateShare(template);
  };

  const handleTemplateValidate = (template: Template) => {
    onTemplateValidate(template);
  };

  return (
    <div className="space-y-4">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          <Building2 className="w-5 h-5 text-blue-500 mr-2" />
          Templates de l'établissement
        </h3>
        <button
          onClick={handleTemplateAdd}
          className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un template
        </button>
      </div>

      {/* Liste des templates de l'établissement */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {establishmentTemplates.map((template) => (
          <div
            key={template.id}
            className="p-4 rounded-lg border transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <FileText className="w-5 h-5 text-blue-500 mr-2" />
                <span className="font-medium">{template.nom}</span>
              </div>
              <div className="flex space-x-2">
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
                  onClick={() => handleTemplateShare(template)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <Share2 className="w-4 h-4 text-green-500" />
                </button>
                <button
                  onClick={() => handleTemplateValidate(template)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
            <div className="mt-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{template.matiere}</span>
              <span>V{template.version}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal d'ajout/modification */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {selectedTemplate ? 'Modifier' : 'Ajouter'} Template Établissement
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              {/* Formulaire spécifique aux templates établissement */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nom du template
                    </label>
                    <input
                      type="text"
                      value={selectedTemplate?.nom || ''}
                      onChange={(e) => {
                        if (selectedTemplate) {
                          setSelectedTemplate(prev => ({ ...prev, nom: e.target.value }));
                        }
                      }}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Matière
                    </label>
                    <select
                      value={selectedTemplate?.matiere || ''}
                      onChange={(e) => {
                        if (selectedTemplate) {
                          setSelectedTemplate(prev => ({ ...prev, matiere: e.target.value }));
                        }
                      }}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
                      required
                    >
                      <option value="">Sélectionnez une matière</option>
                      <option value="Mathématiques">Mathématiques</option>
                      <option value="Français">Français</option>
                      <option value="Sciences">Sciences</option>
                      <option value="Histoire">Histoire-Géographie</option>
                      <option value="EPS">EPS</option>
                      <option value="Arts">Arts</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={selectedTemplate?.description || ''}
                    onChange={(e) => {
                      if (selectedTemplate) {
                        setSelectedTemplate(prev => ({ ...prev, description: e.target.value }));
                      }
                    }}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 h-32"
                    placeholder="Description détaillée du template..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Accès
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedTemplate?.public || false}
                        onChange={(e) => {
                          if (selectedTemplate) {
                            setSelectedTemplate(prev => ({ ...prev, public: e.target.checked }));
                          }
                        }}
                        className="rounded border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
                      />
                      <span className="text-gray-700 dark:text-gray-300">Accessible à tous les enseignants</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedTemplate?.modifiable || false}
                        onChange={(e) => {
                          if (selectedTemplate) {
                            setSelectedTemplate(prev => ({ ...prev, modifiable: e.target.checked }));
                          }
                        }}
                        className="rounded border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
                      />
                      <span className="text-gray-700 dark:text-gray-300">Modifiable par les enseignants</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      if (selectedTemplate) {
                        onTemplateUpdate(selectedTemplate);
                        setShowAddModal(false);
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {selectedTemplate ? 'Modifier' : 'Ajouter'} Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateEstablishmentManager;
