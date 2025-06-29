import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  Brain, 
  Calendar, 
  Download, 
  Filter,
  Star, 
  Target, 
  PieChart, 
  LineChart,
  Activity,
  Lightbulb,
  Trophy,
  FileText,
  Zap,
  Award,
  Eye
} from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';
import { AnalyticsReportModal, AIInsightModal, HonorRollModal } from '../modals';

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('trimester');
  const [selectedClass, setSelectedClass] = useState('all');
  
  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isInsightModalOpen, setIsInsightModalOpen] = useState(false);
  const [isHonorRollModalOpen, setIsHonorRollModalOpen] = useState(false);

  const analyticsStats = [
    {
      title: 'Moyenne générale',
      value: '14.2/20',
      change: '+0.8',
      trend: 'up',
      icon: BarChart3,
      color: 'from-blue-600 to-blue-700'
    },
    {
      title: 'Taux de réussite',
      value: '87.5%',
      change: '+3.2%',
      trend: 'up',
      icon: Trophy,
      color: 'from-green-600 to-green-700'
    },
    {
      title: 'Élèves à risque',
      value: '23',
      change: '-5',
      trend: 'down',
      icon: AlertTriangle,
      color: 'from-red-600 to-red-700'
    },
    {
      title: 'Prédiction réussite',
      value: '92.1%',
      change: '+1.5%',
      trend: 'up',
      icon: Brain,
      color: 'from-purple-600 to-purple-700'
    }
  ];

  const performanceData = [
    {
      class: 'Terminale S',
      students: 30,
      average: 15.2,
      successRate: 93.3,
      riskStudents: 2,
      prediction: 95.8,
      trend: 'up'
    },
    {
      class: '1ère L',
      students: 27,
      average: 13.8,
      successRate: 88.9,
      riskStudents: 3,
      prediction: 91.2,
      trend: 'up'
    },
    {
      class: '3ème A',
      students: 22,
      average: 12.5,
      successRate: 81.8,
      riskStudents: 4,
      prediction: 85.4,
      trend: 'stable'
    },
    {
      class: '2nde B',
      students: 25,
      average: 11.9,
      successRate: 76.0,
      riskStudents: 6,
      prediction: 79.3,
      trend: 'down'
    }
  ];

  const honorRoll = [
    {
      rank: 1,
      studentName: 'Marie Dubois',
      class: 'Terminale S',
      average: 18.5,
      subjects: ['Mathématiques', 'Physique', 'SVT'],
      improvement: '+1.2',
      aiFactors: ['Régularité', 'Participation', 'Méthode de travail']
    },
    {
      rank: 2,
      studentName: 'Pierre Martin',
      class: '1ère L',
      average: 17.8,
      subjects: ['Français', 'Histoire', 'Philosophie'],
      improvement: '+0.9',
      aiFactors: ['Créativité', 'Analyse critique', 'Expression écrite']
    },
    {
      rank: 3,
      studentName: 'Sophie Lambert',
      class: 'Terminale S',
      average: 17.3,
      subjects: ['Mathématiques', 'Physique', 'Anglais'],
      improvement: '+1.5',
      aiFactors: ['Logique', 'Persévérance', 'Autonomie']
    }
  ];

  const aiInsights = [
    {
      type: 'trend',
      title: 'Amélioration générale des résultats',
      description: 'Les moyennes ont augmenté de 0.8 points ce trimestre, principalement en sciences.',
      confidence: 94,
      recommendation: 'Maintenir les méthodes pédagogiques actuelles en sciences.'
    },
    {
      type: 'risk',
      title: 'Détection de décrochage',
      description: '23 élèves présentent des signaux de décrochage scolaire.',
      confidence: 87,
      recommendation: 'Mise en place d\'un accompagnement personnalisé pour ces élèves.'
    },
    {
      type: 'prediction',
      title: 'Prédiction de réussite',
      description: 'Le taux de réussite prévu pour cette année est de 92.1%.',
      confidence: 91,
      recommendation: 'Renforcer le soutien pour atteindre 95% de réussite.'
    }
  ];

  const reports = [
    {
      id: 'PV-2024-T1-001',
      title: 'PV Conseil de Classe - Terminale S',
      type: 'Trimestriel',
      date: '2024-01-15',
      status: 'generated',
      insights: 'Excellent trimestre avec 93% de réussite'
    },
    {
      id: 'PV-2024-T1-002',
      title: 'Rapport Annuel - Établissement',
      type: 'Annuel',
      date: '2024-01-10',
      status: 'pending',
      insights: 'Analyse en cours par l\'IA'
    },
    {
      id: 'PV-2024-T1-003',
      title: 'Analyse Comparative - Niveaux',
      type: 'Séquentiel',
      date: '2024-01-08',
      status: 'generated',
      insights: 'Disparités détectées entre les classes'
    }
  ];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4" />;
      case 'down': return <TrendingUp className="w-4 h-4 rotate-180" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  // Handlers for modals
  const handleGenerateReport = () => {
    setIsReportModalOpen(true);
  };

  const handleGenerateInsight = () => {
    setIsInsightModalOpen(true);
  };

  const handleGenerateHonorRoll = () => {
    setIsHonorRollModalOpen(true);
  };

  interface ReportData {
    id: string;
    title: string;
    content: string;
    date: string;
  }

  interface InsightData {
    id: string;
    title: string;
    description: string;
    date: string;
  }

  interface HonorRollData {
    id: string;
    title: string;
    students: Array<{
      id: string;
      name: string;
      score: number;
    }>;
    date: string;
  }

  const handleSaveReport = (reportData: ReportData) => {
    console.log('Saving report:', reportData);
    // Here you would typically save the report to your backend
  };

  const handleSaveInsight = (insightData: InsightData) => {
    console.log('Saving insight:', insightData);
    // Here you would typically save the insight to your backend
  };

  const handleSaveHonorRoll = (honorRollData: HonorRollData) => {
    console.log('Saving honor roll:', honorRollData);
    // Here you would typically save the honor roll to your backend
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistiques & Analytics IA</h1>
          <p className="text-gray-600">Analyses intelligentes et prédictions basées sur l'IA</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </button>
          <button 
            onClick={handleGenerateInsight}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Brain className="w-4 h-4 mr-2" />
            Analyse IA
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className={`w-4 h-4 mr-1 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
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

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Sélectionner la période"
            >
              <option value="trimester">Trimestre</option>
              <option value="semester">Semestre</option>
              <option value="year">Année</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-400" />
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Sélectionner la classe"
            >
              <option value="all">Toutes les classes</option>
              <option value="terminale">Terminale</option>
              <option value="premiere">Première</option>
              <option value="seconde">Seconde</option>
            </select>
          </div>

          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Filter className="w-4 h-4 mr-2" />
            Appliquer filtres
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
              { id: 'performance', label: 'Analytics Performances', icon: TrendingUp },
              { id: 'predictions', label: 'Prédictions IA', icon: Brain },
              { id: 'honor', label: 'Tableaux d\'honneur', icon: Trophy },
              { id: 'reports', label: 'PV Automatisés', icon: FileText },
              { id: 'insights', label: 'Insights IA', icon: Lightbulb }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Tableau de bord analytique</h3>
              
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Performance Chart */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Évolution des moyennes</h4>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <LineChart className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                      <p className="text-gray-600">Graphique interactif des moyennes par période</p>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Trimestre 1</span>
                          <span className="font-bold text-blue-600">13.4</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Trimestre 2</span>
                          <span className="font-bold text-green-600">14.2</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Prédiction T3</span>
                          <span className="font-bold text-purple-600">14.8</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Distribution Chart */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Répartition des notes</h4>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="w-16 h-16 text-green-600 mx-auto mb-4" />
                      <p className="text-gray-600">Distribution par tranches de notes</p>
                      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span>16-20</span>
                          <span className="font-bold text-green-600">25%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>14-16</span>
                          <span className="font-bold text-blue-600">35%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>10-14</span>
                          <span className="font-bold text-yellow-600">30%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>0-10</span>
                          <span className="font-bold text-red-600">10%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Analytics des performances par classe</h3>
                <button 
                  onClick={handleGenerateInsight}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Analyse IA approfondie
                </button>
              </div>

              <div className="grid gap-4">
                {performanceData.map((classData, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{classData.class}</h4>
                          <p className="text-sm text-gray-600">{classData.students} élèves</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-6 text-center">
                        <div>
                          <p className="text-sm text-gray-600">Moyenne</p>
                          <p className="text-xl font-bold text-blue-600">{classData.average}/20</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">Taux réussite</p>
                          <p className="text-xl font-bold text-green-600">{classData.successRate}%</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">À risque</p>
                          <p className="text-xl font-bold text-red-600">{classData.riskStudents}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">Prédiction</p>
                          <div className="flex items-center justify-center">
                            <p className="text-xl font-bold text-purple-600">{classData.prediction}%</p>
                            <div className={`ml-2 ${getTrendColor(classData.trend)}`}>
                              {getTrendIcon(classData.trend)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'predictions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Prédictions et modèles IA</h3>
                <button 
                  onClick={handleGenerateInsight}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Recalculer prédictions
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Prédictions de réussite</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Baccalauréat 2024</span>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-purple-600">92.1%</span>
                        <span className="ml-2 text-sm text-green-600">+1.5%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-purple-600 h-2 rounded-full w-[92.1%]"></div>
                    </div>
                    <p className="text-sm text-gray-600">Confiance du modèle: 94%</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Détection de décrochage</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Élèves à risque</span>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-red-600">23</span>
                        <span className="ml-2 text-sm text-green-600">-5</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Risque élevé</span>
                        <span className="font-bold text-red-600">8 élèves</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Risque modéré</span>
                        <span className="font-bold text-orange-600">15 élèves</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Facteurs prédictifs identifiés par l'IA</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h5 className="font-medium text-gray-900">Assiduité</h5>
                    <p className="text-sm text-gray-600">Impact: 85%</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h5 className="font-medium text-gray-900">Participation</h5>
                    <p className="text-sm text-gray-600">Impact: 72%</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h5 className="font-medium text-gray-900">Méthode de travail</h5>
                    <p className="text-sm text-gray-600">Impact: 68%</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'honor' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Tableaux d'honneur et excellence</h3>
                <button 
                  onClick={handleGenerateHonorRoll}
                  className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  <Award className="w-4 h-4 mr-2" />
                  Générer diplômes
                </button>
              </div>

              <div className="grid gap-4">
                {honorRoll.map((student, index) => (
                  <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">{student.rank}</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{student.studentName}</h4>
                          <p className="text-sm text-gray-600">{student.class} • Moyenne: {student.average}/20</p>
                          <p className="text-sm text-gray-500">Matières d'excellence: {student.subjects.join(', ')}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center mb-2">
                          <Star className="w-5 h-5 text-yellow-500 mr-1" />
                          <span className="text-lg font-bold text-yellow-600">{student.average}/20</span>
                          <span className="ml-2 text-sm text-green-600">{student.improvement}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p className="font-medium">Facteurs de réussite IA:</p>
                          <p>{student.aiFactors.join(', ')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Analyse IA des facteurs d'excellence</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Patterns identifiés</h5>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Régularité dans le travail (100% des élèves d'honneur)</li>
                      <li>• Participation active en classe (95%)</li>
                      <li>• Méthodes de révision efficaces (90%)</li>
                      <li>• Gestion du stress optimale (85%)</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Recommandations</h5>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Partager les méthodes des meilleurs élèves</li>
                      <li>• Organiser des sessions de tutorat par les pairs</li>
                      <li>• Développer les techniques de gestion du stress</li>
                      <li>• Encourager la participation active</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Procès-verbaux automatisés</h3>
                <button 
                  onClick={handleGenerateReport}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Générer nouveau PV
                </button>
              </div>

              <div className="grid gap-4">
                {reports.map((report) => (
                  <div key={report.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{report.title}</h4>
                          <p className="text-sm text-gray-600">{report.type} • {report.id}</p>
                          <p className="text-sm text-gray-500">{report.date}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          report.status === 'generated' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {report.status === 'generated' ? 'Généré' : 'En cours'}
                        </span>
                        <p className="text-sm text-gray-600 mt-2">{report.insights}</p>
                        <div className="flex space-x-2 mt-3">
                          <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200">
                            <Eye className="w-4 h-4 inline mr-1" />
                            Voir
                          </button>
                          <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200">
                            <Download className="w-4 h-4 inline mr-1" />
                            Télécharger
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Insights et recommandations IA</h3>
                <button 
                  onClick={handleGenerateInsight}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Actualiser analyses
                </button>
              </div>

              <div className="grid gap-6">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        insight.type === 'trend' ? 'bg-blue-600' :
                        insight.type === 'risk' ? 'bg-red-600' : 'bg-purple-600'
                      }`}>
                        {insight.type === 'trend' && <TrendingUp className="w-5 h-5 text-white" />}
                        {insight.type === 'risk' && <AlertTriangle className="w-5 h-5 text-white" />}
                        {insight.type === 'prediction' && <Brain className="w-5 h-5 text-white" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900 mb-2">{insight.title}</h4>
                        <p className="text-gray-700 mb-3">{insight.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-600">Confiance: </span>
                            <span className="ml-1 font-bold text-blue-600">{insight.confidence}%</span>
                            <div className="ml-3 w-20">
                              <ProgressBar 
                                value={insight.confidence} 
                                max={100}
                                label={`Niveau de confiance: ${insight.confidence}%`}
                                className="h-2"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                          <p className="text-sm font-medium text-gray-900">Recommandation:</p>
                          <p className="text-sm text-gray-700">{insight.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Tableau de bord exécutif - KPI temps réel</h4>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h5 className="font-bold text-2xl text-green-600">94.2%</h5>
                    <p className="text-sm text-gray-600">Satisfaction globale</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <h5 className="font-bold text-2xl text-blue-600">+12.5%</h5>
                    <p className="text-sm text-gray-600">Amélioration annuelle</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <h5 className="font-bold text-2xl text-purple-600">98.1%</h5>
                    <p className="text-sm text-gray-600">Objectifs atteints</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnalyticsReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSave={handleSaveReport}
      />

      <AIInsightModal
        isOpen={isInsightModalOpen}
        onClose={() => setIsInsightModalOpen(false)}
        onSave={handleSaveInsight}
      />

      <HonorRollModal
        isOpen={isHonorRollModalOpen}
        onClose={() => setIsHonorRollModalOpen(false)}
        onSave={handleSaveHonorRoll}
      />
    </div>
  );
};

export default Analytics;