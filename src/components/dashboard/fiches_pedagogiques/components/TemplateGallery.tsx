import React, { useState, useEffect } from 'react';
import { Search, X, Filter, Grid, List, Star, Download, Share2, Copy } from 'lucide-react';
import { Template, TemplateSubject, TEMPLATE_SUBJECTS } from '../types/template';
import { templateService } from '../services/templateService';

interface TemplateGalleryProps {
  onSelectTemplate?: (template: Template) => void;
  onClose?: () => void;
  subjectFilter?: TemplateSubject;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  onSelectTemplate,
  onClose,
  subjectFilter
}) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedSubject, setSelectedSubject] = useState<TemplateSubject | ''>(subjectFilter || '');
  const [selectedSort, setSelectedSort] = useState<'recent' | 'popular' | 'rating'>('recent');

  // Load templates
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true);
        const userTemplates = await templateService.getUserTemplates('current-user-id', {
          subject: selectedSubject as TemplateSubject,
          search: searchQuery
        });
        
        // Sort templates
        const sortedTemplates = [...userTemplates].sort((a, b) => {
          switch (selectedSort) {
            case 'recent':
              return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            case 'popular':
              return (b.stats?.timesUsed || 0) - (a.stats?.timesUsed || 0);
            case 'rating':
              return (b.stats?.averageRating || 0) - (a.stats?.averageRating || 0);
            default:
              return 0;
          }
        });
        
        setTemplates(sortedTemplates);
      } catch (error) {
        console.error('Error loading templates:', error);
        // Handle error (show toast, etc.)
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, [searchQuery, selectedSubject, selectedSort]);

  const handleUseTemplate = (template: Template) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
  };

  const handleDuplicateTemplate = async (template: Template) => {
    try {
      const newTemplate = await templateService.createTemplateFromExisting(
        template.id,
        'current-user-id',
        `${template.name} (Copie)`,
        template.description
      );
      
      // Update the templates list
      setTemplates([newTemplate, ...templates]);
      
      // Show success message
      // toast.success('Template dupliqué avec succès');
    } catch (error) {
      console.error('Error duplicating template:', error);
      // toast.error('Erreur lors de la duplication du template');
    }
  };

  const handleShareTemplate = (template: Template) => {
    // Implement sharing logic
    console.log('Sharing template:', template.id);
    // toast.info('Fonctionnalité de partage à venir');
  };

  const handleDownloadTemplate = (template: Template) => {
    // Implement download logic
    console.log('Downloading template:', template.id);
    // toast.info('Téléchargement du template');
  };

  const handleRateTemplate = async (templateId: string, rating: number) => {
    try {
      await templateService.rateTemplate(templateId, 'current-user-id', rating);
      // Update the template in the list
      setTemplates(templates.map(t => 
        t.id === templateId 
          ? { 
              ...t, 
              stats: { 
                ...t.stats, 
                userRatings: { 
                  ...t.stats.userRatings, 
                  ['current-user-id']: rating 
                },
                averageRating: templateService.calculateAverageRating({
                  ...t.stats.userRatings,
                  ['current-user-id']: rating
                })
              } 
            } 
          : t
      ));
      // toast.success('Merci pour votre évaluation !');
    } catch (error) {
      console.error('Error rating template:', error);
      // toast.error('Erreur lors de l\'évaluation du template');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Modèles de fiches pédagogiques</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              title="Fermer"
            >
              <X size={20} />
            </button>
          )}
        </div>
        
        {/* Search and filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un modèle..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value as any)}
                aria-label="Trier les modèles"
                aria-required="false"
              >
                <option value="recent">Récents</option>
                <option value="popular">Populaires</option>
                <option value="rating">Mieux notés</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value as TemplateSubject)}
                aria-label="Sélectionner la matière"
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
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-200 text-gray-800' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                title="Vue grille"
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-200 text-gray-800' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                title="Vue liste"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Templates list */}
      {templates.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          <p className="text-lg">Aucun modèle trouvé</p>
          <p className="mt-2">Essayez de modifier vos filtres ou créez un nouveau modèle</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {templates.map(template => (
            <div key={template.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-500">{template.subject}</p>
                  </div>
                  <div className="flex items-center">
                    {template.isDefault && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mr-2">
                        Par défaut
                      </span>
                    )}
                    <div className="flex items-center text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRateTemplate(template.id, star)}
                          className="hover:text-yellow-500 focus:outline-none"
                          disabled={template.isDefault}
                          aria-label={`Noter ${star} étoiles sur 5 pour ${template.name}`}
                        >
                          <Star 
                            size={16} 
                            fill={
                              star <= Math.round(template.stats?.averageRating || 0) 
                                ? 'currentColor' 
                                : 'none'
                            } 
                          />
                        </button>
                      ))}
                      <span className="ml-1 text-xs text-gray-500">
                        ({template.stats?.timesUsed || 0})
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {template.description || 'Aucune description'}
                </p>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex space-x-1">
                    {template.tags?.slice(0, 2).map(tag => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                    {template.tags && template.tags.length > 2 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
                        +{template.tags.length - 2}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleDownloadTemplate(template)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                      title="Télécharger"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      onClick={() => handleShareTemplate(template)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                      title="Partager"
                    >
                      <Share2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDuplicateTemplate(template)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                      title="Dupliquer"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    aria-label={`Utiliser le modèle ${template.name}`}
                  >
                    Utiliser ce modèle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {templates.map(template => (
            <div key={template.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <h3 className="text-base font-medium text-gray-900 truncate">
                      {template.name}
                    </h3>
                    {template.isDefault && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Par défaut
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {template.subject} • {template.stats?.timesUsed || 0} utilisations
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    {template.description || 'Aucune description'}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {template.tags?.map(tag => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="ml-4 flex-shrink-0 flex flex-col items-end">
                  <div className="flex items-center text-yellow-400 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRateTemplate(template.id, star)}
                        className="hover:text-yellow-500 focus:outline-none"
                        disabled={template.isDefault}
                      >
                        <Star 
                          size={16} 
                          fill={
                            star <= Math.round(template.stats?.averageRating || 0) 
                              ? 'currentColor' 
                              : 'none'
                          } 
                        />
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={() => handleDownloadTemplate(template)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                      title="Télécharger"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      onClick={() => handleShareTemplate(template)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                      title="Partager"
                    >
                      <Share2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDuplicateTemplate(template)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                      title="Dupliquer"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Utiliser ce modèle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
