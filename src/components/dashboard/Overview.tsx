import React from 'react';
import { 
  Users, 
  GraduationCap, 
  TrendingUp, 
  DollarSign,
  Calendar,
  BookOpen,
  MessageSquare,
  Award,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const Overview: React.FC = () => {
  const stats = [
    {
      title: 'Total Élèves',
      value: '1,247',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-600 to-blue-700'
    },
    {
      title: 'Revenus du mois',
      value: '€45,230',
      change: '+8%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-600 to-green-700'
    },
    {
      title: 'Taux de réussite',
      value: '92.5%',
      change: '+3%',
      trend: 'up',
      icon: Award,
      color: 'from-purple-600 to-purple-700'
    },
    {
      title: 'Enseignants actifs',
      value: '78',
      change: '+2',
      trend: 'up',
      icon: GraduationCap,
      color: 'from-orange-600 to-orange-700'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'payment',
      message: 'Paiement reçu de Marie Dubois (Classe 3ème A)',
      time: 'Il y a 5 min',
      status: 'success'
    },
    {
      id: 2,
      type: 'enrollment',
      message: 'Nouvel élève inscrit: Pierre Martin (Classe 2nde B)',
      time: 'Il y a 15 min',
      status: 'info'
    },
    {
      id: 3,
      type: 'alert',
      message: 'Absence non justifiée: Sophie Lambert (Classe 1ère C)',
      time: 'Il y a 30 min',
      status: 'warning'
    },
    {
      id: 4,
      type: 'grade',
      message: 'Notes saisies pour le contrôle de Mathématiques (Terminale S)',
      time: 'Il y a 1h',
      status: 'success'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Conseil de classe 3ème A',
      date: '2024-01-15',
      time: '14:00',
      type: 'meeting'
    },
    {
      id: 2,
      title: 'Réunion parents-professeurs',
      date: '2024-01-18',
      time: '18:00',
      type: 'event'
    },
    {
      id: 3,
      title: 'Examen blanc Terminale',
      date: '2024-01-22',
      time: '08:00',
      type: 'exam'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600">Aperçu général de votre établissement</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Activités récentes</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Voir tout
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-100' :
                  activity.status === 'warning' ? 'bg-yellow-100' :
                  'bg-blue-100'
                }`}>
                  {activity.status === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                  {activity.status === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                  {activity.status === 'info' && <Users className="w-4 h-4 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Événements à venir</h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="text-sm font-medium text-gray-900">{event.title}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {event.date} à {event.time}
                </p>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
            Voir le calendrier complet
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Actions rapides</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
            <Users className="w-8 h-8 text-gray-600 group-hover:text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Nouvel élève</span>
          </button>
          
          <button className="flex flex-col items-center p-4 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group">
            <DollarSign className="w-8 h-8 text-gray-600 group-hover:text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">Encaissement</span>
          </button>
          
          <button className="flex flex-col items-center p-4 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all group">
            <BookOpen className="w-8 h-8 text-gray-600 group-hover:text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">Saisir notes</span>
          </button>
          
          <button className="flex flex-col items-center p-4 rounded-xl border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all group">
            <MessageSquare className="w-8 h-8 text-gray-600 group-hover:text-orange-600 mb-2" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-orange-700">Message parents</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview;