import React, { useState } from 'react';
import { 
  Book, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  X 
} from 'lucide-react';

interface TextbookEntry {
  id: string;
  ficheId: string;
  ficheTitle: string;
  plannedContent: string;
  actualContent: string;
  progression: {
    planned: number;
    actual: number;
  };
  status: 'in_progress' | 'completed' | 'delayed';
  lastUpdate: string;
  history: {
    date: string;
    changes: string[];
  }[];
}

interface TextbookIntegrationProps {
  entries: TextbookEntry[];
  onValidate: (entry: TextbookEntry) => void;
  onUpdate: (entry: TextbookEntry) => void;
  onHistory: (entry: TextbookEntry) => void;
}

const TextbookIntegration: React.FC<TextbookIntegrationProps> = ({
  entries,
  onValidate,
  onUpdate,
  onHistory
}) => {
  const [selectedEntry, setSelectedEntry] = useState<TextbookEntry | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // Statuts visuels
  const statusColors = {
    in_progress: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300',
    completed: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300',
    delayed: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
  };

  // Calcul de la progression
  const calculateProgress = (entry: TextbookEntry) => {
    const planned = entry.progression.planned;
    const actual = entry.progression.actual;
    return {
      percentage: (actual / planned) * 100,
      color: actual >= planned ? 'green' : actual >= planned * 0.7 ? 'yellow' : 'red'
    };
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
          <Book className="w-5 h-5 inline-block mr-2" />
          Cahier de texte
        </h3>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <Clock className="w-4 h-4 mr-2" />
              {showHistory ? 'Masquer' : 'Afficher'} l'historique
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Progression: {entries.reduce((acc, entry) => acc + entry.progression.actual, 0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Liste des entrées */}
      <div className="space-y-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {entry.ficheTitle}
              </h4>
              <div
                className={`px-2 py-1 rounded-full text-xs ${
                  statusColors[entry.status]
                }`}
              >
                {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
              </div>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div 
                className={`h-4 rounded-full transition-all duration-300 ${
                  calculateProgress(entry).color === 'green' ? 'bg-green-600 dark:bg-green-400' :
                  calculateProgress(entry).color === 'yellow' ? 'bg-yellow-600 dark:bg-yellow-400' :
                  'bg-red-600 dark:bg-red-400'
                }`}
                style={{ width: `${calculateProgress(entry).percentage}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Planifié: {entry.progression.planned}%
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Réalisé: {entry.progression.actual}%
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onUpdate(entry)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Edit className="w-4 h-4 text-blue-500" />
                </button>
                <button
                  onClick={() => onValidate(entry)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </button>
                <button
                  onClick={() => onHistory(entry)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Clock className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            {showHistory && entry.history.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Historique des modifications
                </h5>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {entry.history.map((history, index) => (
                    <li key={index}>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>
                          {new Date(history.date).toLocaleDateString('fr-FR')}:
                        </span>
                        <ul className="pl-4 list-disc">
                          {history.changes.map((change, changeIndex) => (
                            <li key={changeIndex}>{change}</li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TextbookIntegration;
