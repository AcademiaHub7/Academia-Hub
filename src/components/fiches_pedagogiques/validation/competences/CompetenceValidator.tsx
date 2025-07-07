import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Info, Clock, BookOpen, TrendingUp } from 'lucide-react';

interface Competence {
  id: string;
  type: 'savoir' | 'savoir_faire' | 'savoir_etre' | 'competence_transversale';
  description: string;
  niveau: number;
  domaine: string;
}

interface CompetenceValidatorProps {
  fiche: any;
  onCorrection: (correction: any) => void;
}

const CompetenceValidator: React.FC<CompetenceValidatorProps> = ({
  fiche,
  onCorrection
}) => {
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [selectedCompetence, setSelectedCompetence] = useState<Competence | null>(null);

  // Types de compétences
  const competenceTypes = {
    savoir: {
      color: 'blue',
      icon: BookOpen,
      label: 'Savoir'
    },
    savoir_faire: {
      color: 'green',
      icon: TrendingUp,
      label: 'Savoir-faire'
    },
    savoir_etre: {
      color: 'purple',
      icon: Info,
      label: 'Savoir-être'
    },
    competence_transversale: {
      color: 'orange',
      icon: CheckCircle,
      label: 'Compétence transversale'
    }
  };

  // Validation des compétences
  const validateCompetences = () => {
    const results = {
      types: {
        savoir: fiche.competences.some(c => c.type === 'savoir'),
        savoir_faire: fiche.competences.some(c => c.type === 'savoir_faire'),
        savoir_etre: fiche.competences.some(c => c.type === 'savoir_etre'),
        competence_transversale: fiche.competences.some(c => c.type === 'competence_transversale')
      },
      progression: checkProgression(),
      coherence: checkCoherence(),
      duration: checkDuration(),
      material: checkMaterial()
    };

    return results;
  };

  // Vérifications détaillées
  const checkProgression = () => {
    // Vérifie la progression pédagogique
    return fiche.phases.some(phase => 
      phase.activites.length > 0 && 
      phase.duree > 0
    );
  };

  const checkCoherence = () => {
    // Vérifie la cohérence entre objectifs et activités
    return fiche.objectifs.every(obj => 
      fiche.phases.some(phase => 
        phase.activites.some(act => act.includes(obj))
      )
    );
  };

  const checkDuration = () => {
    // Vérifie la durée réaliste
    const totalDuration = fiche.phases.reduce((sum, phase) => sum + phase.duree, 0);
    return totalDuration >= 30 && totalDuration <= 180;
  };

  const checkMaterial = () => {
    // Vérifie le matériel disponible
    return fiche.phases.every(phase => 
      phase.materiaux.length > 0 && 
      phase.materiaux.every(mat => mat !== 'non disponible')
    );
  };

  // Suggestions d'amélioration
  const getSuggestions = () => {
    const suggestions = [];

    // Suggestion sur les compétences
    if (!validateCompetences().types.savoir) {
      suggestions.push('Ajouter des compétences de type "savoir" pour renforcer la compréhension théorique');
    }
    if (!validateCompetences().types.savoir_faire) {
      suggestions.push('Intégrer des compétences de type "savoir-faire" pour développer les compétences pratiques');
    }
    if (!validateCompetences().types.savoir_etre) {
      suggestions.push('Inclure des compétences de type "savoir-être" pour travailler les aspects sociaux et émotionnels');
    }
    if (!validateCompetences().types.competence_transversale) {
      suggestions.push('Ajouter des compétences transversales pour renforcer les liens entre les disciplines');
    }

    return suggestions;
  };

  // Génération du score pédagogique
  const getPedagogicalScore = () => {
    const validation = validateCompetences();
    const score = Object.values(validation.types).filter(Boolean).length + 
                 (validation.progression ? 1 : 0) + 
                 (validation.coherence ? 1 : 0) + 
                 (validation.duration ? 1 : 0) + 
                 (validation.material ? 1 : 0);

    return (score / 8) * 100;
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          <BookOpen className="w-5 h-5 inline-block mr-2" />
          Validation par compétences
        </h2>
        <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 px-4 py-2 rounded-full">
          Score pédagogique : {getPedagogicalScore().toFixed(1)}%
        </div>
      </div>

      {/* Types de compétences */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(competenceTypes).map(([type, { color, icon: Icon, label }]) => (
          <div
            key={type}
            className={`p-4 rounded-lg border ${
              validateCompetences().types[type as keyof typeof competenceTypes]
                ? 'border-green-500 bg-green-50 dark:bg-green-900'
                : 'border-red-500 bg-red-50 dark:bg-red-900'
            }`}
          >
            <Icon className={`w-6 h-6 text-${color}-500 mb-2`} />
            <h3 className="font-medium">{label}</h3>
            <p className={`text-sm ${
              validateCompetences().types[type as keyof typeof competenceTypes]
                ? 'text-green-700 dark:text-green-300'
                : 'text-red-700 dark:text-red-300'
            }`}>
              {validateCompetences().types[type as keyof typeof competenceTypes]
                ? 'Présent'
                : 'Absent'}
            </p>
          </div>
        ))}
      </div>

      {/* Vérifications détaillées */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Vérifications détaillées
        </h3>
        <div className="space-y-2">
          <div className={`flex items-center ${
            validateCompetences().progression
              ? 'text-green-500'
              : 'text-red-500'
          }`}>
            <CheckCircle className="w-4 h-4 mr-2" />
            <span>Progression pédagogique</span>
          </div>
          <div className={`flex items-center ${
            validateCompetences().coherence
              ? 'text-green-500'
              : 'text-red-500'
          }`}>
            <CheckCircle className="w-4 h-4 mr-2" />
            <span>Cohérence objectifs/activités</span>
          </div>
          <div className={`flex items-center ${
            validateCompetences().duration
              ? 'text-green-500'
              : 'text-red-500'
          }`}>
            <Clock className="w-4 h-4 mr-2" />
            <span>Durée réaliste</span>
          </div>
          <div className={`flex items-center ${
            validateCompetences().material
              ? 'text-green-500'
              : 'text-red-500'
          }`}>
            <CheckCircle className="w-4 h-4 mr-2" />
            <span>Matériel disponible</span>
          </div>
        </div>
      </div>

      {/* Suggestions d'amélioration */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Suggestions d'amélioration
        </h3>
        <div className="space-y-2">
          {getSuggestions().map((suggestion, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-blue-500" />
              <p className="text-gray-600 dark:text-gray-400">{suggestion}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bouton de correction */}
      <button
        onClick={() => setShowCorrectionModal(true)}
        className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
      >
        <AlertCircle className="w-4 h-4 mr-2" />
        Proposer des corrections
      </button>

      {/* Modal de correction */}
      {showCorrectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Proposer des corrections
              </h2>
              <button
                onClick={() => setShowCorrectionModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {/* Sélection des compétences à ajouter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sélectionner les compétences à ajouter
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(competenceTypes).map(([type, { label }]) => (
                      <div key={type}>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
                          />
                          <span>{label}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description de la correction */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description de la correction
                  </label>
                  <textarea
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 h-32"
                    placeholder="Description détaillée des modifications à apporter..."
                  />
                </div>

                {/* Boutons d'action */}
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowCorrectionModal(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      // Logique de sauvegarde de la correction
                      setShowCorrectionModal(false);
                    }}
                    className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetenceValidator;
