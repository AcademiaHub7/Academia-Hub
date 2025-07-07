import React, { useEffect, useState } from 'react';
import { BarChart2, PieChart, Calendar, TrendingUp, Download } from 'lucide-react';
import { useFicheContext } from '../context/FicheContext';
import { SUBJECTS, CLASS_LEVELS } from '../types';

const FicheAnalytics: React.FC = () => {
  const { stats, fiches } = useFicheContext();
  const [selectedChart, setSelectedChart] = useState<'subject' | 'status' | 'level' | 'monthly'>('subject');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fonction pour obtenir le nom complet d'une matière
  const getSubjectName = (code: string): string => {
    const subject = SUBJECTS.find(s => s.value === code);
    return subject ? subject.label : code;
  };

  // Fonction pour obtenir le nom complet d'un niveau
  const getLevelName = (code: string): string => {
    const level = CLASS_LEVELS.find(l => l.value === code);
    return level ? level.label : code;
  };

  // Fonction pour générer une couleur basée sur une chaîne
  const stringToColor = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 60%)`;
  };

  // Fonction pour obtenir le nom du mois
  const getMonthName = (monthStr: string): string => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  // Fonction pour exporter les données (simulée)
  const handleExport = () => {
    alert('Fonctionnalité d\'exportation des données à implémenter');
  };

  // Préparation des données pour les graphiques
  const prepareChartData = () => {
    if (!stats) return [];

    switch (selectedChart) {
      case 'subject':
        return Object.entries(stats.bySubject).map(([subject, count]) => ({
          label: getSubjectName(subject),
          value: count,
          color: stringToColor(subject)
        })).sort((a, b) => b.value - a.value);
      
      case 'status':
        return [
          { label: 'Validées', value: stats.validated, color: '#4ade80' },
          { label: 'En attente', value: stats.pending, color: '#facc15' },
          { label: 'Rejetées', value: stats.rejected, color: '#f87171' },
          { label: 'Brouillons', value: stats.created - stats.validated - stats.pending - stats.rejected, color: '#94a3b8' }
        ];
      
      case 'level':
        const levelStats: Record<string, number> = {};
        fiches.forEach(fiche => {
          if (!levelStats[fiche.level]) {
            levelStats[fiche.level] = 0;
          }
          levelStats[fiche.level]++;
        });
        
        return Object.entries(levelStats).map(([level, count]) => ({
          label: getLevelName(level),
          value: count,
          color: stringToColor(level)
        })).sort((a, b) => b.value - a.value);
      
      case 'monthly':
        return Object.entries(stats.byMonth).map(([month, count]) => ({
          label: getMonthName(month),
          value: count,
          color: stringToColor(month)
        })).sort((a, b) => {
          const [yearA, monthA] = a.label.split(' ')[1] ? [a.label.split(' ')[1], a.label.split(' ')[0]] : ['', ''];
          const [yearB, monthB] = b.label.split(' ')[1] ? [b.label.split(' ')[1], b.label.split(' ')[0]] : ['', ''];
          return yearA === yearB ? 
            new Date(Date.parse(`1 ${monthB} 2000`)).getTime() - new Date(Date.parse(`1 ${monthA} 2000`)).getTime() : 
            parseInt(yearA) - parseInt(yearB);
        });
      
      default:
        return [];
    }
  };

  const chartData = prepareChartData();
  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

  // Calcul des statistiques générales
  const generalStats = {
    total: stats?.created || 0,
    validated: stats?.validated || 0,
    validationRate: stats ? Math.round((stats.validated / stats.created) * 100) : 0,
    averagePerMonth: stats && Object.keys(stats.byMonth).length > 0 
      ? Math.round(stats.created / Object.keys(stats.byMonth).length) 
      : 0
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-semibold">Analyses et statistiques</h2>
        <button 
          className="flex items-center px-3 py-1 text-blue-600 hover:text-blue-800 border border-blue-300 rounded-md"
          onClick={handleExport}
        >
          <Download className="h-5 w-5 mr-1" /> Exporter les données
        </button>
      </div>

      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total fiches</p>
              <p className="text-2xl font-semibold">{generalStats.total}</p>
            </div>
            <BarChart2 className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Fiches validées</p>
              <p className="text-2xl font-semibold">{generalStats.validated}</p>
            </div>
            <PieChart className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Taux de validation</p>
              <p className="text-2xl font-semibold">{generalStats.validationRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Moyenne mensuelle</p>
              <p className="text-2xl font-semibold">{generalStats.averagePerMonth}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Sélection du graphique */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            className={`px-4 py-2 rounded-md ${
              selectedChart === 'subject' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setSelectedChart('subject')}
          >
            Par matière
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              selectedChart === 'status' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setSelectedChart('status')}
          >
            Par statut
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              selectedChart === 'level' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setSelectedChart('level')}
          >
            Par niveau
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              selectedChart === 'monthly' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setSelectedChart('monthly')}
          >
            Par mois
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement des données...</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Aucune donnée disponible</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graphique à barres */}
            <div className="h-80 relative">
              <h3 className="text-lg font-medium mb-4">
                {selectedChart === 'subject' && 'Répartition par matière'}
                {selectedChart === 'status' && 'Répartition par statut'}
                {selectedChart === 'level' && 'Répartition par niveau'}
                {selectedChart === 'monthly' && 'Répartition par mois'}
              </h3>
              <div className="h-full flex items-end space-x-2">
                {chartData.map((item, index) => {
                  const heightPercentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
                  return (
                    <div 
                      key={index} 
                      className="flex-1 flex flex-col items-center"
                      title={`${item.label}: ${item.value} fiches (${Math.round(heightPercentage)}%)`}
                    >
                      <div 
                        className="w-full rounded-t-md transition-all duration-500 ease-in-out"
                        style={{ 
                          height: `${Math.max(heightPercentage * 0.7, 5)}%`, 
                          backgroundColor: item.color 
                        }}
                      ></div>
                      <div className="text-xs font-medium mt-1 text-center truncate w-full">
                        {item.value}
                      </div>
                      <div className="text-xs text-gray-500 truncate w-full text-center">
                        {item.label.length > 10 ? `${item.label.substring(0, 10)}...` : item.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tableau de données */}
            <div>
              <h3 className="text-lg font-medium mb-4">Détails</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {selectedChart === 'subject' && 'Matière'}
                        {selectedChart === 'status' && 'Statut'}
                        {selectedChart === 'level' && 'Niveau'}
                        {selectedChart === 'monthly' && 'Mois'}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pourcentage
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {chartData.map((item, index) => {
                      const percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
                      return (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2" 
                                style={{ backgroundColor: item.color }}
                              ></div>
                              <span className="text-sm font-medium text-gray-900">{item.label}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.value}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {percentage.toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { FicheAnalytics };
