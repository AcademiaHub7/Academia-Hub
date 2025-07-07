import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, BookOpen, Download, Star } from 'lucide-react';
import { useFicheContext } from '../context/FicheContext';
import { Fiche, SUBJECTS, CLASS_LEVELS } from '../types';

const FicheLibrary: React.FC = () => {
  const { fiches, toggleFavorite } = useFicheContext();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFiches, setFilteredFiches] = useState<Fiche[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  // Filtrer les fiches validées uniquement
  useEffect(() => {
    let filtered = fiches.filter(fiche => fiche.status === 'validated');
    
    // Appliquer les filtres
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(fiche => 
        fiche.title.toLowerCase().includes(query) || 
        fiche.description.toLowerCase().includes(query)
      );
    }
    
    if (selectedSubject) {
      filtered = filtered.filter(fiche => fiche.subject === selectedSubject);
    }
    
    if (selectedLevel) {
      filtered = filtered.filter(fiche => fiche.level === selectedLevel);
    }
    
    setFilteredFiches(filtered);
  }, [fiches, searchQuery, selectedSubject, selectedLevel]);

  // Fonction pour obtenir le nom complet d'une matière
  const getSubjectName = (code: string): string => {
    const subject = SUBJECTS.find(s => s.value === code);
    return subject ? subject.label : code;
  };

  // Fonction pour obtenir le nom complet d'un niveau
  const getLevelName = (code: string): string => {
    const level = CLASS_LEVELS.find(l => l.value === code);
    return level ? level.label : code;
  };

  // Fonction pour formater la date
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Fonction pour télécharger une fiche (simulée)
  const handleDownload = (id: string) => {
    alert(`Téléchargement de la fiche ${id} à implémenter`);
  };

  // Fonction pour ajouter/retirer des favoris
  const handleToggleFavorite = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(id);
  };

  // Génération d'une couleur basée sur la matière
  const getSubjectColor = (subject: string): string => {
    const colors: Record<string, string> = {
      math: 'bg-blue-100 text-blue-800',
      french: 'bg-red-100 text-red-800',
      history: 'bg-amber-100 text-amber-800',
      physics: 'bg-purple-100 text-purple-800',
      biology: 'bg-green-100 text-green-800',
      english: 'bg-indigo-100 text-indigo-800',
      spanish: 'bg-orange-100 text-orange-800',
      german: 'bg-yellow-100 text-yellow-800',
      art: 'bg-pink-100 text-pink-800',
      music: 'bg-violet-100 text-violet-800',
      sport: 'bg-emerald-100 text-emerald-800',
      technology: 'bg-cyan-100 text-cyan-800'
    };
    
    return colors[subject] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Bibliothèque de fiches pédagogiques</h2>
      
      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 w-full rounded-md border border-gray-300 py-2 text-sm"
              placeholder="Rechercher une fiche..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select
            className="rounded-md border border-gray-300 py-2 text-sm"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
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
            className="rounded-md border border-gray-300 py-2 text-sm"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
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
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-sm text-gray-500">
              {filteredFiches.length} {filteredFiches.length > 1 ? 'fiches trouvées' : 'fiche trouvée'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              onClick={() => setViewMode('grid')}
              title="Vue en grille"
              aria-label="Changer en vue grille"
              role="button"
            >
              <Grid className="h-5 w-5 text-gray-600" />
            </button>
            <button 
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              onClick={() => setViewMode('list')}
              title="Vue en liste"
              aria-label="Changer en vue liste"
              role="button"
            >
              <List className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Affichage des fiches */}
      {filteredFiches.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow border border-gray-200">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune fiche trouvée</h3>
          <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFiches.map(fiche => (
            <a 
              key={fiche.id} 
              href={`#visualisation/${fiche.id}`}
              className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col"
              aria-label={`Voir les détails de la fiche ${fiche.title}`}
            >
              <div className="p-4 flex-1">
                <div className="flex items-start justify-between">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubjectColor(fiche.subject)}`}>
                    {getSubjectName(fiche.subject)}
                  </span>
                  <button 
                    className="text-gray-400 hover:text-yellow-500"
                    onClick={(e) => handleToggleFavorite(e, fiche.id)}
                    aria-label={`Marquer comme favori ${fiche.title}`}
                    role="button"
                  >
                    <Star className={`h-5 w-5 ${fiche.isFavorite ? 'text-yellow-400 fill-current' : ''}`} />
                  </button>
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-900 line-clamp-2">{fiche.title}</h3>
                <p className="mt-1 text-sm text-gray-500">Niveau {getLevelName(fiche.level)}</p>
                {fiche.description && (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3">{fiche.description}</p>
                )}
              </div>
              <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {formatDate(fiche.createdAt)}
                </div>
                <button 
                  className="text-blue-600 hover:text-blue-800"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDownload(fiche.id);
                  }}
                  aria-label={`Télécharger la fiche ${fiche.title}`}
                  title={`Télécharger la fiche ${fiche.title}`}
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Titre
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Matière
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Niveau
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFiches.map(fiche => (
                  <tr key={fiche.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <button 
                          className="mr-2 focus:outline-none" 
                          onClick={(e) => handleToggleFavorite(e, fiche.id)}
                        >
                          <Star 
                            className={`h-5 w-5 ${fiche.isFavorite ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        </button>
                        <a href={`#visualisation/${fiche.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                          {fiche.title}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubjectColor(fiche.subject)}`}>
                        {getSubjectName(fiche.subject)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getLevelName(fiche.level)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(fiche.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <a 
                          href={`#visualisation/${fiche.id}`} 
                          className="text-blue-600 hover:text-blue-900"
                          title="Voir"
                        >
                          <BookOpen className="h-5 w-5" />
                        </a>
                        <button 
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => handleDownload(fiche.id)}
                          title="Télécharger"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export { FicheLibrary };
