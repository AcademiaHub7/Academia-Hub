import React, { useState, useEffect } from 'react';
import { 
  Robot, 
  Lightbulb, 
  Clock, 
  AlertCircle,
  TrendingUp,
  TrendingDown 
} from 'lucide-react';

interface AIPedagogicalSuggestion {
  id: string;
  type: 'instruction' | 'activity' | 'time' | 'difficulty';
  content: string;
  confidence: number;
  relevance: number;
}

interface AIPedagogicalAssistantProps {
  currentFiche: any;
  onApplySuggestion: (suggestion: AIPedagogicalSuggestion) => void;
}

const AIPedagogicalAssistant: React.FC<AIPedagogicalAssistantProps> = ({
  currentFiche,
  onApplySuggestion
}) => {
  const [suggestions, setSuggestions] = useState<AIPedagogicalSuggestion[]>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [loading, setLoading] = useState(false);

  // Types de suggestions
  const suggestionTypes = {
    instruction: {
      icon: Lightbulb,
      label: 'Consignes'
    },
    activity: {
      icon: Robot,
      label: 'Activités'
    },
    time: {
      icon: Clock,
      label: 'Durées'
    },
    difficulty: {
      icon: AlertCircle,
      label: 'Difficultés'
    }
  };

  // Analyse des incohérences
  const analyzeInconsistencies = (fiche: any) => {
    const inconsistencies = [];
    
    // Vérification des durées
    if (fiche.duration < 45) {
      inconsistencies.push('Durée de séance trop courte');
    }
    
    // Vérification des compétences
    if (fiche.competences.length > 4) {
      inconsistencies.push('Trop de compétences pour une séance');
    }
    
    return inconsistencies;
  };

  // Génération des suggestions
  useEffect(() => {
    if (currentFiche) {
      setLoading(true);
      
      // Simuler l'analyse IA
      setTimeout(() => {
        const newSuggestions = [
          {
            id: 'inst1',
            type: 'instruction',
            content: 'Ajouter une consigne de groupe pour favoriser la collaboration',
            confidence: 0.85,
            relevance: 0.9
          },
          {
            id: 'act1',
            type: 'activity',
            content: 'Proposer une activité de mise en situation professionnelle',
            confidence: 0.8,
            relevance: 0.85
          },
          {
            id: 'time1',
            type: 'time',
            content: 'Répartir le temps en blocs de 15 minutes',
            confidence: 0.9,
            relevance: 0.95
          }
        ];
        
        setSuggestions(newSuggestions);
        setLoading(false);
      }, 1000);
    }
  }, [currentFiche]);

  return (
    <div className="space-y-6">
      {/* Assistant IA */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
          <Robot className="w-5 h-5 inline-block mr-2" />
          Assistant pédagogique IA
        </h3>
        <div className="mt-4">
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 mb-4"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            {showAnalysis ? 'Masquer' : 'Afficher'} l'analyse
          </button>
          
          {showAnalysis && (
            <div className="space-y-4">
              {/* Suggestions */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Suggestions intelligentes
                </h4>
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2">
                        {suggestionTypes[suggestion.type].icon && (
                          <suggestionTypes[suggestion.type].icon className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {suggestionTypes[suggestion.type].label}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              suggestion.confidence >= 0.9 ? 'bg-green-600 dark:bg-green-400' :
                              suggestion.confidence >= 0.7 ? 'bg-yellow-600 dark:bg-yellow-400' :
                              'bg-red-600 dark:bg-red-400'
                            }`}
                            style={{ width: `${suggestion.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {Math.round(suggestion.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {suggestion.content}
                    </p>
                    <button
                      onClick={() => onApplySuggestion(suggestion)}
                      className="mt-2 inline-flex items-center px-3 py-1 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
                    >
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Appliquer
                    </button>
                  </div>
                ))}
              </div>

              {/* Analyse des incohérences */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Analyse des incohérences
                </h4>
                {analyzeInconsistencies(currentFiche).map((inconsistency, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-red-50 dark:bg-red-900"
                  >
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-600 dark:text-red-400">
                        {inconsistency}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIPedagogicalAssistant;
