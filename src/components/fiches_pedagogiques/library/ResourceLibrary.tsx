import React, { useState } from 'react';
import { BookOpen, Image, Video, Headphones, Tools, Users, Star, MessageSquare, Heart } from 'lucide-react';

interface Resource {
  id: string;
  type: 'activity' | 'media' | 'material' | 'collection';
  title: string;
  description: string;
  category: string;
  subject: string;
  level: string;
  tags: string[];
  rating: number;
  downloads: number;
  comments: number;
  favorites: number;
}

interface ResourceLibraryProps {
  onResourceSelect: (resource: Resource) => void;
  onSearch: (query: string) => void;
}

const ResourceLibrary: React.FC<ResourceLibraryProps> = ({
  onResourceSelect,
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  // Données de la bibliothèque (exemples)
  const resources: Resource[] = [
    {
      id: '1',
      type: 'activity',
      title: 'Atelier de fractions',
      description: 'Activité interactive pour comprendre les fractions',
      category: 'Mathématiques',
      subject: 'Mathématiques',
      level: '6ème',
      tags: ['fractions', 'numération', 'activité'],
      rating: 4.5,
      downloads: 125,
      comments: 18,
      favorites: 42
    },
    {
      id: '2',
      type: 'media',
      title: 'Vidéo - Les fractions',
      description: 'Vidéo explicative sur les fractions',
      category: 'Mathématiques',
      subject: 'Mathématiques',
      level: '6ème',
      tags: ['vidéo', 'fractions', 'explication'],
      rating: 4.2,
      downloads: 85,
      comments: 12,
      favorites: 35
    },
    {
      id: '3',
      type: 'material',
      title: 'Kit de manipulation fraction',
      description: 'Matériel pour manipuler les fractions',
      category: 'Mathématiques',
      subject: 'Mathématiques',
      level: '6ème',
      tags: ['matériel', 'fraction', 'manipulation'],
      rating: 4.8,
      downloads: 55,
      comments: 8,
      favorites: 28
    },
    {
      id: '4',
      type: 'activity',
      title: 'Atelier de conjugaison',
      description: 'Activité interactive pour la conjugaison',
      category: 'Français',
      subject: 'Français',
      level: '6ème',
      tags: ['conjugaison', 'grammaire', 'activité'],
      rating: 4.7,
      downloads: 110,
      comments: 15,
      favorites: 38
    }
  ];

  // Filtrer les ressources
  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.tags.some(tag => tag.includes(searchQuery.toLowerCase()))
  );

  // Catégories disponibles
  const categories = [
    'Mathématiques',
    'Français',
    'Sciences',
    'Histoire-Géographie',
    'EPS',
    'Arts plastiques',
    'Musique'
  ];

  // Types de ressources
  const resourceTypes = {
    activity: {
      icon: BookOpen,
      label: 'Activités'
    },
    media: {
      icon: Image,
      label: 'Multimédia'
    },
    material: {
      icon: Tools,
      label: 'Matériel'
    },
    collection: {
      icon: Users,
      label: 'Collections'
    }
  };

  return (
    <div className="space-y-6">
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher des ressources..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
        />
      </div>

      {/* Filtres */}
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <Filter className="w-4 h-4 mr-2" />
          {showFilters ? 'Masquer' : 'Afficher'} les filtres
        </button>
        <button
          onClick={() => setShowFavorites(!showFavorites)}
          className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <Heart className="w-4 h-4 mr-2" />
          {showFavorites ? 'Masquer' : 'Afficher'} les favoris
        </button>
      </div>

      {/* Panneau de filtres */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
          <div className="space-y-4">
            {/* Catégories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Catégories
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedCategory === category
                        ? 'bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Types de ressources */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Types de ressources
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(resourceTypes).map(([type, { icon: Icon, label }]) => (
                  <button
                    key={type}
                    onClick={() => setSelectedCategory(label)}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                      selectedCategory === label
                        ? 'bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Liste des ressources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((resource) => (
          <button
            key={resource.id}
            onClick={() => onResourceSelect(resource)}
            className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {/* Icône du type de ressource */}
            <div className="absolute top-0 left-0 p-2">
              {resourceTypes[resource.type].icon && (
                <resourceTypes[resource.type].icon
                  className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors duration-300"
                />
              )}
            </div>

            {/* Informations */}
            <div className="p-4 bg-white dark:bg-gray-800">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                {resource.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {resource.description}
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{resource.category}</span>
                <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                  {resource.subject}
                </span>
                <span>{resource.level}</span>
              </div>
            </div>

            {/* Statistiques */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {resource.rating} ({resource.favorites})
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Download className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {resource.downloads}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => onSearch(searchQuery)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
        >
          <Search className="w-4 h-4 mr-2" />
          Rechercher
        </button>
        <button
          onClick={() => setShowFilters(true)}
          className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filtrer
        </button>
      </div>
    </div>
  );
};

export default ResourceLibrary;
