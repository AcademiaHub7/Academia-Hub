import React from 'react';
import { Search, Filter, Bookmark, History } from 'lucide-react';
import { useFicheContext } from '../context/FicheContext';
import { SUBJECTS, CLASS_LEVELS, STATUS_OPTIONS, PERIOD_OPTIONS } from '../types';

interface FicheSidebarProps {
  onSearchChange: (value: string) => void;
  searchQuery: string;
}

const FicheSidebar: React.FC<FicheSidebarProps> = ({ onSearchChange, searchQuery }) => {
  const { filters, setFilters } = useFicheContext();

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleFavoriteToggle = () => {
    setFilters({ ...filters, favorite: !filters.favorite, recent: false });
  };

  const handleRecentToggle = () => {
    setFilters({ ...filters, recent: !filters.recent, favorite: false });
  };

  return (
    <div className="w-64 border-r border-gray-200 p-4 flex flex-col h-full">
      {/* Barre de recherche */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="pl-10 w-full rounded-md border border-gray-300 py-2 text-sm"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filtres */}
      <div className="mb-4">
        <h3 className="font-medium text-sm mb-2 flex items-center">
          <Filter className="h-4 w-4 mr-2" /> Filtres
        </h3>
        <div className="space-y-2">
          <select
            className="w-full rounded-md border border-gray-300 py-1 text-sm"
            value={filters.subject}
            onChange={(e) => handleFilterChange('subject', e.target.value)}
            aria-label="Sélectionner la matière"
            aria-required="false"
          >
            <option value="">Toutes les matières</option>
            {SUBJECTS.map(subject => (
              <option key={subject.value} value={subject.value}>
                {subject.label}
              </option>
            ))}
          </select>
          
          <select
            className="w-full rounded-md border border-gray-300 py-1 text-sm"
            value={filters.class}
            onChange={(e) => handleFilterChange('class', e.target.value)}
            aria-label="Sélectionner le niveau de classe"
            aria-required="false"
          >
            <option value="">Tous les niveaux</option>
            {CLASS_LEVELS.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
          
          <select
            className="w-full rounded-md border border-gray-300 py-1 text-sm"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            aria-label="Sélectionner le statut"
            aria-required="false"
          >
            <option value="">Tous les statuts</option>
            {STATUS_OPTIONS.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          <select
            className="w-full rounded-md border border-gray-300 py-1 text-sm"
            value={filters.period}
            onChange={(e) => handleFilterChange('period', e.target.value)}
            aria-label="Sélectionner la période"
            aria-required="false"
          >
            {PERIOD_OPTIONS.map(period => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation contextuelle */}
      <div className="mb-4">
        <h3 className="font-medium text-sm mb-2">Navigation</h3>
        <ul className="space-y-1">
          <li>
            <button 
              className={`flex items-center w-full px-2 py-1 text-sm rounded ${
                filters.favorite ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
              onClick={handleFavoriteToggle}
            >
              <Bookmark className={`h-4 w-4 mr-2 ${filters.favorite ? 'text-blue-500' : 'text-gray-500'}`} />
              <span>Favoris</span>
            </button>
          </li>
          <li>
            <button 
              className={`flex items-center w-full px-2 py-1 text-sm rounded ${
                filters.recent ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
              onClick={handleRecentToggle}
            >
              <History className={`h-4 w-4 mr-2 ${filters.recent ? 'text-blue-500' : 'text-gray-500'}`} />
              <span>Récents</span>
            </button>
          </li>
        </ul>
      </div>

      {/* Réinitialiser les filtres */}
      <div className="mt-auto">
        <button 
          className="w-full px-3 py-1 text-sm text-gray-600 hover:text-blue-600 hover:underline"
          onClick={() => setFilters({
            subject: '',
            class: '',
            status: '',
            period: 'all',
            search: '',
            favorite: false,
            recent: false
          })}
        >
          Réinitialiser les filtres
        </button>
      </div>
    </div>
  );
};

export { FicheSidebar };
