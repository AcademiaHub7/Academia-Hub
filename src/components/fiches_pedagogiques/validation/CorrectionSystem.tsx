import React, { useState } from 'react';
import { FileText, Clock, User, CheckCircle, AlertCircle, MessageSquare, ClipboardList } from 'lucide-react';

interface Correction {
  id: string;
  section: string;
  contenu: string;
  type: 'erreur' | 'suggestion' | 'recommandation';
  date: string;
  etat: 'en_attente' | 'corrigee' | 'rejetee';
}

interface CorrectionSystemProps {
  corrections: Correction[];
  onCorrectionUpdate: (correction: Correction) => void;
  onCorrectionDelete: (correctionId: string) => void;
}

const CorrectionSystem: React.FC<CorrectionSystemProps> = ({
  corrections,
  onCorrectionUpdate,
  onCorrectionDelete
}) => {
  const [selectedCorrection, setSelectedCorrection] = useState<Correction | null>(null);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [showCorrectionHistory, setShowCorrectionHistory] = useState(false);

  const correctionTypes = {
    erreur: {
      color: 'red',
      icon: AlertCircle,
      label: 'Erreur'
    },
    suggestion: {
      color: 'blue',
      icon: MessageSquare,
      label: 'Suggestion'
    },
    recommandation: {
      color: 'green',
      icon: ClipboardList,
      label: 'Recommandation'
    }
  };

  const handleCorrectionUpdate = (correction: Correction) => {
    onCorrectionUpdate(correction);
    setSelectedCorrection(null);
    setShowCorrectionModal(false);
  };

  const handleCorrectionDelete = (correctionId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette correction ?')) {
      onCorrectionDelete(correctionId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Liste des corrections */}
      <div className="space-y-4">
        {corrections.map((correction) => (
          <div
            key={correction.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-2">
                <correctionTypes[correction.type].icon
                  className={`w-5 h-5 text-${correctionTypes[correction.type].color}-500`}
                />
                <span className="font-medium">{correctionTypes[correction.type].label}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedCorrection(correction);
                    setShowCorrectionModal(true);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Edit2 className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => handleCorrectionDelete(correction.id)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedCorrection(correction);
                    setShowCorrectionHistory(true);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <History className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">{correction.contenu}</p>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{new Date(correction.date).toLocaleDateString('fr-FR')}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                correction.etat === 'en_attente'
                  ? 'bg-yellow-100 text-yellow-800'
                  : correction.etat === 'corrigee'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {correction.etat}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de correction */}
      {showCorrectionModal && selectedCorrection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Modifier la correction
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type de correction
                  </label>
                  <select
                    value={selectedCorrection.type}
                    onChange={(e) => {
                      setSelectedCorrection(prev => ({
                        ...prev,
                        type: e.target.value as Correction['type']
                      }));
                    }}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  >
                    <option value="erreur">Erreur</option>
                    <option value="suggestion">Suggestion</option>
                    <option value="recommandation">Recommandation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contenu
                  </label>
                  <textarea
                    value={selectedCorrection.contenu}
                    onChange={(e) => {
                      setSelectedCorrection(prev => ({
                        ...prev,
                        contenu: e.target.value
                      }));
                    }}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 h-32"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    État
                  </label>
                  <select
                    value={selectedCorrection.etat}
                    onChange={(e) => {
                      setSelectedCorrection(prev => ({
                        ...prev,
                        etat: e.target.value as Correction['etat']
                      }));
                    }}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  >
                    <option value="en_attente">En attente</option>
                    <option value="corrigee">Corrigée</option>
                    <option value="rejetee">Rejetée</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowCorrectionModal(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleCorrectionUpdate(selectedCorrection)}
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

      {/* Modal d'historique */}
      {showCorrectionHistory && selectedCorrection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Historique de la correction
              </h2>
              <button
                onClick={() => setShowCorrectionHistory(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {/* Historique des versions */}
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Version {i + 1}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date().toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Contenu de la version {i + 1}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorrectionSystem;
