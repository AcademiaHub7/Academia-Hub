import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Bookmark, 
  Clock, 
  Filter 
} from 'lucide-react';

interface NavigationItem {
  id: string;
  title: string;
  type: 'SA' | 'sequence' | 'fiche';
  children?: NavigationItem[];
  bookmarked?: boolean;
  lastVisited?: string;
}

interface ContextualNavigationProps {
  items: NavigationItem[];
  onNavigate: (item: NavigationItem) => void;
  onFilter: (filters: any) => void;
  onSearch: (query: string) => void;
}

const ContextualNavigation: React.FC<ContextualNavigationProps> = ({
  items,
  onNavigate,
  onFilter,
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    matiere: '',
    classe: '',
    statut: '',
    dateRange: ['', '']
  });
  const [showFilters, setShowFilters] = useState(false);

  // Statuts visuels
  const statusColors = {
    brouillon: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300',
    soumise: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300',
    validée: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300',
    rejetée: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300',
    à_corriger: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-300'
  };

  // Recherche intelligente
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  // Gestion des filtres
  const handleFilterChange = (field: keyof typeof filters, value: string | string[]) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    onFilter({ ...filters, [field]: value });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Barre de recherche */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Rechercher une fiche..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Filtres */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 mb-4"
        >
          <Filter className="w-4 h-4 mr-2" />
          {showFilters ? 'Masquer' : 'Afficher'} les filtres
        </button>
        {showFilters && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Matière
              </label>
              <select
                value={filters.matiere}
                onChange={(e) => handleFilterChange('matiere', e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 p-2"
              >
                <option value="">Toutes les matières</option>
                {/* Options de matières */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Classe
              </label>
              <select
                value={filters.classe}
                onChange={(e) => handleFilterChange('classe', e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 p-2"
              >
                <option value="">Toutes les classes</option>
                {/* Options de classes */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Statut
              </label>
              <select
                value={filters.statut}
                onChange={(e) => handleFilterChange('statut', e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 p-2"
              >
                <option value="">Tous les statuts</option>
                <option value="brouillon">Brouillon</option>
                <option value="soumise">Soumise</option>
                <option value="validée">Validée</option>
                <option value="rejetée">Rejetée</option>
                <option value="à_corriger">À corriger</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Arbre des séquences
          </h3>
          {items.map((item) => (
            <div
              key={item.id}
              className="space-y-2"
            >
              <div
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => onNavigate(item)}
              >
                <div className="flex items-center space-x-2">
                  {item.type === 'SA' && (
                    <BookOpen className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {item.title}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.bookmarked && (
                    <Bookmark className="w-4 h-4 text-yellow-500" />
                  )}
                  {item.lastVisited && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(item.lastVisited).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {item.children && item.children.length > 0 && (
                <div className="pl-4">
                  {item.children.map((child) => (
                    <div
                      key={child.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => onNavigate(child)}
                    >
                      <div className="flex items-center space-x-2">
                        {child.type === 'sequence' && (
                          <BookOpen className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {child.title}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {child.bookmarked && (
                          <Bookmark className="w-4 h-4 text-yellow-500" />
                        )}
                        {child.lastVisited && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(child.lastVisited).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContextualNavigation;
