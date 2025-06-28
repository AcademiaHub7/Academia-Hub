import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp } from 'lucide-react';
import { GradeService } from '../services/gradeService';

// Define types for the analytics data
interface ScoreItem {
  subject: string;
  score: number;
}

interface PassRateItem {
  subject: string;
  rate: number;
}

interface DistributionItem {
  subject: string;
  distribution: Array<{
    range: string;
    count: number;
  }>;
}

interface ProgressItem {
  subject: string;
  progress: Array<{
    month: string;
    score: number;
  }>;
}

interface AnalyticsStats {
  averageScores: ScoreItem[];
  passRates: PassRateItem[];
  distributionData: DistributionItem[];
  progressData: ProgressItem[];
}

const Analytics: React.FC = () => {
  const [timeframe, setTimeframe] = useState<string>('trimester');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AnalyticsStats>({
    averageScores: [],
    passRates: [],
    distributionData: [],
    progressData: []
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        
        // Dans une application réelle, ces appels seraient remplacés par de véritables appels API
        // qui récupèreraient les données analytiques du backend
        // Vérification de la connexion du service
        await GradeService.getGrades({ limit: 1 })
          .then(() => console.log('GradeService est connecté'))
          .catch(e => console.warn('Erreur de connexion au GradeService:', e));
        
        // Traitement des données pour obtenir les statistiques requises
        const processDummyData = () => {
          // Données simulées pour la démo
          const subjects = ['Mathématiques', 'Français', 'Histoire-Géo', 'Physique-Chimie', 'Anglais', 'SVT'];
          
          const averageScoresData = subjects.map(subject => ({
            subject,
            score: Math.round((Math.random() * 10 + 8) * 10) / 10 // Score entre 8 et 18
          }));
          
          const passRatesData = subjects.map(subject => ({
            subject,
            rate: Math.round(Math.random() * 40 + 60) // Pourcentage entre 60% et 100%
          }));
          
          const gradeRanges = ['0-5', '5-10', '10-15', '15-20'];
          const distributionData = subjects.map(subject => ({
            subject,
            distribution: gradeRanges.map(range => ({
              range,
              count: Math.floor(Math.random() * 30) + 1
            }))
          }));
          
          const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'];
          const progressData = subjects.map(subject => ({
            subject,
            progress: months.map(month => ({
              month,
              score: Math.round((Math.random() * 10 + 8) * 10) / 10
            }))
          }));
          
          return {
            averageScores: averageScoresData,
            passRates: passRatesData,
            distributionData,
            progressData
          };
        };
        
        // Utiliser les données simulées en attendant l'implémentation des API réelles
        const analyticsData = processDummyData();
        setStats(analyticsData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Impossible de charger les données analytiques');
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeframe, selectedClass]);

  const handleTimeframeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeframe(e.target.value);
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="text-red-500 mb-4">
          <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{error}</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">Veuillez réessayer ultérieurement.</p>
        <button
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Extraction et préparation des données pour l'affichage
  const chartData = {
    subjects: stats.averageScores.map(item => item.subject || '').filter(Boolean),
    scores: stats.averageScores.map(item => item.score || 0),
    passRates: stats.passRates.map(item => item.rate || 0)
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Analyse des Performances</h1>
        <div className="flex space-x-4">
          <select
            value={timeframe}
            onChange={handleTimeframeChange}
            className="block w-full max-w-md rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            aria-label="Période"
          >
            <option value="trimester">Trimestre</option>
            <option value="semester">Semestre</option>
            <option value="year">Année</option>
          </select>
          <select
            value={selectedClass}
            onChange={handleClassChange}
            className="block w-full max-w-md rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            aria-label="Classe"
          >
            <option value="all">Toutes les classes</option>
            <option value="1">Classe 1</option>
            <option value="2">Classe 2</option>
            <option value="3">Classe 3</option>
          </select>
        </div>
      </div>

      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <BarChart2 className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Moyenne Générale</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {chartData.scores.reduce((a, b) => a + b, 0) / chartData.scores.length || 0} / 20
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Taux de Réussite</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {chartData.passRates.reduce((a, b) => a + b, 0) / chartData.passRates.length || 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau détaillé */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Matière ({chartData.subjects.length} entrées)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Moyenne
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Taux de réussite
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Médiane
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Écart-type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Évolution
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {chartData.subjects.map((subject, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{chartData.scores[index]}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{chartData.passRates[index]}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Médiane</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Écart-type</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center text-green-600 dark:text-green-400">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Évolution
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
