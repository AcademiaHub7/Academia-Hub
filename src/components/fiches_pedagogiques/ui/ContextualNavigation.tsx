import React, { useState, useEffect } from 'react';
import { Folder, FileText, Search, Bookmark, Clock } from 'lucide-react';

interface NavigationItem {
  id: string;
  title: string;
  type: 'sequence' | 'sa' | 'fiche';
  children?: NavigationItem[];
  lastVisited?: string;
  bookmarked?: boolean;
}

interface ContextualNavigationProps {
  currentPath: string[];
  onNavigate: (path: string[]) => void;
  onSearch: (query: string) => void;
  onBookmark: (id: string, bookmarked: boolean) => void;
}

const ContextualNavigation: React.FC<ContextualNavigationProps> = ({
  currentPath,
  onNavigate,
  onSearch,
  onBookmark
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);

  // Structure de navigation (exemples)
  const navigationTree: NavigationItem[] = [
    {
      id: 'sequence1',
      title: 'Séquence 1 - Les nombres',
      type: 'sequence',
      children: [
        {
          id: 'sa1',
          title: 'SA1 - Les fractions',
          type: 'sa',
          children: [
            {
              id: 'fiche1',
              title: 'Introduction aux fractions',
              type: 'fiche',
              bookmarked: true
            },
            {
              id: 'fiche2',
              title: 'Opérations avec les fractions',
              type: 'fiche'
            }
          ]
        },
        {
          id: 'sa2',
          title: 'SA2 - Les nombres décimaux',
          type: 'sa',
          children: [
            {
              id: 'fiche3',
              title: 'Introduction aux décimaux',
              type: 'fiche'
            },
            {
              id: 'fiche4',
              title: 'Opérations avec les décimaux',
              type: 'fiche'
            }
          ]
        }
      ]
    },
    {
      id: 'sequence2',
      title: 'Séquence 2 - La géométrie',
      type: 'sequence',
      children: [
        {
          id: 'sa3',
          title: 'SA3 - Les figures planes',
          type: 'sa',
          children: [
            {
              id: 'fiche5',
              title: 'Les triangles',
              type: 'fiche'
            },
            {
              id: 'fiche6',
              title: 'Les quadrilatères',
              type: 'fiche'
            }
          ]
        }
      ]
    }
  ];

  // Gestion de l'historique de navigation
  useEffect(() => {
    if (currentPath.length > 0) {
      setNavigationHistory(prev => [
        ...prev,
        currentPath.join('/')
      ].slice(-10)); // Garder les 10 dernières entrées
    }
  }, [currentPath]);

  // Filtrer les éléments selon la recherche
  const filteredItems = (items: NavigationItem[], query: string) =>
    items.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      (item.children && item.children.some(child =>
        child.title.toLowerCase().includes(query.toLowerCase())
      ))
    );

  // Trouver l'élément actif
  const findActiveItem = (items: NavigationItem[], path: string[]) =>
    items.find(item =>
      item.id === path[0] ||
      (item.children && item.children.some(child =>
        findActiveItem([child], path.slice(1))
      ))
    );

  // Rendre la structure de navigation
  const renderNavigation = (items: NavigationItem[], level: number = 0) => (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="pl-4">
          <div
            className={`flex items-center space-x-2 ${
              currentPath.includes(item.id)
                ? 'bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-300'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            } p-2 rounded-lg cursor-pointer`}
            onClick={() => {
              if (item.type === 'fiche') {
                onNavigate([...currentPath.slice(0, level), item.id]);
              }
            }}
          >
            {item.type === 'sequence' && <Folder className="w-4 h-4" />}
            {item.type === 'sa' && <FileText className="w-4 h-4" />}
            {item.type === 'fiche' && <FileText className="w-4 h-4" />}
            <span>{item.title}</span>
            {item.bookmarked && (
              <Bookmark className="w-4 h-4 text-yellow-500" />
            )}
            {item.lastVisited && (
              <Clock className="w-4 h-4 text-gray-400" />
            )}
          </div>
          {item.children && item.children.length > 0 && (
            <div className="pl-4">
              {renderNavigation(item.children, level + 1)}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      {/* Barre de recherche */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher dans la navigation..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Structure de navigation
        </h3>
        {renderNavigation(
          searchQuery ? filteredItems(navigationTree, searchQuery) : navigationTree
        )}
      </div>

      {/* Historique */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <Clock className="w-4 h-4" />
          <span>{showHistory ? 'Masquer' : 'Afficher'} l'historique</span>
        </button>
        {showHistory && (
          <div className="mt-2 space-y-2">
            {navigationHistory.map((path, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700"
              >
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {path.split('/').join(' > ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContextualNavigation;
