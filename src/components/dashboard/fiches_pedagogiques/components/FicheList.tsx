import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal, Star, Edit, Eye, Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useFicheContext } from '../context/FicheContext';
import { Fiche, SUBJECTS, FicheViewMode } from '../types';

interface FicheListProps {
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  selectedFicheId?: string;
  setSelectedFicheId?: React.Dispatch<React.SetStateAction<string | undefined>>;
  viewMode?: FicheViewMode;
  setViewMode?: React.Dispatch<React.SetStateAction<FicheViewMode>>;
}

const FicheList: React.FC<FicheListProps> = ({ 
  onEdit, 
  onView, 
  selectedFicheId, 
  setSelectedFicheId, 
  viewMode = 'list', 
  setViewMode 
}) => {
  const { fiches, isLoading, toggleFavorite, deleteFiche, updateFicheStatus } = useFicheContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = fiches.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(fiches.length / itemsPerPage);

  // Fonction pour obtenir le nom complet d'une matière
  const getSubjectName = (code: string): string => {
    const subject = SUBJECTS.find(s => s.value === code);
    return subject ? subject.label : code;
  };

  // Fonction pour formater la date
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Gestion du menu d'actions
  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  // Fermer le dropdown si on clique ailleurs
  React.useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Gestion des actions
  const handleEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onEdit(id);
    setActiveDropdown(null);
  };

  const handleView = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onView(id);
    setActiveDropdown(null);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette fiche ?')) {
      await deleteFiche(id);
    }
    setActiveDropdown(null);
  };

  const handleToggleFavorite = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await toggleFavorite(id);
    setActiveDropdown(null);
  };

  const handleStatusChange = async (e: React.MouseEvent, id: string, status: Fiche['status']) => {
    e.stopPropagation();
    await updateFicheStatus(id, status, 'current-user-id'); // Remplacer par l'ID de l'utilisateur actuel
    setActiveDropdown(null);
  };

  // Obtenir la couleur et l'icône pour le statut
  const getStatusInfo = (status: Fiche['status']) => {
    switch (status) {
      case 'validated':
        return { color: 'text-green-500', bg: 'bg-green-100', icon: <CheckCircle className="h-4 w-4" /> };
      case 'pending':
        return { color: 'text-yellow-500', bg: 'bg-yellow-100', icon: <AlertCircle className="h-4 w-4" /> };
      case 'rejected':
        return { color: 'text-red-500', bg: 'bg-red-100', icon: <XCircle className="h-4 w-4" /> };
      case 'draft':
      default:
        return { color: 'text-gray-500', bg: 'bg-gray-100', icon: <AlertCircle className="h-4 w-4" /> };
    }
  };

  // Traduction des statuts
  const translateStatus = (status: Fiche['status']) => {
    switch (status) {
      case 'validated': return 'Validée';
      case 'pending': return 'En attente';
      case 'rejected': return 'Rejetée';
      case 'draft': return 'Brouillon';
      default: return status;
    }
  };

  // Fonction pour changer le mode d'affichage
  const changeViewMode = (mode: FicheViewMode) => {
    if (setViewMode) {
      setViewMode(mode);
    }
  };

  // Fonction pour sélectionner une fiche
  const selectFiche = (id: string) => {
    if (setSelectedFicheId) {
      setSelectedFicheId(id);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Liste des fiches pédagogiques</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => changeViewMode('list')} 
            className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            aria-pressed={viewMode === 'list'}
          >
            Liste
          </button>
          <button 
            onClick={() => changeViewMode('grid')} 
            className={`px-3 py-1 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            aria-pressed={viewMode === 'grid'}
          >
            Grille
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement des fiches...</p>
        </div>
      ) : fiches.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow border border-gray-200">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune fiche trouvée</h3>
          <p className="text-gray-500">Modifiez vos filtres ou créez une nouvelle fiche</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
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
                      Statut
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((fiche) => {
                    const statusInfo = getStatusInfo(fiche.status);
                    
                    return (
                      <tr 
                        key={fiche.id} 
                        className={`hover:bg-gray-50 cursor-pointer ${selectedFicheId === fiche.id ? 'bg-blue-50' : ''}`} 
                        onClick={() => {
                          selectFiche(fiche.id);
                          handleView(new MouseEvent('click') as React.MouseEvent<HTMLElement>, fiche.id);
                        }}
                        aria-selected={selectedFicheId === fiche.id}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <button 
                              className="mr-2 focus:outline-none" 
                              onClick={(e) => handleToggleFavorite(e, fiche.id)}
                              aria-label="Marquer comme favori"
                              role="button"
                            >
                              <Star 
                                className={`h-5 w-5 ${fiche.isFavorite ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            </button>
                            <div className="text-sm font-medium text-gray-900">{fiche.title}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{getSubjectName(fiche.subject)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{fiche.level}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(fiche.date)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                            {statusInfo.icon}
                            <span className="ml-1">{translateStatus(fiche.status)}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="relative" onClick={(e) => e.stopPropagation()}>
                            <button 
                              className="text-gray-400 hover:text-gray-600 focus:outline-none"
                              onClick={() => toggleDropdown(fiche.id)}
                              aria-label="Options pour la fiche"
                              role="button"
                              aria-expanded={activeDropdown === fiche.id}
                              aria-controls={`fiche-options-menu-${fiche.id}`}
                            >
                              <MoreHorizontal className="h-5 w-5" />
                            </button>
                            
                            {activeDropdown === fiche.id && (
                              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                <div className="py-1" role="menu" aria-orientation="vertical">
                                  <button
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    onClick={(e) => handleView(e, fiche.id)}
                                    aria-label="Visualiser la fiche"
                                    role="button"
                                  >
                                    <Eye className="h-4 w-4 mr-2" /> Visualiser
                                  </button>
                                  <button
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    onClick={(e) => handleEdit(e, fiche.id)}
                                    aria-label="Modifier la fiche"
                                    role="button"
                                  >
                                    <Edit className="h-4 w-4 mr-2" /> Modifier
                                  </button>
                                  <button
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    onClick={(e) => handleToggleFavorite(e, fiche.id)}
                                    aria-label={fiche.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                                    role="button"
                                  >
                                    <Star className={`h-4 w-4 mr-2 ${fiche.isFavorite ? 'text-yellow-400 fill-current' : ''}`} />
                                    {fiche.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                                  </button>
                                  
                                  <hr className="my-1" />
                                  
                                  {fiche.status !== 'validated' && (
                                    <button
                                      className="flex items-center px-4 py-2 text-sm text-green-700 hover:bg-gray-100 w-full text-left"
                                      onClick={(e) => handleStatusChange(e, fiche.id, 'validated')}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" /> Marquer comme validée
                                    </button>
                                  )}
                                  
                                  {fiche.status !== 'pending' && (
                                    <button
                                      className="flex items-center px-4 py-2 text-sm text-yellow-700 hover:bg-gray-100 w-full text-left"
                                      onClick={(e) => handleStatusChange(e, fiche.id, 'pending')}
                                    >
                                      <AlertCircle className="h-4 w-4 mr-2" /> Marquer en attente
                                    </button>
                                  )}
                                  
                                  <hr className="my-1" />
                                  
                                  <button
                                    className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100 w-full text-left"
                                    onClick={(e) => handleDelete(e, fiche.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" /> Supprimer
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg mt-4">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Précédent
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Suivant
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Affichage de <span className="font-medium">{indexOfFirstItem + 1}</span> à{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, fiches.length)}
                    </span>{' '}
                    sur <span className="font-medium">{fiches.length}</span> résultats
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Précédent</span>
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          currentPage === index + 1
                            ? 'bg-blue-50 border-blue-500 text-blue-600 z-10'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        } text-sm font-medium`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Suivant</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export { FicheList };
