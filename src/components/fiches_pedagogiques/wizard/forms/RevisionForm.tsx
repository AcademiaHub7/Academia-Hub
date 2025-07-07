import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Plus, X } from 'lucide-react';
import { Template } from '../../templates/types';

interface RevisionFormProps {
  data: any;
  onChange: (data: any) => void;
}

const RevisionForm: React.FC<RevisionFormProps> = ({
  data,
  onChange
}) => {
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState('');
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleAddResult = () => {
    if (selectedResult) {
      onChange({
        ...data,
        resultats: [...data.resultats, selectedResult]
      });
      setSelectedResult('');
    }
  };

  const validateForm = () => {
    const errors: string[] = [];

    // Vérification des objectifs
    if (data.objectifs.length === 0) {
      errors.push('Aucun objectif défini');
    }

    // Vérification des compétences
    if (data.competences.length === 0) {
      errors.push('Aucune compétence sélectionnée');
    }

    // Vérification du déroulement
    if (data.phases.length === 0) {
      errors.push('Aucune phase définie');
    } else {
      const totalDuration = data.phases.reduce((sum, phase) => sum + phase.duree, 0);
      if (totalDuration < 30) {
        errors.push('La durée totale est trop courte');
      }
    }

    return errors;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        <CheckCircle className="w-4 h-4 inline-block mr-1" />
        Révision et Validation
      </h3>

      {/* Résultats attendus */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Résultats attendus
        </h4>
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={selectedResult}
            onChange={(e) => setSelectedResult(e.target.value)}
            className="flex-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
            placeholder="Rechercher un résultat..."
          />
          <button
            onClick={handleAddResult}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
          >
            Ajouter
          </button>
        </div>
        <div className="space-y-2">
          {data.resultats.map((result: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              <span className="text-gray-600 dark:text-gray-400">{result}</span>
              <button
                onClick={() => {
                  const newResults = [...data.resultats];
                  newResults.splice(index, 1);
                  onChange({ ...data, resultats: newResults });
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Évaluation */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Évaluation
        </h4>
        <textarea
          value={data.evaluation}
          onChange={(e) => handleInputChange('evaluation', e.target.value)}
          className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 h-32"
          placeholder="Description de l'évaluation..."
        />
      </div>

      {/* Remarques */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Remarques et suggestions
        </h4>
        <textarea
          value={data.remarques}
          onChange={(e) => handleInputChange('remarques', e.target.value)}
          className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 h-32"
          placeholder="Remarques et suggestions..."
        />
      </div>

      {/* Validation */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Validation finale
        </h4>
        <div className="space-y-2">
          {validateForm().map((error, index) => (
            <div key={index} className="flex items-center space-x-2 text-red-500">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          ))}
          {validateForm().length === 0 && (
            <div className="flex items-center space-x-2 text-green-500">
              <CheckCircle className="w-4 h-4" />
              <span>Tout est correct !</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevisionForm;
