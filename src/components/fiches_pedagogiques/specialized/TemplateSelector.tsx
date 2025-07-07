import React, { useState } from 'react';
import { Check, X, FileText, LayoutGrid } from 'lucide-react';

interface Template {
  id: string;
  nom: string;
  description: string;
  preview: string;
  type: 'fiche' | 'planification';
}

interface TemplateSelectorProps {
  template: string;
  onChange: (templateId: string) => void;
}

const templates: Template[] = [
  {
    id: '1',
    nom: 'Template Standard',
    description: 'Structure de base pour les fiches pédagogiques',
    preview: 'Structure simple avec sections principales',
    type: 'fiche'
  },
  {
    id: '2',
    nom: 'Template Détaillé',
    description: 'Format complet avec sections supplémentaires',
    preview: 'Structure détaillée avec sections avancées',
    type: 'fiche'
  },
  {
    id: '3',
    nom: 'Template Planification',
    description: 'Spécialement conçu pour les planifications hebdomadaires',
    preview: 'Structure optimisée pour la planification',
    type: 'planification'
  },
  {
    id: '4',
    nom: 'Template Court',
    description: 'Format compact pour les fiches rapides',
    preview: 'Structure minimale',
    type: 'fiche'
  }
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  template,
  onChange
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState(template);
  const [showPreview, setShowPreview] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    onChange(templateId);
  };

  const getTemplateById = (id: string) => {
    return templates.find(t => t.id === id);
  };

  const selectedTemplateData = getTemplateById(selectedTemplate);

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Sélection du template</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => handleTemplateSelect(tmpl.id)}
              className={`p-4 rounded-lg border transition-colors duration-200 ${
                selectedTemplate === tmpl.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                  : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <FileText className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="font-medium">{tmpl.nom}</span>
                </div>
                {selectedTemplate === tmpl.id && (
                  <Check className="w-5 h-5 text-blue-500" />
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tmpl.description}</p>
            </button>
          ))}
        </div>
      </div>

      {selectedTemplateData && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Aperçu du template</h4>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-lg font-semibold">{selectedTemplateData.nom}</h5>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{selectedTemplateData.preview}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
