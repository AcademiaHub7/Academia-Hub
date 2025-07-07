import React, { useState } from 'react';
import { Plus, X, Search, Filter, Grid, List, ChevronDown } from 'lucide-react';
import { Template, TemplateSubject, TEMPLATE_SUBJECTS } from '../types/template';
import { templateService } from '../services/templateService';
import { TemplateGallery } from './TemplateGallery';

interface FicheTemplateSelectorProps {
  onSelectTemplate: (template: Template) => void;
  selectedSubject?: TemplateSubject;
  className?: string;
}

export const FicheTemplateSelector: React.FC<FicheTemplateSelectorProps> = ({
  onSelectTemplate,
  selectedSubject,
  className = ''
}) => {
  const [showGallery, setShowGallery] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<TemplateSubject | ''>(selectedSubject || '');
  const [recentTemplates, setRecentTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  // Load recent templates
  React.useEffect(() => {
    const loadRecentTemplates = async () => {
      try {
        setLoading(true);
        const templates = await templateService.getUserTemplates('current-user-id', {
          subject: selectedSubjectFilter as TemplateSubject,
          search: searchQuery,
          isDefault: true
        });
        
        // Get the 3 most recent templates
        const recent = [...templates]
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 3);
        
        setRecentTemplates(recent);
      } catch (error) {
        console.error('Error loading recent templates:', error);
      } finally {
        setLoading(false);
      }
    };

    if (showGallery) {
      loadRecentTemplates();
    }
  }, [showGallery, searchQuery, selectedSubjectFilter]);

  const handleTemplateSelect = (template: Template) => {
    onSelectTemplate(template);
    setShowGallery(false);
  };

  if (!showGallery) {
    return (
      <div className={`${className}`}>
        <button
          type="button"
          onClick={() => setShowGallery(true)}
          className="w-full py-2 px-4 border border-dashed border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center justify-center space-x-2"
          aria-label="Ouvrir le sélecteur de modèles"
          title="Ouvrir le sélecteur de modèles"
        >
          <Plus className="h-4 w-4" />
          <span>Choisir un modèle</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden border border-gray-200 ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Choisir un modèle</h3>
          <button
            type="button"
            onClick={() => setShowGallery(false)}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Fermer le sélecteur de modèles"
            title="Fermer le sélecteur de modèles"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Quick filters */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Rechercher un modèle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Rechercher un modèle de fiche"
              aria-required="false"
            />
          </div>
          
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value as TemplateSubject)}
              aria-label="Filtrer par matière"
              aria-required="false"
            >
              <option value="">Toutes les matières</option>
              {TEMPLATE_SUBJECTS.map(subject => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Recent templates */}
        {!searchQuery && !selectedSubjectFilter && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Modèles récents</h4>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-gray-100 animate-pulse rounded"></div>
                ))}
              </div>
            ) : recentTemplates.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recentTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className="p-3 border border-gray-200 rounded-md text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-3">
                        <FileText size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate">{template.name}</p>
                        <p className="text-xs text-gray-500">{template.subject}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Aucun modèle récent</p>
            )}
          </div>
        )}
      </div>
      
      {/* Full template gallery */}
      <div className="max-h-96 overflow-y-auto">
        <TemplateGallery 
          onSelectTemplate={handleTemplateSelect}
          subjectFilter={selectedSubjectFilter as TemplateSubject}
        />
      </div>
      
      <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
        <button
          type="button"
          onClick={() => setShowGallery(false)}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};
