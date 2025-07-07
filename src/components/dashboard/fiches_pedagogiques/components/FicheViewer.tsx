import React, { useEffect, useState } from 'react';
import { ArrowLeft, Download, Printer, Star, MessageSquare, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useFicheContext } from '../context/FicheContext';
import { Fiche, SUBJECTS, FicheStatus } from '../types';
import { FicheValidationPanel } from '../validation/FicheValidationPanel';

interface FicheViewerProps {
  ficheId: string;
  onBack: () => void;
  selectedFiche: Fiche | null;
  error: string | null;
  updateFiche: (id: string, updates: Partial<Fiche>) => void;
}

// Types pour gérer les différentes structures possibles des données
interface ObjectiveType {
  description: string;
  [key: string]: any;
}

interface ResourceType {
  title: string;
  description?: string;
  type?: string;
  url?: string;
  [key: string]: any;
}

interface CommentType {
  author: string;
  text: string;
  createdAt?: Date | string;
  date?: Date | string;
  [key: string]: any;
}

export const FicheViewer: React.FC<FicheViewerProps> = ({ ficheId, onBack, selectedFiche, error, updateFiche }) => {
  const { getFicheById, toggleFavorite } = useFicheContext();
  const [isLoading, setIsLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);

  // Fonctions de gestion des actions
  const handleToggleFavorite = () => {
    if (!selectedFiche) return;
    toggleFavorite(selectedFiche.id);
  };

  const handleDownload = () => {
    // TODO: Implémenter le téléchargement en PDF
    console.log('Téléchargement de la fiche', selectedFiche?.id);
  };

  const handlePrint = () => {
    // TODO: Implémenter l'impression
    console.log('Impression de la fiche', selectedFiche?.id);
  };

  // Fonctions utilitaires
  const getSubjectName = (code: string): string => {
    const subject = SUBJECTS.find(s => s.value === code);
    return subject ? subject.label : 'Matière inconnue';
  };

  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return 'Date non spécifiée';
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusInfo = (status: FicheStatus) => {
    switch (status) {
      case 'validated':
        return { color: 'text-green-500', bg: 'bg-green-100', icon: <CheckCircle className="h-5 w-5" /> };
      case 'pending':
        return { color: 'text-yellow-500', bg: 'bg-yellow-100', icon: <AlertCircle className="h-5 w-5" /> };
      case 'rejected':
        return { color: 'text-red-500', bg: 'bg-red-100', icon: <XCircle className="h-5 w-5" /> };
      case 'draft':
      default:
        return { color: 'text-gray-500', bg: 'bg-gray-100', icon: <AlertCircle className="h-5 w-5" /> };
    }
  };

  const translateStatus = (status: FicheStatus): string => {
    switch (status) {
      case 'validated': return 'Validée';
      case 'pending': return 'En attente';
      case 'rejected': return 'Rejetée';
      case 'draft': return 'Brouillon';
      default: return status;
    }
  };

  useEffect(() => {
    const fetchFiche = async () => {
      try {
        setIsLoading(true);
        await getFicheById(ficheId);
        // Utiliser selectedFiche du props au lieu de l'état local
      } catch (err) {
        console.error('Erreur lors du chargement de la fiche:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiche();
  }, [ficheId, getFicheById]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  if (!selectedFiche) {
    return <div className="text-center text-gray-600">Fiche non trouvée</div>;
  }

  // Fonction pour traiter les objectifs qui peuvent être des chaînes ou des objets
  const renderObjectives = () => {
    if (!selectedFiche.objectives || selectedFiche.objectives.length === 0) {
      return <p className="text-gray-500 italic">Aucun objectif défini</p>;
    }

    return (
      <ul className="list-disc pl-5 space-y-2">
        {selectedFiche.objectives.map((objective, index) => {
          // Gérer les différents formats possibles d'objectifs
          const description = typeof objective === 'string' 
            ? objective 
            : (objective as ObjectiveType).description || 'Objectif sans description';
          
          return (
            <li key={index} className="text-gray-700">
              {description}
            </li>
          );
        })}
      </ul>
    );
  };

  // Fonction pour traiter les ressources qui peuvent être des chaînes ou des objets
  const renderResources = () => {
    if (!selectedFiche.resources || selectedFiche.resources.length === 0) {
      return <p className="text-gray-500 italic">Aucune ressource définie</p>;
    }

    return (
      <ul className="list-disc pl-5 space-y-3">
        {selectedFiche.resources.map((resource, index) => {
          // Gérer les différents formats possibles de ressources
          if (typeof resource === 'string') {
            return (
              <li key={index} className="text-gray-700">
                {resource}
              </li>
            );
          } else {
            const resourceObj = resource as ResourceType;
            return (
              <li key={index} className="text-gray-700">
                <div className="font-medium">{resourceObj.title}</div>
                {resourceObj.description && (
                  <div className="text-sm text-gray-600">{resourceObj.description}</div>
                )}
                {resourceObj.type && (
                  <div className="text-xs text-gray-500 mt-1">Type: {resourceObj.type}</div>
                )}
                {resourceObj.url && (
                  <a href={resourceObj.url} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-500 hover:underline text-sm block mt-1">
                    Accéder à la ressource
                  </a>
                )}
              </li>
            );
          }
        })}
      </ul>
    );
  };

  // Fonction pour traiter les commentaires
  const renderComments = () => {
    if (!selectedFiche.comments || selectedFiche.comments.length === 0) {
      return <p className="text-gray-500 italic">Aucun commentaire</p>;
    }

    return (
      <div className="space-y-4">
        {selectedFiche.comments.map((comment, index) => {
          const commentObj = comment as CommentType;
          const commentDate = commentObj.createdAt || commentObj.date;
          
          return (
            <div key={index} className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-start">
                <div className="font-medium">{commentObj.author}</div>
                {commentDate && (
                  <div className="text-xs text-gray-500">{formatDate(commentDate)}</div>
                )}
              </div>
              <div className="mt-2 text-gray-700">{commentObj.text}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* En-tête avec actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center">
          <button 
            className="mr-4 text-gray-600 hover:text-gray-900"
            onClick={onBack}
            title="Retour"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-semibold">Fiche pédagogique</h2>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            className="flex items-center px-3 py-1 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md"
            onClick={handleToggleFavorite}
            title={selectedFiche.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Star className={`h-5 w-5 ${selectedFiche.isFavorite ? 'text-yellow-400 fill-current' : ''}`} />
          </button>
          
          <button 
            className="flex items-center px-3 py-1 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md"
            onClick={() => setShowComments(!showComments)}
            title="Afficher/masquer les commentaires"
          >
            <MessageSquare className="h-5 w-5" />
            {selectedFiche.comments && selectedFiche.comments.length > 0 && (
              <span className="ml-1 text-sm">{selectedFiche.comments.length}</span>
            )}
          </button>
          
          <button 
            onClick={handleDownload}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            title="Télécharger la fiche en PDF"
          >
            <Download className="-ml-1 mr-2 h-5 w-5" />
            Télécharger
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            title="Imprimer la fiche"
          >
            <Printer className="-ml-1 mr-2 h-5 w-5" />
            Imprimer
          </button>
        </div>
      </div>

      {/* Contenu */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {/* Informations principales */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">{selectedFiche.title}</h1>
              <div className={`${getStatusInfo(selectedFiche.status).bg} px-3 py-1 rounded-full`}>
                <div className="flex items-center">
                  {getStatusInfo(selectedFiche.status).icon}
                  <span className={`ml-1 ${getStatusInfo(selectedFiche.status).color}`}>
                    {translateStatus(selectedFiche.status)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <div className="text-sm text-gray-500">Matière</div>
                <div className="font-medium">{getSubjectName(selectedFiche.subject)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Niveau</div>
                <div className="font-medium">{selectedFiche.level}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Durée</div>
                <div className="font-medium">{selectedFiche.duration}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Date de création</div>
                <div className="font-medium">{formatDate(selectedFiche.createdAt)}</div>
              </div>
            </div>

            {/* Panneau de validation */}
            <div className="mt-6 border-t pt-4">
              <div className={`flex items-center ${getStatusInfo(selectedFiche.status).color}`}>
                {getStatusInfo(selectedFiche.status).icon}
                <span className="ml-2 font-medium">
                  {translateStatus(selectedFiche.status)}
                </span>
              </div>
              
              <FicheValidationPanel 
                fiche={selectedFiche} 
                onStatusChange={(newStatus: FicheStatus) => {
                  updateFiche(selectedFiche.id, { status: newStatus });
                }} 
              />
            </div>
          </div>

          {/* Objectifs */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Objectifs pédagogiques</h3>
            {renderObjectives()}
          </div>

          {/* Contenu */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Contenu</h3>
            <div className="prose max-w-none">
              {selectedFiche.content || <p className="text-gray-500 italic">Aucun contenu défini</p>}
            </div>
          </div>

          {/* Ressources */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Ressources</h3>
            {renderResources()}
          </div>

          {/* Commentaires */}
          {showComments && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Commentaires</h3>
              {renderComments()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Export nommé utilisé à la place de l'export par défaut
