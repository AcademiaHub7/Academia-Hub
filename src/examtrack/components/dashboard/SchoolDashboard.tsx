import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useExamStore } from '../../stores/examStore';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../ui/Sidebar';
import { 
  Users, 
  TrendingUp,
  Plus,
  FileText,
  Clock,
  CheckCircle,
  Eye,
  Edit,
  Download,
  RefreshCw,
  Calendar
} from 'lucide-react';

const upcomingExams = [
  {
    id: '1',
    name: 'Composition de Mathématiques',
    date: '2024-12-15',
    class: '6ème A',
    status: 'scheduled',
  },
  {
    id: '2',
    name: 'Devoir de Français',
    date: '2024-12-18',
    class: '5ème B',
    status: 'scheduled',
  },
  {
    id: '3',
    name: 'Examen Blanc BEPC',
    date: '2024-12-20',
    class: '3ème',
    status: 'pending_approval',
  },
];

const classPerformance = [
  { class: '6ème A', students: 32, average: 13.2, rank: 1 },
  { class: '6ème B', students: 29, average: 12.8, rank: 2 },
  { class: '5ème A', students: 35, average: 12.5, rank: 3 },
  { class: '5ème B', students: 31, average: 12.1, rank: 4 },
];

const SchoolDashboard: React.FC = () => {
  const { user, tenant } = useAuthStore();
  const { exams } = useExamStore();
  const navigate = useNavigate();
  // État pour le rafraîchissement des données
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!user) {
    return null;
  }

  const schoolExams = exams.filter(exam => exam.schoolId === tenant?.id);
  const completedExams = schoolExams.filter(exam => exam.status === 'completed').length;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    alert('Données actualisées !');
  };

  const handleCreateExam = () => {
    navigate('/exams?action=create');
  };

  const handleGradeEntry = () => {
    navigate('/grades');
  };

  const handleViewResults = () => {
    navigate('/results');
  };

  const handleManageStudents = () => {
    navigate('/users?role=student');
  };

  const handleViewExamDetails = (examId: string) => {
    navigate(`/exams?exam=${examId}`);
  };

  const handleEditExam = (examId: string) => {
    navigate(`/exams?exam=${examId}&action=edit`);
  };

  const handleViewClassDetails = (className: string) => {
    navigate(`/results?class=${className}`);
  };

  const handleExportData = () => {
    const data = {
      school: tenant?.name,
      students: 652,
      exams: completedExams,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `school-${tenant?.name}-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tableau de Bord - {tenant?.name}
              </h1>
              <p className="text-gray-600 mt-1">
                Gestion des examens et suivi pédagogique
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Actualiser</span>
              </button>
              <div className="text-right">
                <p className="text-sm text-gray-500">Année Scolaire</p>
                <p className="text-lg font-semibold text-primary-color">
                  {tenant?.settings.academicYear}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/users?role=student')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Élèves</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">652</p>
                <p className="text-sm text-green-600 mt-1">+12 ce mois</p>
              </div>
              <div className="bg-blue-500 rounded-lg p-3 text-white">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/exams')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Examens Programmés</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{upcomingExams.length}</p>
                <p className="text-sm text-blue-600 mt-1">Cette semaine</p>
              </div>
              <div className="bg-orange-500 rounded-lg p-3 text-white">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/grades')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Notes en Attente</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">24</p>
                <p className="text-sm text-orange-600 mt-1">À saisir</p>
              </div>
              <div className="bg-purple-500 rounded-lg p-3 text-white">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/results')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Résultats Publiés</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{completedExams}</p>
                <p className="text-sm text-green-600 mt-1">Ce trimestre</p>
              </div>
              <div className="bg-green-500 rounded-lg p-3 text-white">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Exams */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Examens à Venir
              </h2>
              <button
                onClick={handleCreateExam}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Nouvel Examen</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {upcomingExams.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      exam.status === 'scheduled' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                    <div>
                      <h3 className="font-medium text-gray-900">{exam.name}</h3>
                      <p className="text-sm text-gray-600">{exam.class} • {exam.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {exam.status === 'pending_approval' && (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                        En attente
                      </span>
                    )}
                    <button
                      onClick={() => handleViewExamDetails(exam.id)}
                      className="p-2 text-gray-400 hover:text-primary-color transition-colors"
                      title={`Voir les détails de l'examen ${exam.name}`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditExam(exam.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title={`Modifier l'examen ${exam.name}`}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Class Performance */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Performance par Classe
              </h2>
              <button
                onClick={() => navigate('/analytics')}
                className="text-primary-color hover:text-green-700 text-sm font-medium"
              >
                Voir tout
              </button>
            </div>
            
            <div className="space-y-4">
              {classPerformance.map((classData) => (
                <div key={classData.class} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors" onClick={() => handleViewClassDetails(classData.class)}>
                  <div>
                    <h3 className="font-medium text-gray-900">{classData.class}</h3>
                    <p className="text-sm text-gray-600">{classData.students} élèves</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary-color">
                      {classData.average}/20
                    </p>
                    <p className="text-xs text-gray-500">#{classData.rank}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => navigate('/results')}
              className="w-full mt-4 px-4 py-2 text-sm text-primary-color border border-primary-color rounded-lg hover:bg-primary-color hover:text-white transition-colors"
            >
              Voir Détails
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Actions Rapides
            </h2>
            <button
              onClick={handleExportData}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Exporter Données</span>
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={handleCreateExam}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-color hover:bg-primary-color/5 transition-colors"
            >
              <Plus className="w-6 h-6 text-primary-color mb-2" />
              <span className="text-sm font-medium text-gray-900">Créer Examen</span>
            </button>
            
            <button
              onClick={handleGradeEntry}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-color hover:bg-primary-color/5 transition-colors"
            >
              <FileText className="w-6 h-6 text-primary-color mb-2" />
              <span className="text-sm font-medium text-gray-900">Saisir Notes</span>
            </button>
            
            <button
              onClick={handleViewResults}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-color hover:bg-primary-color/5 transition-colors"
            >
              <TrendingUp className="w-6 h-6 text-primary-color mb-2" />
              <span className="text-sm font-medium text-gray-900">Voir Résultats</span>
            </button>
            
            <button
              onClick={handleManageStudents}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-color hover:bg-primary-color/5 transition-colors"
            >
              <Users className="w-6 h-6 text-primary-color mb-2" />
              <span className="text-sm font-medium text-gray-900">Gérer Élèves</span>
            </button>
          </div>
        </div>

        {/* School Statistics */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Statistiques de l'École
            </h2>
            <button
              onClick={() => navigate('/analytics')}
              className="text-primary-color hover:text-green-700 text-sm font-medium"
            >
              Analyse détaillée →
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors" onClick={() => navigate('/analytics?metric=average')}>
              <div className="text-2xl font-bold text-primary-color mb-2">12.8</div>
              <p className="text-sm text-gray-600">Moyenne Générale</p>
            </div>
            <div className="text-center cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors" onClick={() => navigate('/analytics?metric=success-rate')}>
              <div className="text-2xl font-bold text-green-600 mb-2">87%</div>
              <p className="text-sm text-gray-600">Taux de Réussite</p>
            </div>
            <div className="text-center cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors" onClick={() => navigate('/analytics?metric=attendance')}>
              <div className="text-2xl font-bold text-blue-600 mb-2">96%</div>
              <p className="text-sm text-gray-600">Taux de Présence</p>
            </div>
            <div className="text-center cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors" onClick={() => navigate('/analytics?metric=ranking')}>
              <div className="text-2xl font-bold text-orange-600 mb-2">3ème</div>
              <p className="text-sm text-gray-600">Rang Régional</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolDashboard;
