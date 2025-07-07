import React, { useState } from 'react';
import { Folder, Star, MessageSquare, Heart, Plus, X } from 'lucide-react';

interface Collection {
  id: string;
  title: string;
  description: string;
  owner: string;
  resources: string[];
  rating: number;
  comments: number;
  favorites: number;
  tags: string[];
}

interface ResourceCollectionProps {
  collections: Collection[];
  onAddToCollection: (resourceId: string) => void;
  onCreateCollection: () => void;
  onSearch: (query: string) => void;
}

const ResourceCollection: React.FC<ResourceCollectionProps> = ({
  collections,
  onAddToCollection,
  onCreateCollection,
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Filtrer les collections
  const filteredCollections = collections.filter(collection =>
    collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.tags.some(tag => tag.includes(searchQuery.toLowerCase()))
  );

  // Créer une nouvelle collection
  const [newCollection, setNewCollection] = useState({
    title: '',
    description: '',
    tags: []
  });

  const handleCreateCollection = () => {
    if (newCollection.title.trim()) {
      // Ici, on devrait appeler une API pour créer la collection
      console.log('Création de la collection:', newCollection);
      setShowCreateForm(false);
      setNewCollection({ title: '', description: '', tags: [] });
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
          placeholder="Rechercher des collections..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
        />
      </div>

      {/* Boutons d'action */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Créer une collection
        </button>
        <button
          onClick={() => onSearch(searchQuery)}
          className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <Search className="w-4 h-4 mr-2" />
          Rechercher
        </button>
      </div>

      {/* Formulaire de création */}
      {showCreateForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Créer une nouvelle collection
            </h3>
            <button
              onClick={() => setShowCreateForm(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Titre
              </label>
              <input
                type="text"
                value={newCollection.title}
                onChange={(e) => setNewCollection({ ...newCollection, title: e.target.value })}
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={newCollection.description}
                onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 p-2"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={newCollection.tags.join(', ')}
                onChange={(e) => setNewCollection({ ...newCollection, tags: e.target.value.split(',') })}
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 p-2"
                placeholder="mathématiques, fractions, 6ème..."
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleCreateCollection}
                className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des collections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCollections.map((collection) => (
          <div
            key={collection.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {collection.title}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedCollection(collection)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Folder className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onAddToCollection(collection.id)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {collection.description}
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{collection.owner}</span>
              <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                {collection.resources.length} ressources
              </span>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>{collection.rating}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-pink-500" />
                <span>{collection.favorites}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceCollection;
