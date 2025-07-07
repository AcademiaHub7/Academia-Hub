import React from 'react';
import { BarChart, PieChart, Calendar, Users, BookOpen, TrendingUp, TrendingDown } from 'lucide-react';

interface DashboardStats {
  totalFiches: number;
  fichesValidated: number;
  fichesInProgress: number;
  fichesRejected: number;
  averageApcScore: number;
  templatesUsed: number;
  totalTeachers: number;
  activeTeachers: number;
}

interface DashboardProps {
  stats: DashboardStats;
  onFilterChange: (filters: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, onFilterChange }) => {
  // Données pour les graphiques
  const validationStats = [
    { name: 'Validées', value: stats.fichesValidated },
    { name: 'En cours', value: stats.fichesInProgress },
    { name: 'Rejetées', value: stats.fichesRejected }
  ];

  const templateStats = [
    { name: 'Modèle 1', value: 35 },
    { name: 'Modèle 2', value: 25 },
    { name: 'Modèle 3', value: 20 },
    { name: 'Modèle 4', value: 15 },
    { name: 'Autres', value: 5 }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Statistiques générales */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          <BookOpen className="w-5 h-5 inline-block mr-2" />
          Statistiques générales
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalFiches}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Fiches créées</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.fichesValidated}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Validées</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.fichesInProgress}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">En cours</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              {stats.fichesRejected}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Rejetées</div>
          </div>
        </div>
      </div>

      {/* Validation par enseignant */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          <Users className="w-5 h-5 inline-block mr-2" />
          Validation par enseignant
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold">
              {stats.totalTeachers}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Enseignants</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">
              {stats.activeTeachers}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Actifs</div>
          </div>
        </div>
        <div className="mt-4">
          <PieChart className="w-20 h-20 mx-auto text-gray-300" />
          <div className="mt-4 text-center">
            <span className="text-2xl font-bold">{stats.averageApcScore.toFixed(1)}</span>
            <div className="text-sm text-gray-500 dark:text-gray-400">Score APC moyen</div>
          </div>
        </div>
      </div>

      {/* Utilisation des templates */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          <TrendingUp className="w-5 h-5 inline-block mr-2" />
          Utilisation des templates
        </h3>
        <div className="h-48">
          <div className="h-full bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            {/* Ici, on pourrait intégrer un composant de graphique */}
            <div className="text-center text-gray-500 dark:text-gray-400">
              Graphique de l'utilisation des templates
            </div>
          </div>
        </div>
      </div>

      {/* Progression des programmes */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          <Calendar className="w-5 h-5 inline-block mr-2" />
          Progression des programmes
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">Objectifs atteints</div>
            <div className="text-2xl font-bold">78%</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">Progression moyenne</div>
            <div className="text-2xl font-bold">85%</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">Taux de complétude</div>
            <div className="text-2xl font-bold">92%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
