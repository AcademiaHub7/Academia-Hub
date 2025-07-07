import React, { useEffect, useState } from 'react';
import { Fiche } from '../types';
import { FicheStatus } from '../types';
import { useFicheContext } from '../context/FicheContext';
import { FicheValidationService } from '../../../services/validationService/FicheValidationService';
import { CompetencyService } from '../../../services/competencyService';
import { TemplateService } from '../../../services/templateService';
import { CheckCircle, XCircle } from 'lucide-react';

interface FicheValidationPanelProps {
  fiche: Fiche;
  onStatusChange?: (status: string) => void;
}

export const FicheValidationPanel: React.FC<FicheValidationPanelProps> = ({ fiche, onStatusChange }) => {
  const { updateFiche } = useFicheContext();
  const [validationResults, setValidationResults] = useState<{
    isValid: boolean;
    results: {
      [key: string]: {
        isValid: boolean;
        suggestions?: string[];
      };
    };
    score: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Règles de validation pour l'affichage
  const validationRules = [
    { id: 'competencies-types', name: 'Types de compétences' },
    { id: 'objectives-activities-coherence', name: 'Cohérence objectifs/activités' },
    { id: 'phases-mandatory', name: 'Phases obligatoires' },
    { id: 'pedagogical-progress', name: 'Progression pédagogique' },
    { id: 'workflow-status', name: 'État du workflow' }
  ];

  useEffect(() => {
    validateFiche();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fiche.id]);

  const validateFiche = async () => {
    setLoading(true);
    try {
      const validationService = new FicheValidationService(
        new CompetencyService(),
        new TemplateService()
      );
      const results = await validationService.validateFiche(fiche);
      setValidationResults(results);
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: FicheStatus) => {
    try {
      await updateFiche(fiche.id, { status: newStatus });
      onStatusChange?.(newStatus);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Validation en cours...</p>
      </div>
    );
  }

  if (!validationResults) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      {/* Score de qualité */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Score de qualité pédagogique</h3>
        <div className="flex items-center space-x-2">
          <div className="w-24 h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-600 rounded-full validation-score-bar validation-score-bar-fill"
              style={{ width: `${validationResults.score}%` }}
              role="progressbar"
              aria-valuenow={validationResults.score}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label={`Score de qualité pédagogique : ${validationResults.score}%`}
            ></div>
          </div>
          <span className="text-sm font-medium">
            {validationResults.score}%
          </span>
        </div>
      </div>

      {/* Résultats détaillés */}
      <div className="space-y-4">
        {Object.entries(validationResults.results).map(([ruleId, result]) => (
          <div key={ruleId} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">
                {result.isValid ? (
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500 mr-2" />
                )}
                {validationRules.find(r => r.id === ruleId)?.name}
              </h4>
              <span className="text-xs text-gray-500">
                {result.isValid ? 'Validé' : 'À corriger'}
              </span>
            </div>
            
            {result.suggestions && result.suggestions.length > 0 && (
              <div className="mt-2">
                <button
                  onClick={() => setShowSuggestions(prev => !prev)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                  aria-expanded={showSuggestions ? "true" : "false"}
                  aria-controls={`suggestions-${ruleId}`}
                >
                  {showSuggestions ? 'Masquer' : 'Afficher'} les suggestions
                </button>
                {showSuggestions && (
                  <ul id={`suggestions-${ruleId}`} className="mt-2 list-disc list-inside text-sm text-gray-600">
                    {result.suggestions?.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Actions de validation */}
      <div className="mt-6">
        <h4 className="text-sm font-medium mb-2">Actions de validation</h4>
        <div className="flex flex-wrap gap-2">
          {(['teacher_review', 'collegial_review', 'hierarchical_review', 'pedagogical_review', 'validated'] as FicheStatus[])
            .filter(status => status !== fiche.status)
            .map(status => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`px-4 py-2 rounded-md text-sm ${
                  status === 'validated' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
                } hover:bg-blue-700`}
                aria-label={status === 'validated' ? 'Valider la fiche' : `Passer au statut ${status.replace('_', ' ')}`}
              >
                {status === 'validated' ? 'Valider' : status.replace(/_/g, ' ').replace(/\w+/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1))}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

// Export nommé utilisé à la place de l'export par défaut
