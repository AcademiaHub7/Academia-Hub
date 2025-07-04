import React, { useState } from 'react';
import { Plus, Copy, Edit, Trash, Search } from 'lucide-react';
import { JournalTemplate } from '../../../types/journal';

interface TemplateSelectionProps {
  templates: JournalTemplate[];
  onUseTemplate: (template: JournalTemplate) => void;
  onCreateTemplate: () => void;
  onEditTemplate: (template: JournalTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
}

const TemplateSelection: React.FC<TemplateSelectionProps> = ({
  templates,
  onUseTemplate,
  onCreateTemplate,
  onEditTemplate,
  onDeleteTemplate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTemplateId, setExpandedTemplateId] = useState<string | null>(null);

  const filteredTemplates = templates.filter(template => 
    template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (templateId: string) => {
    setExpandedTemplateId(expandedTemplateId === templateId ? null : templateId);
  };

  return (
    <div className="border rounded-lg p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Modèles de séances</h3>
        <button 
          className="btn btn-primary btn-sm"
          onClick={onCreateTemplate}
        >
          <Plus className="w-4 h-4 mr-1" />
          Nouveau modèle
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher un modèle..."
          className="input input-bordered input-sm pl-9 pr-4 w-full"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredTemplates.length > 0 ? (
          <div className="space-y-3">
            {filteredTemplates.map(template => (
              <div 
                key={template.id} 
                className="border rounded-lg overflow-hidden"
              >
                <div 
                  className="p-3 bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => toggleExpand(template.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{template.title}</div>
                      <div className="text-sm text-gray-500">
                        {template.subject} - {template.duration} min
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button 
                        className="btn btn-ghost btn-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUseTemplate(template);
                        }}
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {expandedTemplateId === template.id && (
                  <div className="p-3 border-t">
                    {template.description && (
                      <div className="mb-2">
                        <div className="text-sm font-medium">Description</div>
                        <div className="text-sm">{template.description}</div>
                      </div>
                    )}

                    {template.objectives && template.objectives.length > 0 && (
                      <div className="mb-2">
                        <div className="text-sm font-medium">Objectifs</div>
                        <ul className="text-sm list-disc list-inside">
                          {template.objectives.map(obj => (
                            <li key={obj.id}>{obj.description}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {template.steps && template.steps.length > 0 && (
                      <div className="mb-2">
                        <div className="text-sm font-medium">Étapes</div>
                        <ul className="text-sm list-disc list-inside">
                          {template.steps.map(step => (
                            <li key={step.id}>
                              {step.description}
                              {step.duration && <span className="text-gray-500"> ({step.duration} min)</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex justify-end space-x-2 mt-3">
                      <button 
                        className="btn btn-ghost btn-xs"
                        onClick={() => onEditTemplate(template)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Modifier
                      </button>
                      <button 
                        className="btn btn-ghost btn-xs text-red-500"
                        onClick={() => onDeleteTemplate(template.id)}
                      >
                        <Trash className="w-3 h-3 mr-1" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="text-lg mb-2">Aucun modèle trouvé</div>
            {searchTerm ? (
              <div className="text-sm">Essayez une autre recherche</div>
            ) : (
              <div className="text-sm">Créez votre premier modèle</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateSelection;
