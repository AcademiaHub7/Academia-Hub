import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { 
  School, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Plus,
  BarChart3,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface KPICard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

const kpiData: KPICard[] = [
  {
    title: 'Patronats Actifs',
    value: '12',
    change: '+2',
    changeType: 'positive',
    icon: <School className="w-6 h-6" />,
    color: 'bg-blue-500',
  },
  {
    title: 'Écoles Inscrites',
    value: '248',
    change: '+15',
    changeType: 'positive',
    icon: <School className="w-6 h-6" />,
    color: 'bg-green-500',
  },
  {
    title: 'Utilisateurs Actifs',
    value: '3,247',
    change: '+156',
    changeType: 'positive',
    icon: <Users className="w-6 h-6" />,
    color: 'bg-purple-500',
  },
  {
    title: 'Examens ce Mois',
    value: '89',
    change: '+12',
    changeType: 'positive',
    icon: <BookOpen className="w-6 h-6" />,
    color: 'bg-orange-500',
  },
];

const recentActivities = [
  {
    id: 1,
    type: 'patronat_created',
    message: 'Nouveau patronat "Zou" créé',
    time: 'Il y a 2 heures',
    icon: <Plus className="w-4 h-4 text-green-500" />,
  },
  {
    id: 2,
    type: 'school_validated',
    message: 'École "Lycée Saint-Marc" validée',
    time: 'Il y a 4 heures',
    icon: <CheckCircle className="w-4 h-4 text-green-500" />,
  },
  {
    id: 3,
    type: 'exam_issue',
    message: 'Problème signalé - Examen BEPC',
    time: 'Il y a 6 heures',
    icon: <AlertCircle className="w-4 h-4 text-orange-500" />,
  },
];

export const SuperAdminDashboard: React.FC = () => {
  const { tenant } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Tableau de Bord - Administration Centrale
            </h1>
            <p className="text-gray-600 mt-1">
              Supervision globale de la plateforme EducMaster Academia Hub
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Année Scolaire</p>
            <p className="text-lg font-semibold text-primary-color">
              {tenant?.settings.academicYear}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                <p className={`text-sm mt-1 ${
                  kpi.changeType === 'positive' 
                    ? 'text-green-600' 
                    : kpi.changeType === 'negative' 
                    ? 'text-red-600' 
                    : 'text-gray-600'
                }`}>
                  {kpi.change} ce mois
                </p>
              </div>
              <div className={`${kpi.color} rounded-lg p-3 text-white`}>
                {kpi.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Regional Overview */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Vue d'Ensemble par Région
            </h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {[
              { region: 'Atlantique', schools: 45, students: 12450, performance: 87 },
              { region: 'Littoral', schools: 38, students: 10200, performance: 84 },
              { region: 'Ouémé', schools: 42, students: 11800, performance: 89 },
              { region: 'Zou', schools: 35, students: 9500, performance: 82 },
            ].map((region) => (
              <div key={region.region} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{region.region}</h3>
                  <p className="text-sm text-gray-600">
                    {region.schools} écoles • {region.students.toLocaleString()} élèves
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Performance</p>
                  <p className="text-lg font-semibold text-primary-color">
                    {region.performance}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Activités Récentes
          </h2>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 px-4 py-2 text-sm text-primary-color border border-primary-color rounded-lg hover:bg-primary-color hover:text-white transition-colors">
            Voir Toutes les Activités
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Actions Rapides
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-color hover:bg-primary-color/5 transition-colors">
            <Plus className="w-6 h-6 text-primary-color mb-2" />
            <span className="text-sm font-medium text-gray-900">Nouveau Patronat</span>
          </button>
          
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-color hover:bg-primary-color/5 transition-colors">
            <Users className="w-6 h-6 text-primary-color mb-2" />
            <span className="text-sm font-medium text-gray-900">Gérer Utilisateurs</span>
          </button>
          
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-color hover:bg-primary-color/5 transition-colors">
            <BarChart3 className="w-6 h-6 text-primary-color mb-2" />
            <span className="text-sm font-medium text-gray-900">Rapports Globaux</span>
          </button>
          
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-color hover:bg-primary-color/5 transition-colors">
            <TrendingUp className="w-6 h-6 text-primary-color mb-2" />
            <span className="text-sm font-medium text-gray-900">Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
};