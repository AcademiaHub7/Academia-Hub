import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Download,
  Edit,
  Eye,
  FileText,
  BarChart3,
  Users,
  Award,
  TrendingUp,
  Calendar,
  Brain,
  Settings
} from 'lucide-react';
import { GradeModal, ReportCardModal, AlertModal, ConfirmModal } from '../modals';
import { EvaluationSettingsModal } from '../modals';
import { getGradeAppreciation } from '../../utils/gradeCalculations';

const Examinations: React.FC = () => {
  const [activeTab, setActiveTab] = useState('grades');
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isReportCardModalOpen, setIsReportCardModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const examStats = [
    {
      title: 'Notes saisies ce mois',
      value: '2,847',
      change: '+15%',
      icon: BookOpen,
      color: 'from-blue-600 to-blue-700'
    },
    {
      title: 'Moyenne générale',
      value: '14.2/20',
      change: '+0.3',
      icon: BarChart3,
      color: 'from-green-600 to-green-700'
    },
    {
      title: 'Taux de réussite',
      value: '87.5%',
      change: '+2.1%',
      icon: Award,
      color: 'from-purple-600 to-purple-700'
    },
    {
      title: 'Bulletins générés',
      value: '1,189',
      change: '+45',
      icon: FileText,
      color: 'from-orange-600 to-orange-700'
    }
  ];

  const recentGrades = [
    {
      id: 1,
      subject: 'Mathématiques',
      class: 'Terminale S',
      examType: 'Contrôle continu',
      date: '2024-01-10',
      teacher: 'M. Dubois',
      gradesEntered: 28,
      totalStudents: 30,
      average: 14.5,
      status: 'completed'
    },
    {
      id: 2,
      subject: 'Français',
      class: '1ère L',
      examType: 'Dissertation',
      date: '2024-01-09',
      teacher: 'Mme Martin',
      gradesEntered: 25,
      totalStudents: 27,
      average: 12.8,
      status: 'in-progress'
    },
    {
      id: 3,
      subject: 'Histoire-Géo',
      class: '3ème A',
      examType: 'Évaluation',
      date: '2024-01-08',
      teacher: 'M. Laurent',
      gradesEntered: 22,
      totalStudents: 22,
      average: 13.2,
      status: 'completed'
    }
  ];

  const upcomingExams = [
    {
      id: 1,
      subject: 'Physique-Chimie',
      class: 'Terminale S',
      type: 'Examen blanc',
      date: '2024-01-15',
      time: '08:00',
      duration: '4h',
      room: 'Salle 201'
    },
    {
      id: 2,
      subject: 'Anglais',
      class: '2nde A',
      type: 'Oral',
      date: '2024-01-16',
      time: '14:00',
      duration: '2h',
      room: 'Labo langues'
    },
    {
      id: 3,
      subject: 'SVT',
      class: '1ère S',
      type: 'TP Évalué',
      date: '2024-01-17',
      time: '10:00',
      duration: '2h',
      room: 'Labo SVT'
    }
  ];

  const classReports = [
    {
      class: 'Terminale S',
      students: 30,
      average: 14.2,
      passRate: 93.3,
      improvement: '+1.2'
    },
    {
      class: '1ère L',
      students: 27,
      average: 13.8,
      passRate: 88.9,
      improvement: '+0.8'
    },
    {
      class: '3ème A',
      students: 22,
      average: 12.5,
      passRate: 81.8,
      improvement: '-0.3'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'pending': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getGradeColor = (average: number) => {
    if (average >= 16) return 'text-green-600 dark:text-green-400';
    if (average >= 14) return 'text-blue-600 dark:text-blue-400';
    if (average >= 10) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const handleNewGrade = () => {
    setIsEditMode(false);
    setSelectedEvaluation(null);
    setIsGradeModalOpen(true);
  };

  const handleEditGrade = (evaluation: any) => {
    setIsEditMode(true);
    setSelectedEvaluation(evaluation);
    setIsGradeModalOpen(true);
  };

  const handleViewReportCard = (student: any) => {
    setSelectedStudent(student);
    setIsReportCardModalOpen(true);
  };

  const handleOpenSettings = () => {
    setIsSettingsModalOpen(true);
  };

  const handleSaveGrade = (data: any) => {
    console.log('Saving grade data:', data);
    setIsAlertModalOpen(true);
  };

  const handleSaveSettings = (settings: any) => {
    console.log('Saving settings:', settings);
    setIsAlertModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Examens & Évaluation</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestion des notes et évaluations avec IA</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button 
            onClick={handleOpenSettings}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Settings className="w-4 h-4 mr-2" />
            Paramètres
          </button>
          <button 
            onClick={handleNewGrade}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Saisir notes
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {examStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 dark:text-green-400 mr-1" />
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">{stat.change}</span>
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

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('grades')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'grades'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Saisie des Notes
            </button>
            <button
              onClick={() => setActiveTab('exams')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'exams'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Examens à venir
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Rapports & Analytics
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Paramètres d'évaluation
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'grades' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Notes récemment saisies</h3>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtres
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                {recentGrades.map((grade) => (
                  <div key={grade.id} className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{grade.subject}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{grade.class} • {grade.examType}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">{grade.date} • {grade.teacher}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Progression</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            {grade.gradesEntered}/{grade.totalStudents}
                          </p>
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(grade.gradesEntered / grade.totalStudents) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Moyenne</p>
                          <p className={`text-xl font-bold ${getGradeColor(grade.average)}`}>
                            {grade.average}/20
                          </p>
                        </div>
                        
                        <div className="text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(grade.status)}`}>
                            {grade.status === 'completed' ? 'Terminé' : 'En cours'}
                          </span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleViewReportCard({ name: 'Marie Dubois', class: grade.class })}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditGrade(grade)}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'exams' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Examens programmés</h3>
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Programmer examen
                </button>
              </div>

              <div className="grid gap-4">
                {upcomingExams.map((exam) => (
                  <div key={exam.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{exam.subject}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{exam.class} • {exam.type}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">{exam.room}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{exam.date}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{exam.time} • {exam.duration}</p>
                        <div className="flex space-x-2 mt-2">
                          <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50">
                            Modifier
                          </button>
                          <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
                            Détails
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Analytics par classe</h3>
                <div className="flex space-x-2">
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Graphiques détaillés
                  </button>
                  <button className="inline-flex items-center px-3 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800">
                    <FileText className="w-4 h-4 mr-2" />
                    Générer bulletins
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                {classReports.map((report, index) => (
                  <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-900/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{report.class}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{report.students} élèves</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-8 text-center">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Moyenne générale</p>
                          <p className={`text-xl font-bold ${getGradeColor(report.average)}`}>
                            {report.average}/20
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Taux de réussite</p>
                          <p className="text-xl font-bold text-green-600 dark:text-green-400">{report.passRate}%</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Évolution</p>
                          <p className={`text-xl font-bold ${
                            report.improvement.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {report.improvement}
                          </p>
                        </div>
                      </div>
                      
                      <button className="px-4 py-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                        Voir détails
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Insights */}
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-900/30">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Insights IA</h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li>• La classe de Terminale S montre une amélioration constante (+1.2 points)</li>
                      <li>• Attention particulière recommandée pour la 3ème A (baisse de -0.3 points)</li>
                      <li>• Les mathématiques affichent les meilleures performances globales</li>
                      <li>• Prédiction: 92% de taux de réussite au baccalauréat pour cette promotion</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Paramètres d'évaluation</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Système d'évaluation
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Système actuel</p>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">Système Éducatif Béninois</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Niveaux configurés:</p>
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs">Maternelle</span>
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs">Primaire</span>
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-xs">Secondaire</span>
                      </div>
                    </div>
                    <button 
                      onClick={handleOpenSettings}
                      className="w-full px-4 py-2 mt-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
                    >
                      Modifier les paramètres
                    </button>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                    Conditions de passage
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Primaire</h5>
                      <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <p><strong>Passage en classe supérieure:</strong> Moyenne &ge; 10.00</p>
                        <p><strong>Redoublement:</strong> Moyenne &lt; 10.00</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Secondaire</h5>
                      <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <p><strong>Passage direct:</strong> Moyenne &ge; 10.00</p>
                        <p><strong>Conseil de classe:</strong> 8.00 &le; Moyenne &lt; 10.00</p>
                        <p><strong>Redoublement:</strong> Moyenne &lt; 8.00</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Mentions au BAC</h5>
                      <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <p><strong>Très Bien:</strong> Moyenne &ge; 16.00</p>
                        <p><strong>Bien:</strong> 14.00 &le; Moyenne &lt; 16.00</p>
                        <p><strong>Assez Bien:</strong> 12.00 &le; Moyenne &lt; 14.00</p>
                        <p><strong>Passable:</strong> 10.00 &le; Moyenne &lt; 12.00</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                  Approche Par Compétences (APC)
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Échelle APC</h5>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xs">4</div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Compétence maîtrisée (Expert)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">3</div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Compétence acquise (Avancé)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-xs">2</div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Compétence en cours d'acquisition (Intermédiaire)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs">1</div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Compétence non acquise (Débutant)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Domaines de compétences</h5>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700 dark:text-gray-300">• Compétences disciplinaires</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">• Compétences méthodologiques</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">• Compétences sociales et civiques</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">• Compétences personnelles et autonomie</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <GradeModal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        onSave={handleSaveGrade}
        evaluationData={selectedEvaluation}
        isEdit={isEditMode}
      />

      <ReportCardModal
        isOpen={isReportCardModalOpen}
        onClose={() => setIsReportCardModalOpen(false)}
        studentData={selectedStudent}
      />

      <EvaluationSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSave={handleSaveSettings}
        currentSettings={{
          defaultSystem: 'benin',
          primaryGradingSystem: 'numeric',
          secondaryGradingSystem: 'numeric_weighted',
          enableAPC: true,
          passingGrade: 10,
          councilThreshold: 8,
          maxGrade: 20
        }}
      />

      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        title="Opération réussie"
        message="Les données ont été enregistrées avec succès."
        type="success"
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => setIsConfirmModalOpen(false)}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cette évaluation ? Cette action est irréversible."
        type="danger"
      />
    </div>
  );
};

export default Examinations;