import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, MessageSquare, Eye } from 'lucide-react';
import { useFicheContext } from '../context/FicheContext';
import { Fiche, SUBJECTS } from '../types';

const FicheValidation: React.FC = () => {
  const { fiches, updateFicheStatus } = useFicheContext();
  const [pendingFiches, setPendingFiches] = useState<Fiche[]>([]);
  const [commentText, setCommentText] = useState<string>('');
  const [selectedFicheId, setSelectedFicheId] = useState<string | null>(null);
  const [showCommentForm, setShowCommentForm] = useState<boolean>(false);

  // Filtrer les fiches en attente de validation
  useEffect(() => {
    setPendingFiches(fiches.filter(fiche => fiche.status === 'pending'));
  }, [fiches]);

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

  // Gérer la validation d'une fiche
  const handleValidate = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir valider cette fiche ?')) {
      await updateFicheStatus(id, 'validated', 'current-user-id'); // Remplacer par l'ID de l'utilisateur actuel
    }
  };

  // Gérer le rejet d'une fiche
  const handleReject = async (id: string) => {
    setSelectedFicheId(id);
    setShowCommentForm(true);
  };

  // Soumettre le rejet avec commentaire
  const handleSubmitReject = async () => {
    if (selectedFicheId && commentText.trim()) {
      await updateFicheStatus(selectedFicheId, 'rejected', 'current-user-id'); // Remplacer par l'ID de l'utilisateur actuel
      // Ici, on devrait également ajouter le commentaire à la fiche
      // Cette fonctionnalité serait à implémenter dans le service
      
      setCommentText('');
      setSelectedFicheId(null);
      setShowCommentForm(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Validation des fiches pédagogiques</h2>
      
      {pendingFiches.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow border border-gray-200">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune fiche en attente de validation</h3>
          <p className="text-gray-500">Toutes les fiches ont été traitées</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingFiches.map(fiche => (
            <div key={fiche.id} className="bg-white rounded-lg shadow border border-gray-200 p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-lg font-medium text-gray-900">{fiche.title}</h3>
                  <div className="text-sm text-gray-500 mt-1">
                    <span>{getSubjectName(fiche.subject)}</span>
                    <span className="mx-2">•</span>
                    <span>Niveau {fiche.level}</span>
                    <span className="mx-2">•</span>
                    <span>Créée le {formatDate(fiche.createdAt)}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <a 
                    href={`#visualisation/${fiche.id}`} 
                    className="flex items-center px-3 py-1 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md"
                    title="Voir la fiche"
                  >
                    <Eye className="h-5 w-5" />
                  </a>
                  
                  <button 
                    className="flex items-center px-3 py-1 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md"
                    onClick={() => handleReject(fiche.id)}
                    title="Rejeter avec commentaire"
                  >
                    <MessageSquare className="h-5 w-5" />
                  </button>
                  
                  <button 
                    className="flex items-center px-3 py-1 text-red-600 hover:text-red-800 border border-red-300 rounded-md"
                    onClick={() => handleReject(fiche.id)}
                  >
                    <XCircle className="h-5 w-5 mr-1" /> Rejeter
                  </button>
                  
                  <button 
                    className="flex items-center px-3 py-1 text-green-600 hover:text-green-800 border border-green-300 rounded-md"
                    onClick={() => handleValidate(fiche.id)}
                  >
                    <CheckCircle className="h-5 w-5 mr-1" /> Valider
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Modal de commentaire pour rejet */}
      {showCommentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Motif du rejet</h3>
            <textarea
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              rows={5}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Veuillez expliquer pourquoi cette fiche est rejetée..."
            ></textarea>
            
            <div className="mt-4 flex justify-end space-x-3">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setShowCommentForm(false);
                  setSelectedFicheId(null);
                  setCommentText('');
                }}
              >
                Annuler
              </button>
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={handleSubmitReject}
                disabled={!commentText.trim()}
              >
                Confirmer le rejet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { FicheValidation };
