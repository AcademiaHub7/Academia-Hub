import React, { useState } from 'react';
import { Plus, X, CheckCircle, AlertCircle } from 'lucide-react';

interface Strategie {
  id: string;
  type: string;
  description: string;
  materiaux: string[];
  duree: string;
}

interface StrategieBuilderProps {
  strategies: Strategie[];
  onChange: (strategies: Strategie[]) => void;
}

const strategieTypes = [
  { id: '1', nom: 'Pédagogique', description: 'Stratégies pédagogiques générales' },
  { id: '2', nom: 'Différenciation', description: 'Stratégies d'adaptation' },
  { id: '3', nom: 'Evaluation', description: 'Stratégies d'évaluation' },
  { id: '4', nom: 'Gestion', description: 'Gestion de classe' },
];

const StrategieBuilder: React.FC<StrategieBuilderProps> = ({
  strategies,
  onChange
}) => {
  const [localStrategies, setLocalStrategies] = useState<Strategie[]>(strategies);

  const handleAddStrategie = () => {
    setLocalStrategies([
      ...localStrategies,
      {
        id: Date.now().toString(),
        type: strategieTypes[0].id,
        description: '',
        materiaux: [],
        duree: '00:00'
      }
    ]);
  };

  const handleRemoveStrategie = (index: number) => {
    setLocalStrategies(localStrategies.filter((_, i) => i !== index));
  };

  const handleStrategieChange = (index: number, field: keyof Strategie, value: any) => {
    setLocalStrategies(
      localStrategies.map((strategie, i) =>
        i === index ? { ...strategie, [field]: value } : strategie
      )
    );
  };

  const handleMateriauxChange = (strategieIndex: number, materiaux: string[]) => {
    setLocalStrategies(
      localStrategies.map((strategie, i) =>
        i === strategieIndex ? { ...strategie, materiaux } : strategie
      )
    );
  };

  const validateStrategies = () => {
    const validStrategies = localStrategies.filter(strategie =>
      strategie.description.trim() !== '' && strategie.type !== ''
    );
    onChange(validStrategies);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {localStrategies.map((strategie, index) => (
          <div
            key={strategie.id}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Stratégie {index + 1}
              </h4>
              <button
                onClick={() => handleRemoveStrategie(index)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type de stratégie
                </label>
                <select
                  value={strategie.type}
                  onChange={(e) => handleStrategieChange(index, 'type', e.target.value)}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
                >
                  {strategieTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Durée
                </label>
                <input
                  type="time"
                  value={strategie.duree}
                  onChange={(e) => handleStrategieChange(index, 'duree', e.target.value)}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={strategie.description}
                onChange={(e) => handleStrategieChange(index, 'description', e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 h-32 resize-none"
                placeholder="Description détaillée de la stratégie..."
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Matériaux nécessaires
              </label>
              <div className="space-y-2">
                {strategie.materiaux.map((materiel, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={materiel}
                      onChange={(e) => {
                        const newMateriaux = [...strategie.materiaux];
                        newMateriaux[i] = e.target.value;
                        handleMateriauxChange(index, newMateriaux);
                      }}
                      className="flex-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    />
                    <button
                      onClick={() => {
                        const newMateriaux = strategie.materiaux.filter((_, idx) => idx !== i);
                        handleMateriauxChange(index, newMateriaux);
                      }}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newMateriaux = [...strategie.materiaux, ''];
                    handleMateriauxChange(index, newMateriaux);
                  }}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un matériel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handleAddStrategie}
          className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une stratégie
        </button>
        <button
          onClick={validateStrategies}
          className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Valider les stratégies
        </button>
      </div>

      {localStrategies.some(strategie =>
        strategie.description.trim() === '' || strategie.type === ''
      ) && (
        <p className="mt-2 text-sm text-red-500">
          <AlertCircle className="w-4 h-4 inline-block mr-1" />
          Certaines stratégies sont incomplètes
        </p>
      )}
    </div>
  );
};

export default StrategieBuilder;
