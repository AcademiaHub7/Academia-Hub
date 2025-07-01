import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useAnalyticsStore } from '../../stores/analyticsStore';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface PerformanceData {
  period: string;
  average: number;
  passRate: number;
  studentsCount: number;
}

interface SubjectPerformance {
  subject: string;
  average: number;
  coefficient: number;
  studentsCount: number;
  trend: 'up' | 'down' | 'stable';
}

interface ClassComparison {
  className: string;
  average: number;
  studentsCount: number;
  rank: number;
  improvement: number;
}

export const AnalyticsDashboard: React.FC = () => {
  const { user, tenant } = useAuthStore();
  const { analytics, fetchAnalytics, isLoading } = useAnalyticsStore();
  
  const [selectedPeriod, setSelectedPeriod] = useState<string>('current_term');
  const [selectedView, setSelectedView] = useState<string>('overview');
  const [comparisonType, setComparisonType] = useState<string>('classes');

  // Mock analytics data
  const mockPerformanceData: PerformanceData[] = [
    { period: 'Sept 2024', average: 12.5, passRate: 78, studentsCount: 652 },
    { period: 'Oct 2024', average: 13.2, passRate: 82, studentsCount: 648 },
    { period: 'Nov 2024', average: 12.8, passRate: 80, studentsCount: 645 },
    { period: 'Déc 2024', average: 13.5, passRate: 85, studentsCount: 642 }
  ];

  const mockSubjectPerformance: SubjectPerformance[] = [
    { subject: 'Mathématiques', average: 14.2, coefficient: 4, studentsCount: 642, trend: 'up' },
    { subject: 'Français', average: 13.8, coefficient: 4, studentsCount: 642, trend: 'up' },
    { subject: 'Anglais', average: 12.5, coefficient: 2, studentsCount: 642, trend: 'stable' },
    { subject: 'Sciences Physiques', average: 11.8, coefficient: 3, studentsCount: 642, trend: 'down' },
    { subject: 'SVT', average: 13.1, coefficient: 3, studentsCount: 642, trend: 'up' },
    { subject: 'Histoire-Géo', average: 12.9, coefficient: 2, studentsCount: 642, trend: 'stable' }
  ];

  const mockClassComparison: ClassComparison[] = [
    { className: '6ème A', average: 14.5, studentsCount: 32, rank: 1, improvement: 0.8 },
    { className: '6ème B', average: 13.2, studentsCount: 29, rank: 2, improvement: 0.3 },
    { className: '5ème A', average: 12.8, studentsCount: 35, rank: 3, improvement: -0.2 },
    { className: '5ème B', average: 12.1, studentsCount: 31, rank: 4, improvement: 0.5 },
    { className: '4ème A', average: 11.9, studentsCount: 33, rank: 5, improvement: -0.1 },
    { className: '4ème B', average: 11.5, studentsCount: 28, rank: 6, improvement: 0.2 }
  ];

  const calculateOverallStats = () => {
    const totalStudents = mockClassComparison.reduce((sum, cls) => sum + cls.studentsCount, 0);
    const weightedAverage = mockClassComparison.reduce((sum, cls) => 
      sum + (cls.average * cls.studentsCount), 0) / totalStudents;
    const passRate = Math.round((mockClassComparison.filter(cls => cls.average >= 10).length / mockClassComparison.length) * 100);
    
    return {
      totalStudents,
      overallAverage: Math.round(weightedAverage * 100) / 100,
      passRate,
      totalClasses: mockClassComparison.length
    };
  };

  const stats = calculateOverallStats();

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analyses & Rapports</h1>
            <p className="text-gray-600 mt-1">
              Tableaux de bord analytiques et rapports de performance
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span>Actualiser</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Exporter</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Période d'analyse
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            >
              <option value="current_term">Trimestre actuel</option>
              <option value="last_term">Trimestre précédent</option>
              <option value="current_year">Année scolaire</option>
              <option value="last_year">Année précédente</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vue d'analyse
            </label>
            <select
              value={selectedView}
              onChange={(e) => setSelectedView(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            >
              <option value="overview">Vue d'ensemble</option>
              <option value="performance">Performance détaillée</option>
              <option value="trends">Tendances temporelles</option>
              <option value="comparison">Analyses comparatives</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de comparaison
            </label>
            <select
              value={comparisonType}
              onChange={(e) => setComparisonType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            >
              <option value="classes">Par classe</option>
              <option value="subjects">Par matière</option>
              <option value="periods">Par période</option>
              {tenant?.type === 'patronat' && (
                <option value="schools">Par école</option>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Élèves</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalStudents}</p>
              <p className="text-sm text-green-600 mt-1">+12 ce mois</p>
            </div>
            <div className="bg-blue-500 rounded-lg p-3 text-white">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Moyenne Générale</p>
              <p className="text-2xl font-bold text-primary-color mt-1">{stats.overallAverage}/20</p>
              <p className="text-sm text-green-600 mt-1">+0.3 vs mois dernier</p>
            </div>
            <div className="bg-primary-color rounded-lg p-3 text-white">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taux de Réussite</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.passRate}%</p>
              <p className="text-sm text-green-600 mt-1">+5% vs trimestre</p>
            </div>
            <div className="bg-green-500 rounded-lg p-3 text-white">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Classes Actives</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{stats.totalClasses}</p>
              <p className="text-sm text-blue-600 mt-1">Toutes niveaux</p>
            </div>
            <div className="bg-orange-500 rounded-lg p-3 text-white">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Analytics Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance by Subject */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Performance par Matière
            </h3>
            <button className="text-primary-color hover:text-green-700 text-sm font-medium">
              Voir détails
            </button>
          </div>

          <div className="space-y-4">
            {mockSubjectPerformance.map((subject, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(subject.trend)}
                    <div>
                      <h4 className="font-medium text-gray-900">{subject.subject}</h4>
                      <p className="text-sm text-gray-600">
                        Coef. {subject.coefficient} • {subject.studentsCount} élèves
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary-color">
                    {subject.average}/20
                  </p>
                  <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-primary-color h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(subject.average / 20) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Class Rankings */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Classement des Classes
            </h3>
            <button className="text-primary-color hover:text-green-700 text-sm font-medium">
              Voir tout
            </button>
          </div>

          <div className="space-y-3">
            {mockClassComparison.slice(0, 6).map((classData, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index < 3 
                      ? 'bg-primary-color text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {classData.rank}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{classData.className}</h4>
                    <p className="text-sm text-gray-600">{classData.studentsCount} élèves</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary-color">
                    {classData.average}/20
                  </p>
                  <p className={`text-xs ${
                    classData.improvement > 0 
                      ? 'text-green-600' 
                      : classData.improvement < 0 
                      ? 'text-red-600' 
                      : 'text-gray-600'
                  }`}>
                    {classData.improvement > 0 ? '+' : ''}{classData.improvement}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Trends Chart */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Évolution des Performances
          </h3>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm bg-primary-color text-white rounded-lg">
              Moyenne
            </button>
            <button className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Taux de réussite
            </button>
          </div>
        </div>

        <div className="h-64 flex items-end justify-between space-x-2">
          {mockPerformanceData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-200 rounded-t-lg relative" style={{ height: '200px' }}>
                <div
                  className="bg-primary-color rounded-t-lg absolute bottom-0 w-full transition-all duration-500"
                  style={{ height: `${(data.average / 20) * 200}px` }}
                />
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-900">
                  {data.average}
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600 text-center">
                {data.period}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Reports Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Rapports Détaillés
          </h3>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Générer Rapport</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-color transition-colors cursor-pointer">
            <div className="flex items-center space-x-3 mb-3">
              <BarChart3 className="w-6 h-6 text-primary-color" />
              <h4 className="font-medium text-gray-900">Rapport de Performance</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Analyse détaillée des performances par classe, matière et période.
            </p>
            <button className="text-primary-color text-sm font-medium hover:text-green-700">
              Générer →
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-color transition-colors cursor-pointer">
            <div className="flex items-center space-x-3 mb-3">
              <TrendingUp className="w-6 h-6 text-primary-color" />
              <h4 className="font-medium text-gray-900">Analyse des Tendances</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Évolution temporelle et prédictions de performance.
            </p>
            <button className="text-primary-color text-sm font-medium hover:text-green-700">
              Générer →
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-color transition-colors cursor-pointer">
            <div className="flex items-center space-x-3 mb-3">
              <Award className="w-6 h-6 text-primary-color" />
              <h4 className="font-medium text-gray-900">Rapport d'Excellence</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Identification des élèves et classes les plus performants.
            </p>
            <button className="text-primary-color text-sm font-medium hover:text-green-700">
              Générer →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};