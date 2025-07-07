import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw,
  X 
} from 'lucide-react';

interface JournalEntry {
  id: string;
  date: string;
  ficheId: string;
  ficheTitle: string;
  ficheContent: string;
  status: 'synced' | 'pending' | 'diverged';
  lastSync: string;
  differences: string[];
}

interface JournalIntegrationProps {
  entries: JournalEntry[];
  onSync: (entry: JournalEntry) => void;
  onUpdate: (entry: JournalEntry) => void;
  onResolveDivergence: (entry: JournalEntry) => void;
}

const JournalIntegration: React.FC<JournalIntegrationProps> = ({
  entries,
  onSync,
  onUpdate,
  onResolveDivergence
}) => {
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [showDivergences, setShowDivergences] = useState(false);

  // Statuts visuels
  const statusColors = {
    synced: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300',
    pending: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300',
    diverged: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
          <BookOpen className="w-5 h-5 inline-block mr-2" />
          Cahier journal
        </h3>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowDivergences(!showDivergences)}
              className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              {showDivergences ? 'Masquer' : 'Afficher'} les divergences
            </button>
            <button
              onClick={() => {
                // Synchronisation générale
              }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Synchroniser tout
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Dernière synchronisation: {new Date().toLocaleTimeString('fr-FR')}
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
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(entry.date).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs ${
                  statusColors[entry.status]
                }`}
              >
                {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
              </div>
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {entry.ficheTitle}
            </h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSync(entry)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <RefreshCw className="w-4 h-4 text-blue-500" />
                </button>
                <button
                  onClick={() => onUpdate(entry)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Edit className="w-4 h-4 text-green-500" />
                </button>
              </div>
              {entry.status === 'diverged' && (
                <button
                  onClick={() => onResolveDivergence(entry)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <AlertCircle className="w-4 h-4 text-red-500" />
                </button>
              )}
            </div>
            {showDivergences && entry.differences.length > 0 && (
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Divergences détectées
                </h5>
                <ul className="space-y-1 text-sm text-red-600 dark:text-red-400">
                  {entry.differences.map((difference, index) => (
                    <li key={index}>
                      <AlertCircle className="w-4 h-4 inline-block mr-1" />
                      {difference}
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

export default JournalIntegration;
