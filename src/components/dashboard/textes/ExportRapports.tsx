import React, { useState } from 'react';
import { FileText, Calendar, BarChart2, Users } from 'lucide-react';
import RapportMensuel from './RapportMensuel';

const ExportRapports: React.FC = () => {
  // État pour le type de rapport sélectionné
  const [reportType, setReportType] = useState<string>('monthly');

  // Note: Les données de classes, matières et enseignants sont gérées dans les sous-composants

  // Types de rapports disponibles
  const reportTypes = [
    { id: 'monthly', name: 'Rapport Mensuel', icon: Calendar, description: 'Rapport détaillé des entrées du cahier de textes par mois' },
    { id: 'teacher', name: 'Rapport par Enseignant', icon: Users, description: 'Synthèse des activités par enseignant' },
    { id: 'subject', name: 'Rapport par Matière', icon: FileText, description: 'Analyse des entrées par matière et progression' },
    { id: 'statistics', name: 'Statistiques Générales', icon: BarChart2, description: 'Tableaux de bord et indicateurs de suivi' },
  ];

  // Rendu conditionnel en fonction du type de rapport sélectionné
  const renderReport = () => {
    switch (reportType) {
      case 'monthly':
        return <RapportMensuel />;
      case 'teacher':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto text-blue-500 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">Rapport par Enseignant</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Cette fonctionnalité sera disponible dans une prochaine mise à jour. Elle permettra de générer des rapports détaillés par enseignant.
              </p>
            </div>
          </div>
        );
      case 'subject':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-green-500 dark:text-green-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">Rapport par Matière</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Cette fonctionnalité sera disponible dans une prochaine mise à jour. Elle permettra d'analyser la progression par matière.
              </p>
            </div>
          </div>
        );
      case 'statistics':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-center py-12">
              <BarChart2 className="h-16 w-16 mx-auto text-purple-500 dark:text-purple-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">Statistiques Générales</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Cette fonctionnalité sera disponible dans une prochaine mise à jour. Elle fournira des tableaux de bord et indicateurs de suivi.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Exports et Rapports</h2>
      </div>
      
      {/* Sélection du type de rapport */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((type) => {
          const Icon = type.icon;
          return (
            <div
              key={type.id}
              className={`cursor-pointer rounded-lg border p-4 transition-all ${
                reportType === type.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={() => setReportType(type.id)}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  reportType === type.id
                    ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{type.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{type.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Contenu du rapport sélectionné */}
      <div className="mt-6">
        {renderReport()}
      </div>
    </div>
  );
};

export default ExportRapports;
