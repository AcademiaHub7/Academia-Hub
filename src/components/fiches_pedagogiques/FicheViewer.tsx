import React from 'react';
import { FileText, Clock, User, BookOpen, LayoutGrid, CheckCircle, AlertCircle } from 'lucide-react';

interface FichePedagogique {
  titre: string;
  matiere: string;
  classe: string;
  auteur: string;
  dateCreation: string;
  dateModification: string;
  statut: 'brouillon' | 'soumise' | 'validée' | 'rejetée' | 'à_corriger';
  type: 'fiche' | 'planification';
  objectifs: string[];
  competences: string[];
  deroulement: any[];
  consignes: string[];
  resultats: string[];
  strategies: string[];
  template: string;
}

interface FicheViewerProps {
  fiche: FichePedagogique;
  onClose: () => void;
}

const FicheViewer: React.FC<FicheViewerProps> = ({ fiche, onClose }) => {
  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'brouillon': return 'bg-yellow-100 text-yellow-800';
      case 'soumise': return 'bg-blue-100 text-blue-800';
      case 'validée': return 'bg-green-100 text-green-800';
      case 'rejetée': return 'bg-red-100 text-red-800';
      case 'à_corriger': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {fiche.titre}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Informations générales */}
          <div>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600 dark:text-gray-400">{fiche.matiere}</span>
                </div>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(fiche.statut)}`}>
                  {fiche.statut}
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <User className="w-4 h-4" />
                <span>{fiche.auteur}</span>
                <Clock className="w-4 h-4" />
                <span>{new Date(fiche.dateModification).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </div>

          {/* Objectifs */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              <FileText className="w-4 h-4 inline-block mr-1" />
              Objectifs pédagogiques
            </h3>
            <ul className="list-disc list-inside space-y-2">
              {fiche.objectifs.map((objectif, index) => (
                <li key={index} className="text-gray-600 dark:text-gray-400">
                  {objectif}
                </li>
              ))}
            </ul>
          </div>

          {/* Compétences */}
          {fiche.competences.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                <LayoutGrid className="w-4 h-4 inline-block mr-1" />
                Compétences
              </h3>
              <div className="flex flex-wrap gap-2">
                {fiche.competences.map((comp, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
                  >
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Déroulement */}
          {fiche.deroulement.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                <Clock className="w-4 h-4 inline-block mr-1" />
                Déroulement
              </h3>
              {fiche.deroulement.map((phase: any, index: number) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Phase {index + 1} - {phase.titre}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Durée:</span>
                      <span className="text-sm text-gray-900 dark:text-gray-100">{phase.duree}</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {phase.description}
                    </div>
                    {phase.materiaux.length > 0 && (
                      <div className="mt-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Matériaux:</span>
                        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                          {phase.materiaux.map((materiel: string, i: number) => (
                            <li key={i}>{materiel}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Consignes et résultats */}
          {fiche.consignes.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                <CheckCircle className="w-4 h-4 inline-block mr-1" />
                Consignes et résultats attendus
              </h3>
              <div className="space-y-4">
                {fiche.consignes.map((consigne, index) => (
                  <div key={index} className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100">Consigne:</span>
                      <span className="text-gray-600 dark:text-gray-400">{consigne}</span>
                    </div>
                    {fiche.resultats[index] && (
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 dark:text-gray-100">Résultat:</span>
                        <span className="text-gray-600 dark:text-gray-400">{fiche.resultats[index]}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stratégies */}
          {fiche.strategies.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                <AlertCircle className="w-4 h-4 inline-block mr-1" />
                Stratégies d'enseignement
              </h3>
              {fiche.strategies.map((strategie: any, index: number) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">{strategie.type}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {strategie.description}
                  </div>
                  {strategie.materiaux.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Matériaux:</span>
                      <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                        {strategie.materiaux.map((materiel: string, i: number) => (
                          <li key={i}>{materiel}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FicheViewer;
