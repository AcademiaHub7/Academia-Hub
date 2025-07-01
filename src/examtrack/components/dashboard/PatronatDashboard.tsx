import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useSchoolStore } from '../../stores/schoolStore';
import { useExamStore } from '../../stores/examStore';
import { 
  BookOpen, 
  Clock, 
  Download, 
  Eye, 
  School, 
  Users, 
  BarChart3, 
  CheckCircle, 
  AlertTriangle, 
  Plus, 
  RefreshCw 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../ui/Sidebar';

interface SchoolCard {
  id: string;
  name: string;
  students: number;
  status: 'active' | 'pending' | 'inactive';
  lastActivity: string;
  performance: number;
}

const mockSchoolCards: SchoolCard[] = [
  {
    id: '1',
    name: 'École Sainte Marie',
    students: 652,
    status: 'active',
    lastActivity: 'Il y a 2 heures',
    performance: 87,
  },
  {
    id: '2',
    name: 'Collège Notre Dame',
    students: 543,
    status: 'active',
    lastActivity: 'Il y a 1 heure',
    performance: 91,
  },
  {
    id: '3',
    name: 'Lycée Saint Joseph',
    students: 1089,
    status: 'active',
    lastActivity: 'Il y a 30 min',
    performance: 84,
  },
];

const PatronatDashboard: React.FC = () => {
  const { tenant } = useAuthStore();
  const { schools } = useSchoolStore();
  const { exams } = useExamStore();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const totalStudents = schools.reduce((sum, school) => sum + school.currentStudents, 0);
  const activeExams = exams.filter(exam => exam.status === 'ongoing' || exam.status === 'scheduled').length;
  const pendingValidations = exams.filter(exam => exam.status === 'completed' && exam.settings.requirePatronatApproval).length;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simuler le rafraîchissement des données
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
    alert('Données actualisées avec succès !');
  };

  const handleExportData = () => {
    // Simuler l'export des données
    const data = {
      schools: schools.length,
      students: totalStudents,
      exams: activeExams,
      region: tenant?.region,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patronat-${tenant?.region}-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateSchool = () => {
    navigate('/schools');
    // Déclencher l'ouverture du modal de création d'école
    setTimeout(() => {
      const createButton = document.querySelector('[data-create-school]') as HTMLButtonElement;
      if (createButton) {
        createButton.click();
      }
    }, 100);
  };

  const handleViewSchoolDetails = (schoolId: string) => {
    navigate(`/schools?school=${schoolId}`);
  };

  const handleViewAllActions = () => {
    navigate('/analytics');
  };

  const handleValidateExam = (examId: string) => {
    navigate(`/exams?exam=${examId}&action=validate`);
  };

  const handleApproveSchool = (schoolId: string) => {
    if (window.confirm('Approuver cette nouvelle école ?')) {
      alert(`École ${schoolId} approuvée avec succès !`);
    }
  };

  const handleViewReport = () => {
    navigate('/analytics?view=monthly-report');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-primary-color to-green-700 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Tableau de Bord - {tenant?.name}
              </h1>
              <p className="mt-1 opacity-90">
                Gestion régionale des écoles privées • Région {tenant?.region}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-75">Année Scolaire</p>
              <p className="text-lg font-semibold">
                {tenant?.settings.academicYear}
              </p>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/schools')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Écoles Affiliées</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{schools.length}</p>
                <p className="text-sm text-green-600 mt-1">+2 ce mois</p>
              </div>
              <div className="bg-blue-500 rounded-lg p-3 text-white">
                <School className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/analytics')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Élèves</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalStudents.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">+245 ce mois</p>
              </div>
              <div className="bg-green-500 rounded-lg p-3 text-white">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/exams')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Examens Actifs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{activeExams}</p>
                <p className="text-sm text-blue-600 mt-1">En cours</p>
              </div>
              <div className="bg-orange-500 rounded-lg p-3 text-white">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/exams?filter=pending')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Attente</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{pendingValidations}</p>
                <p className="text-sm text-orange-600 mt-1">À valider</p>
              </div>
              <div className="bg-purple-500 rounded-lg p-3 text-white">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Schools Overview */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Écoles de la Région
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>Actualiser</span>
                </button>
                <button
                  onClick={handleCreateSchool}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouvelle École</span>
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {mockSchoolCards.map((school) => (
                <div key={school.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      school.status === 'active' ? 'bg-green-500' :
                      school.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <h3 className="font-medium text-gray-900">{school.name}</h3>
                      <p className="text-sm text-gray-600">
                        {school.students} élèves • {school.lastActivity}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Performance</p>
                      <p className="font-semibold text-primary-color">{school.performance}%</p>
                    </div>
                    <button
                      onClick={() => handleViewSchoolDetails(school.id)}
                      className="p-2 text-gray-400 hover:text-primary-color transition-colors"
                      title={`Voir les détails de ${school.name}`}
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Actions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Actions Requises
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors" onClick={() => handleValidateExam('exam-1')}>
                <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    3 examens à valider
                  </p>
                  <p className="text-xs text-gray-600">
                    Compositions du 1er trimestre
                  </p>
                </div>
                <Eye className="w-4 h-4 text-orange-500" />
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => handleApproveSchool('school-new')}>
                <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Nouvelle école en attente
                  </p>
                  <p className="text-xs text-gray-600">
                    Collège Sainte Cécile - Dossier complet
                  </p>
                </div>
                <Eye className="w-4 h-4 text-blue-500" />
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors" onClick={handleViewReport}>
                <BookOpen className="w-5 h-5 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Rapport mensuel prêt
                  </p>
                  <p className="text-xs text-gray-600">
                    Statistiques régionales disponibles
                  </p>
                </div>
                <Download className="w-4 h-4 text-green-500" />
              </div>
            </div>
            
            <button 
              onClick={handleViewAllActions}
              className="w-full mt-4 px-4 py-2 text-sm text-primary-color border border-primary-color rounded-lg hover:bg-primary-color hover:text-white transition-colors"
            >
              Voir Toutes les Actions
            </button>
          </div>
        </div>

        {/* Regional Statistics */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Statistiques Régionales
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportData}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Exporter</span>
              </button>
              <button
                onClick={() => navigate('/analytics')}
                className="flex items-center space-x-2 px-4 py-2 border border-primary-color text-primary-color rounded-lg hover:bg-primary-color hover:text-white transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Voir Détails</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors" onClick={() => navigate('/analytics?metric=success-rate')}>
              <div className="text-3xl font-bold text-primary-color mb-2">89%</div>
              <p className="text-sm text-gray-600">Taux de Réussite Moyen</p>
            </div>
            <div className="text-center cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors" onClick={() => navigate('/analytics?metric=attendance')}>
              <div className="text-3xl font-bold text-blue-600 mb-2">94%</div>
              <p className="text-sm text-gray-600">Taux de Présence</p>
            </div>
            <div className="text-center cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors" onClick={() => navigate('/analytics?metric=average')}>
              <div className="text-3xl font-bold text-orange-600 mb-2">12.5</div>
              <p className="text-sm text-gray-600">Moyenne Régionale</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PatronatDashboard };