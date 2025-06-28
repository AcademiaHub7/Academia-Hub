import React, { useState, useEffect } from 'react';
import { Calendar, ChevronRight, Users, FileText, Award, BarChart2 } from 'lucide-react';
import { ExamService } from '../services/examService';
import { Exam, ExamStatus } from '../types';

const Dashboard: React.FC = () => {
  const [upcomingExams, setUpcomingExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalExams: 0,
    pendingGrades: 0,
    averageScore: 0,
    passRate: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les examens à venir
        const examsData = await ExamService.getUpcomingExams(5);
        setUpcomingExams(examsData);
        
        // Simuler des statistiques (à remplacer par des appels API réels)
        setStats({
          totalExams: 24,
          pendingGrades: 8,
          averageScore: 14.5,
          passRate: 78
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Impossible de charger les données du tableau de bord');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
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
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>{error}</p>
        <button 
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <FileText className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Examens</h3>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">{stats.totalExams}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <Award className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes en attente</h3>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">{stats.pendingGrades}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <BarChart2 className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Moyenne générale</h3>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">{stats.averageScore}/20</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Taux de réussite</h3>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">{stats.passRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Examens à venir */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">Examens à venir</h2>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
              Voir tous <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {upcomingExams.length > 0 ? (
            upcomingExams.map((exam) => (
              <div key={exam.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-800 dark:text-white">{exam.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(exam.date)} • {exam.duration} min
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      exam.status === ExamStatus.SCHEDULED 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {exam.status === ExamStatus.SCHEDULED ? 'Programmé' : 'En préparation'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              <p>Aucun examen à venir</p>
            </div>
          )}
        </div>
      </div>

      {/* Graphique et statistiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Répartition des notes</h2>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Graphique de répartition des notes</p>
            {/* Intégrer Chart.js ou autre librairie de graphiques ici */}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Activité récente</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                  <span className="text-xs font-medium">JD</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-800 dark:text-white">
                  <span className="font-medium">Jean Dupont</span> a ajouté un nouvel examen
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Il y a 2 heures</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <span className="text-xs font-medium">ML</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-800 dark:text-white">
                  <span className="font-medium">Marie Leclerc</span> a validé les notes de Mathématiques
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Il y a 5 heures</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <span className="text-xs font-medium">PL</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-800 dark:text-white">
                  <span className="font-medium">Pierre Laval</span> a publié les résultats du trimestre
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Hier</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
