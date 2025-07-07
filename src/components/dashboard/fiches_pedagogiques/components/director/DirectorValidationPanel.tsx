import React, { useState, useEffect } from 'react';
import { BookOpen, AlertCircle, CheckCircle2, History } from 'lucide-react';
import { DirectorValidationState, Annotation, Comment, CorrectionCode, ValidationHistory } from '../../types/DirectorValidationTypes';
import { PresetCommentsPanel } from './PresetCommentsPanel';
import { CorrectionCodesPanel } from './CorrectionCodesPanel';


interface DirectorValidationPanelProps {
  className?: string;
}

const DirectorValidationPanel: React.FC<DirectorValidationPanelProps> = ({ className }) => {
  const [statsExpanded, setStatsExpanded] = useState(false);
  const [showPresetComments, setShowPresetComments] = useState(false);
  const [showCorrectionCodes, setShowCorrectionCodes] = useState(false);
  const [activeFicheId, setActiveFicheId] = useState<string | undefined>(undefined);
  const [selectedCode, setSelectedCode] = useState<CorrectionCode | null>(null);

  // État local pour la validation
  const [validationState, setValidationState] = useState<DirectorValidationState>({
    comments: {} as Record<string, Comment[]>,
    pendingFiches: [],
    activeFicheId: undefined,
    annotations: {} as Record<string, Annotation[]>,
    recommendations: {} as Record<string, ValidationHistory[]>,
    history: [],
    statistics: {
      totalValidated: 0,
      totalPending: 0,
      averageTurnaround: 0
    },
    correctionCodes: []
  });

  // Mock data pour l'état initial
  useEffect(() => {
    const mockValidationState: DirectorValidationState = {
      comments: {
        'fiche-1': [
          { id: 'comment-1', text: 'Commentaire 1', timestamp: new Date().toISOString() }
        ]
      },
      pendingFiches: [
        { id: 'fiche-1', title: 'Fiche 1', teacher: 'Professeur 1', date: new Date().toISOString() },
        { id: 'fiche-2', title: 'Fiche 2', teacher: 'Professeur 2', date: new Date().toISOString() }
      ],
      activeFicheId: undefined,
      annotations: {
        'fiche-1': [
          { id: 'annotation-1', content: 'Annotation 1', timestamp: new Date().toISOString() }
        ]
      },
      recommendations: {
        'fiche-1': [
          { id: 'recommendation-1', text: 'Recommandation 1', timestamp: new Date().toISOString() }
        ]
      },
      history: [
        { id: 'history-1', action: 'validation', timestamp: new Date().toISOString() }
      ],
      statistics: {
        totalValidated: 10,
        totalPending: 5,
        averageTurnaround: 3
      }
    };

    setValidationState(mockValidationState);
  }, []);

  const handleFicheSelection = (ficheId: string) => {
    setActiveFicheId(ficheId);
  };

  const handleValidation = (isValid: boolean) => {
    if (!activeFicheId) return;

    setValidationState(prev => {
      const updatedFiches = prev.pendingFiches.filter(fiche => fiche.id !== activeFicheId);
      const updatedStats = {
        ...prev.statistics,
        totalValidated: isValid ? prev.statistics.totalValidated + 1 : prev.statistics.totalValidated,
        totalPending: prev.statistics.totalPending - 1
      };

      return {
        ...prev,
        pendingFiches: updatedFiches,
        activeFicheId: undefined,
        statistics: updatedStats,
        history: [
          ...prev.history,
          {
            id: `history-${Date.now()}`,
            ficheId: activeFicheId,
            version: 1,
            timestamp: new Date(),
            changes: {},
            status: isValid ? 'validated' : 'rejected',
            comments: []
          }
        ]
      };
    });
  };

  const handleCommentAdd = (comment: Comment) => {
    if (!activeFicheId) return;

    setValidationState(prev => ({
      ...prev,
      comments: {
        ...prev.comments,
        [activeFicheId!]: [...(prev.comments[activeFicheId!] || []), comment]
      }
    }));
  };

  const handleCommentRemove = (commentId: string) => {
    if (!activeFicheId) return;
    setValidationState(prev => ({
      ...prev,
      comments: {
        ...prev.comments,
        [activeFicheId!]: prev.comments[activeFicheId!]?.filter(c => c.id !== commentId) || []
      }
    }));
  };

  const handleCommentEdit = (comment: Comment) => {
    if (!activeFicheId) return;
    setValidationState(prev => ({
      ...prev,
      comments: {
        ...prev.comments,
        [activeFicheId!]: prev.comments[activeFicheId!]?.map(c => 
          c.id === comment.id ? comment : c
        ) || []
      }
    }));
  };

  const handleCodeSelect = (code: CorrectionCode) => {
    if (!activeFicheId) return;
    setSelectedCode(code);
  };

  const handleCodeRemove = (codeId: string) => {
    if (!activeFicheId) return;
    setValidationState(prev => ({
      ...prev,
      correctionCodes: prev.correctionCodes.filter(code => code.id !== codeId)
    }));
  };

  const handleCodeEdit = (code: CorrectionCode) => {
    if (!activeFicheId) return;
    setValidationState(prev => ({
      ...prev,
      correctionCodes: prev.correctionCodes.map(c => 
        c.id === code.id ? code : c
      )
    }));
  };

  const handleCodeCreate = (code: CorrectionCode) => {
    if (!activeFicheId) return;
    setValidationState(prev => ({
      ...prev,
      correctionCodes: [...prev.correctionCodes, code]
    }));
  };

  return (
    <div className={`director-validation-panel ${className || ''}`}>
      {/* Sidebar de statistiques */}
      <div className="stats-sidebar">
        <div className="stats-header">
          <h2>Statistiques de validation</h2>
          <button
            onClick={() => setStatsExpanded(!statsExpanded)}
            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg"
            aria-label="Afficher/masquer les statistiques de validation"
            aria-expanded={statsExpanded.toString()}
            role="button"
            tabIndex={0}
            title="Afficher/masquer les statistiques de validation"
          >
            <History />
            Statistiques
          </button>
        </div>
        {statsExpanded && (
          <div className="stats-details">
            <div className="stat-item">
              <CheckCircle2 className="stat-icon success" />
              <span>Fiches validées</span>
              <span className="stat-value">{validationState.statistics.totalValidated}</span>
            </div>
            <div className="stat-item">
              <AlertCircle className="stat-icon warning" />
              <span>En attente</span>
              <span className="stat-value">{validationState.statistics.totalPending}</span>
            </div>
            <div className="stat-item">
              <History className="stat-icon info" />
              <span>Délai moyen</span>
              <span className="stat-value">{validationState.statistics.averageTurnaround} jours</span>
            </div>
          </div>
        )}
      </div>

      {/* Liste des fiches */}
      <div className="fiches-list">
        <h3>Fiches en attente</h3>
        <div className="fiches-grid">
          {validationState.pendingFiches.map(fiche => (
            <div
              key={fiche.id}
              className="fiche-card"
              onClick={() => handleFicheSelection(fiche.id)}
              role="button"
              tabIndex={0}
              aria-label={`Fiche: ${fiche.title}`}
            >
              <div className="fiche-header">
                <h4>{fiche.title}</h4>
                <span className="fiche-status">En attente</span>
              </div>
              <div className="fiche-meta">
                <span className="teacher">{fiche.teacher}</span>
                <span className="date">{new Date(fiche.date).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interface d'annotation */}
      {validationState.activeFicheId && (
        <div className="annotation-interface">
          <div className="annotation-toolbar">
            <button
              onClick={() => setShowCorrectionCodes(!showCorrectionCodes)}
              className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg"
              aria-label="Afficher/masquer les codes de correction"
              aria-expanded={showCorrectionCodes.toString()}
              role="button"
              tabIndex={0}
              title="Afficher/masquer les codes de correction"
            >
              <History />
              Codes de correction
            </button>
            <button
              onClick={() => setShowPresetComments(!showPresetComments)}
              className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg"
              aria-label="Afficher/masquer les commentaires prédéfinis"
              aria-expanded={showPresetComments.toString()}
              role="button"
              tabIndex={0}
              title="Afficher/masquer les commentaires prédéfinis"
            >
              <BookOpen />
              Commentaires prédéfinis
            </button>
          </div>

          <div className="annotation-content">
            {/* TODO: Implémenter l'interface d'annotation */}
          </div>

          <div className="recommendations-panel">
            <h4>Recommandations</h4>
            {/* TODO: Afficher les recommandations */}
          </div>
        </div>
      )}

      {/* Panneau de commentaires prédéfinis */}
      {showPresetComments && (
        <div className="preset-comments-panel">
          <PresetCommentsPanel
            selectedComment={null}
            onCommentSelect={null}
            onCommentCreate={(text: string) => {
              if (!activeFicheId) return;
              const comment: Comment = {
                id: `preset-${Date.now()}`,
                text,
                timestamp: new Date(),
                author: 'directeur'
              };
              handleCommentAdd(comment);
            }}
            onCommentUpdate={handleCommentEdit}
            onCommentDelete={handleCommentRemove}
            isOpen={showPresetComments}
            onClose={() => setShowPresetComments(false)}
          />
        </div>
      )}

      {/* Panneau de codes de correction */}
      {showCorrectionCodes && (
        <div className="correction-codes-panel">
          <CorrectionCodesPanel
            selectedCode={selectedCode}
            onCodeSelect={handleCodeSelect}
            onCodeCreate={handleCodeCreate}
            onCodeUpdate={handleCodeEdit}
            onCodeDelete={handleCodeRemove}
          />
        </div>
      )}

      {/* Boutons d'action */}
      <div className="action-buttons">
        <button
          onClick={() => handleValidation(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          aria-label="Valider la fiche"
        >
          Valider
        </button>
        <button
          onClick={() => handleValidation(false)}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-4"
          aria-label="Rejeter la fiche"
        >
          Rejeter
        </button>
      </div>
    </div>
  );
};

export default DirectorValidationPanel;
