import React, { useState } from 'react';
import { Plus, X, Clock, CheckCircle } from 'lucide-react';

interface Phase {
  titre: string;
  duree: string;
  description: string;
  materiaux: string[];
}

interface DeroulementBuilderProps {
  deroulement: Phase[];
  onChange: (deroulement: Phase[]) => void;
}

const DeroulementBuilder: React.FC<DeroulementBuilderProps> = ({
  deroulement,
  onChange
}) => {
  const [phases, setPhases] = useState<Phase[]>(deroulement);

  const handleAddPhase = () => {
    setPhases([...phases, { titre: '', duree: '00:00', description: '', materiaux: [] }]);
  };

  const handleRemovePhase = (index: number) => {
    setPhases(phases.filter((_, i) => i !== index));
  };

  const handlePhaseChange = (index: number, field: keyof Phase, value: any) => {
    setPhases(
      phases.map((phase, i) =>
        i === index ? { ...phase, [field]: value } : phase
      )
    );
  };

  const handleMateriauxChange = (phaseIndex: number, materiaux: string[]) => {
    setPhases(
      phases.map((phase, i) =>
        i === phaseIndex ? { ...phase, materiaux } : phase
      )
    );
  };

  const validatePhases = () => {
    const validPhases = phases.filter(phase =>
      phase.titre.trim() !== '' && phase.duree.trim() !== ''
    );
    onChange(validPhases);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {phases.map((phase, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Phase {index + 1}
              </h4>
              <button
                onClick={() => handleRemovePhase(index)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500"
                title="Supprimer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Titre de la phase
                </label>
                <input
                  type="text"
                  value={phase.titre}
                  onChange={(e) => handlePhaseChange(index, 'titre', e.target.value)}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  placeholder="Introduction, Développement..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Durée
                </label>
                <input
                  type="time"
                  value={phase.duree}
                  onChange={(e) => handlePhaseChange(index, 'duree', e.target.value)}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={phase.description}
                onChange={(e) => handlePhaseChange(index, 'description', e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 h-32 resize-none"
                placeholder="Description détaillée de la phase..."
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Matériaux nécessaires
              </label>
              <div className="space-y-2">
                {phase.materiaux.map((materiel, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={materiel}
                      onChange={(e) => {
                        const newMateriaux = [...phase.materiaux];
                        newMateriaux[i] = e.target.value;
                        handleMateriauxChange(index, newMateriaux);
                      }}
                      className="flex-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    />
                    <button
                      onClick={() => {
                        const newMateriaux = phase.materiaux.filter((_, idx) => idx !== i);
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
                    const newMateriaux = [...phase.materiaux, ''];
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
          onClick={handleAddPhase}
          className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une phase
        </button>
        <button
          onClick={validatePhases}
          className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Valider le déroulement
        </button>
      </div>
    </div>
  );
};

export default DeroulementBuilder;
