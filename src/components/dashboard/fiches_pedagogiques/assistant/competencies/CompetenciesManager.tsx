import React, { useState, useEffect } from 'react';
import { Fiche, Competency } from '../../../types';
import { useCompetencyService } from '../../../services/competencyService';
import { useTemplateService } from '../../../services/templateService';

interface CompetenciesManagerProps {
  data: Fiche;
  onNext: (data: Partial<Fiche>) => void;
}

const CompetenciesManager: React.FC<CompetenciesManagerProps> = ({ data, onNext }) => {
  const { getCompetencies, validateCompetencies } = useCompetencyService();
  const { getTemplateCompetencies } = useTemplateService();
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [selectedCompetencies, setSelectedCompetencies] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Competency[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Charger les compétences au montage
  useEffect(() => {
    const loadCompetencies = async () => {
      const competencies = await getCompetencies(data.subject, data.level);
      setCompetencies(competencies);
    };
    loadCompetencies();
  }, [data.subject, data.level]);

  // Valider les compétences sélectionnées
  const validateCompetencySelection = async () => {
    setIsLoading(true);
    try {
      const validationResult = await validateCompetencies(selectedCompetencies);
      if (validationResult.completeness < 0.8) {
        // Suggérer des compétences complémentaires
        const suggested = await getTemplateCompetencies(data.subject, data.level);
        setSuggestions(suggested);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Erreur de validation des compétences:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer la sélection d'une compétence
  const handleCompetencySelect = (competencyId: string) => {
    setSelectedCompetencies(prev => 
      prev.includes(competencyId)
        ? prev.filter(id => id !== competencyId)
        : [...prev, competencyId]
    );
  };

  // Soumission de l'étape
  const handleSubmit = async () => {
    const isValid = await validateCompetencySelection();
    if (isValid) {
      onNext({ competencies: selectedCompetencies });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Compétences principales
        </label>
        <div className="space-y-4">
          {competencies.map((competency) => (
            <div key={competency.id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCompetencies.includes(competency.id)}
                onChange={() => handleCompetencySelect(competency.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                id={`competency-${competency.id}`}
                aria-labelledby={`competency-${competency.id}-label`}
                aria-checked={selectedCompetencies.includes(competency.id)}
              />
              <div className="ml-3">
                <label htmlFor={`competency-${competency.id}`} id={`competency-${competency.id}-label`}>
                  <p className="text-sm font-medium text-gray-900">
                  {competency.code} - {competency.description}
                </p>
                <p className="text-sm text-gray-500">
                  {competency.level} - {competency.subject}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {suggestions.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4" id="suggestions-title">
            Suggestions de compétences complémentaires
          </h3>
          <div className="space-y-4" role="group" aria-labelledby="suggestions-title">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedCompetencies.includes(suggestion.id)}
                  onChange={() => handleCompetencySelect(suggestion.id)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  id={`suggestion-${suggestion.id}`}
                  aria-labelledby={`suggestion-${suggestion.id}-label`}
                  aria-checked={selectedCompetencies.includes(suggestion.id)}
                />
                <div className="ml-3">
                  <label htmlFor={`suggestion-${suggestion.id}`} id={`suggestion-${suggestion.id}-label`}>
                    <span className="text-sm font-medium text-gray-900">
                      {suggestion.code} - {suggestion.description}
                    </span>
                    <span className="text-sm text-gray-500">
                      {suggestion.level} - {suggestion.subject}
                    </span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Validation en cours...' : 'Suivant'}
        </button>
      </div>
    </div>
  );
};

export default CompetenciesManager;
