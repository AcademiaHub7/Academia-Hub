import React, { useState } from 'react';
import { 
  UserCheck, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  Users,
  TrendingUp,
  Award,
  Clock,
  DollarSign,
  FileText,
  Settings,
  Eye,
  Edit,
  Download,
  Upload,
  BarChart3,
  Target,
  Star,
  Briefcase,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  CheckCircle
} from 'lucide-react';
import { 
  TeacherModal, 
  EvaluationModal, 
  TrainingModal, 
  ContractModal, 
  ConfirmModal, 
  AlertModal 
} from '../modals';

const HR: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personnel');
  
  // Modals state
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ title: '', message: '', type: 'success' as 'success' | 'error' | 'info' | 'warning' });

  const hrStats = [
    {
      title: 'Personnel actif',
      value: '65',
      change: '+3',
      icon: Users,
      color: 'from-blue-600 to-blue-700'
    },
    {
      title: 'Masse salariale',
      value: '€47,570',
      change: '+2.1%',
      icon: DollarSign,
      color: 'from-green-600 to-green-700'
    },
    {
      title: 'Formations ce mois',
      value: '12',
      change: '+4',
      icon: GraduationCap,
      color: 'from-purple-600 to-purple-700'
    },
    {
      title: 'Satisfaction moyenne',
      value: '4.3/5',
      change: '+0.2',
      icon: Star,
      color: 'from-orange-600 to-orange-700'
    }
  ];

  const personnel = [
    {
      id: 'PER-2024-00001',
      firstName: 'Marie',
      lastName: 'Dubois',
      position: 'Professeur de Français',
      department: 'Enseignement',
      hireDate: '2020-09-01',
      contract: 'CDI',
      salary: 3200,
      phone: '06 12 34 56 78',
      email: 'marie.dubois@ecole.fr',
      address: '123 Rue de la Paix, 75001 Paris',
      status: 'active',
      performance: 4.5,
      lastEvaluation: '2024-01-15'
    },
    {
      id: 'PER-2024-00002',
      firstName: 'Pierre',
      lastName: 'Martin',
      position: 'Professeur de Mathématiques',
      department: 'Enseignement',
      hireDate: '2019-09-01',
      contract: 'CDI',
      salary: 3400,
      phone: '06 98 76 54 32',
      email: 'pierre.martin@ecole.fr',
      address: '456 Avenue des Écoles, 75002 Paris',
      status: 'active',
      performance: 4.8,
      lastEvaluation: '2024-01-10'
    },
    {
      id: 'PER-2024-00003',
      firstName: 'Sophie',
      lastName: 'Laurent',
      position: 'Secrétaire administrative',
      department: 'Administration',
      hireDate: '2021-03-15',
      contract: 'CDI',
      salary: 2800,
      phone: '06 55 66 77 88',
      email: 'sophie.laurent@ecole.fr',
      address: '789 Boulevard de l\'École, 75003 Paris',
      status: 'on-leave',
      performance: 4.2,
      lastEvaluation: '2024-01-08'
    }
  ];

  const contracts = [
    {
      id: 'CONT-2024-001',
      employeeName: 'Marie Dubois',
      employeeId: 'PER-2024-00001',
      position: 'Professeur de Français',
      contractType: 'CDI',
      startDate: '2020-09-01',
      endDate: null,
      salary: 3200,
      workingHours: '18h/semaine',
      status: 'active',
      renewalDate: null
    },
    {
      id: 'CONT-2024-002',
      employeeName: 'Jean Moreau',
      employeeId: 'PER-2024-00004',
      position: 'Professeur remplaçant',
      contractType: 'CDD',
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      salary: 2800,
      workingHours: '15h/semaine',
      status: 'active',
      renewalDate: '2024-05-30'
    }
  ];

  const trainings = [
    {
      id: 'FORM-2024-001',
      title: 'Formation numérique éducatif',
      category: 'Pédagogie',
      instructor: 'Organisme externe',
      startDate: '2024-02-01',
      endDate: '2024-02-03',
      duration: '21h',
      participants: 15,
      cost: 2400,
      status: 'scheduled'
    },
    {
      id: 'FORM-2024-002',
      title: 'Gestion de classe',
      category: 'Management',
      instructor: 'Formation interne',
      startDate: '2024-01-25',
      endDate: '2024-01-25',
      duration: '7h',
      participants: 8,
      cost: 0,
      status: 'completed'
    },
    {
      id: 'FORM-2024-003',
      title: 'Premiers secours',
      category: 'Sécurité',
      instructor: 'Croix-Rouge',
      startDate: '2024-02-15',
      endDate: '2024-02-16',
      duration: '14h',
      participants: 12,
      cost: 1200,
      status: 'scheduled'
    }
  ];

  const evaluations = [
    {
      id: 'EVAL-2024-001',
      employeeName: 'Marie Dubois',
      position: 'Professeur de Français',
      evaluationDate: '2024-01-15',
      evaluator: 'Directeur pédagogique',
      overallScore: 4.5,
      criteria: {
        pedagogy: 4.8,
        communication: 4.5,
        teamwork: 4.2,
        innovation: 4.3
      },
      objectives: [
        'Intégrer plus d\'outils numériques',
        'Participer aux projets interdisciplinaires'
      ],
      nextEvaluation: '2025-01-15'
    },
    {
      id: 'EVAL-2024-002',
      employeeName: 'Pierre Martin',
      position: 'Professeur de Mathématiques',
      evaluationDate: '2024-01-10',
      evaluator: 'Directeur pédagogique',
      overallScore: 4.8,
      criteria: {
        pedagogy: 4.9,
        communication: 4.7,
        teamwork: 4.8,
        innovation: 4.8
      },
      objectives: [
        'Mentorer les nouveaux enseignants',
        'Développer des ressources pédagogiques'
      ],
      nextEvaluation: '2025-01-10'
    }
  ];

  const payroll = [
    {
      month: 'Janvier 2024',
      totalGross: 156780,
      totalNet: 121450,
      socialCharges: 47034,
      taxes: 23560,
      bonuses: 4500,
      employees: 65
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getContractColor = (contractType: string) => {
    switch (contractType) {
      case 'CDI': return 'bg-green-100 text-green-800';
      case 'CDD': return 'bg-blue-100 text-blue-800';
      case 'Stage': return 'bg-purple-100 text-purple-800';
      case 'Freelance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 4.0) return 'text-blue-600';
    if (score >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Handlers pour les modals
  const handleNewTeacher = () => {
    setIsEditMode(false);
    setSelectedItem(null);
    setIsTeacherModalOpen(true);
  };

  const handleEditTeacher = (teacher: any) => {
    setIsEditMode(true);
    setSelectedItem(teacher);
    setIsTeacherModalOpen(true);
  };

  const handleNewEvaluation = () => {
    setIsEditMode(false);
    setSelectedItem(null);
    setIsEvaluationModalOpen(true);
  };

  const handleNewTraining = () => {
    setIsEditMode(false);
    setSelectedItem(null);
    setIsTrainingModalOpen(true);
  };

  const handleNewContract = () => {
    setIsEditMode(false);
    setSelectedItem(null);
    setIsContractModalOpen(true);
  };

  const handleDeleteItem = (item: any, type: string) => {
    setSelectedItem(item);
    setIsConfirmModalOpen(true);
  };

  const handleSaveTeacher = (teacherData: any) => {
    console.log('Saving teacher:', teacherData);
    setAlertMessage({
      title: isEditMode ? 'Personnel mis à jour' : 'Personnel ajouté',
      message: isEditMode 
        ? `Les informations de ${teacherData.firstName} ${teacherData.lastName} ont été mises à jour avec succès.`
        : `${teacherData.firstName} ${teacherData.lastName} a été ajouté(e) avec succès.`,
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  const handleSaveEvaluation = (evaluationData: any) => {
    console.log('Saving evaluation:', evaluationData);
    setAlertMessage({
      title: isEditMode ? 'Évaluation mise à jour' : 'Évaluation ajoutée',
      message: isEditMode 
        ? `L'évaluation de ${evaluationData.employeeName} a été mise à jour avec succès.`
        : `L'évaluation de ${evaluationData.employeeName} a été ajoutée avec succès.`,
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  const handleSaveTraining = (trainingData: any) => {
    console.log('Saving training:', trainingData);
    setAlertMessage({
      title: isEditMode ? 'Formation mise à jour' : 'Formation ajoutée',
      message: isEditMode 
        ? `La formation "${trainingData.title}" a été mise à jour avec succès.`
        : `La formation "${trainingData.title}" a été ajoutée avec succès.`,
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  const handleSaveContract = (contractData: any) => {
    console.log('Saving contract:', contractData);
    setAlertMessage({
      title: isEditMode ? 'Contrat mis à jour' : 'Contrat ajouté',
      message: isEditMode 
        ? `Le contrat de ${contractData.employeeName} a été mis à jour avec succès.`
        : `Le contrat de ${contractData.employeeName} a été ajouté avec succès.`,
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  const confirmDelete = () => {
    console.log('Deleting item:', selectedItem);
    setIsConfirmModalOpen(false);
    setAlertMessage({
      title: 'Élément supprimé',
      message: 'L\'élément a été supprimé avec succès.',
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Personnel & Ressources Humaines</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestion complète du personnel et développement RH</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Download className="w-4 h-4 mr-2" />
            Rapport RH
          </button>
          <button 
            onClick={handleNewTeacher}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau personnel
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {hrStats.map((stat, index) => {
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
            {[
              { id: 'personnel', label: 'Personnel', icon: Users },
              { id: 'contracts', label: 'Contrats', icon: FileText },
              { id: 'training', label: 'Formation', icon: GraduationCap },
              { id: 'evaluations', label: 'Évaluations', icon: Star },
              { id: 'payroll', label: 'Paie', icon: DollarSign },
              { id: 'analytics', label: 'Analytics RH', icon: BarChart3 }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
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
          {activeTab === 'personnel' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Gestion du personnel</h3>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      placeholder="Rechercher personnel..."
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
                {personnel.map((person) => (
                  <div key={person.id} className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-900/30 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <UserCheck className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{person.firstName} {person.lastName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{person.position} • {person.department}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">{person.id} • Embauché le {person.hireDate}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-500">
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-1" />
                              {person.phone}
                            </div>
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-1" />
                              {person.email}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-6 text-center">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Contrat</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getContractColor(person.contract)}`}>
                            {person.contract}
                          </span>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Salaire</p>
                          <p className="text-lg font-bold text-green-600 dark:text-green-400">€{person.salary}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Performance</p>
                          <p className={`text-lg font-bold ${getPerformanceColor(person.performance)}`}>
                            {person.performance}/5
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Statut</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(person.status)}`}>
                            {person.status === 'active' ? 'Actif' : 
                             person.status === 'on-leave' ? 'En congé' : 'Inactif'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditTeacher(person)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleNewEvaluation()}
                          className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'contracts' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Gestion des contrats</h3>
                <button 
                  onClick={handleNewContract}
                  className="inline-flex items-center px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Nouveau contrat
                </button>
              </div>

              <div className="grid gap-4">
                {contracts.map((contract) => (
                  <div key={contract.id} className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-900/30 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{contract.employeeName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{contract.position} • {contract.id}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">
                            Du {contract.startDate} {contract.endDate ? `au ${contract.endDate}` : '(CDI)'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">{contract.workingHours}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-6 text-center">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getContractColor(contract.contractType)}`}>
                            {contract.contractType}
                          </span>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Salaire</p>
                          <p className="text-lg font-bold text-green-600 dark:text-green-400">€{contract.salary}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Statut</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                            {contract.status === 'active' ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {contract.renewalDate && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Renouvellement: {contract.renewalDate}
                          </p>
                        )}
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm hover:bg-green-200 dark:hover:bg-green-900/50">
                            Voir contrat
                          </button>
                          <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50">
                            Modifier
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'training' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Formation continue</h3>
                <button 
                  onClick={handleNewTraining}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800"
                >
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Nouvelle formation
                </button>
              </div>

              <div className="grid gap-4">
                {trainings.map((training) => (
                  <div key={training.id} className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-900/30 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                          <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{training.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{training.category} • {training.id}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">Formateur: {training.instructor}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">
                            Du {training.startDate} au {training.endDate} • {training.duration}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-6 text-center">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Participants</p>
                          <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{training.participants}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Coût</p>
                          <p className="text-lg font-bold text-green-600 dark:text-green-400">
                            {training.cost === 0 ? 'Gratuit' : `€${training.cost}`}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Statut</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(training.status)}`}>
                            {training.status === 'scheduled' ? 'Planifiée' : 
                             training.status === 'completed' ? 'Terminée' : 'Annulée'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50">
                          Détails
                        </button>
                        <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50">
                          Participants
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-900/30">
                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Plan de formation annuel</h4>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">€12,400</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Budget formation utilisé</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">45</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Heures de formation</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">89%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Taux de participation</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'evaluations' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Évaluations et développement</h3>
                <button 
                  onClick={handleNewEvaluation}
                  className="inline-flex items-center px-4 py-2 bg-orange-600 dark:bg-orange-700 text-white rounded-lg hover:bg-orange-700 dark:hover:bg-orange-800"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Nouvelle évaluation
                </button>
              </div>

              <div className="grid gap-4">
                {evaluations.map((evaluation) => (
                  <div key={evaluation.id} className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-900/30 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-full flex items-center justify-center">
                          <Star className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{evaluation.employeeName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{evaluation.position} • {evaluation.id}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">
                            Évalué le {evaluation.evaluationDate} par {evaluation.evaluator}
                          </p>
                          
                          <div className="mt-4 grid md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Critères d'évaluation:</h5>
                              <div className="space-y-2">
                                {Object.entries(evaluation.criteria).map(([criterion, score]) => (
                                  <div key={criterion} className="flex justify-between items-center">
                                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                                      {criterion === 'pedagogy' ? 'Pédagogie' :
                                       criterion === 'communication' ? 'Communication' :
                                       criterion === 'teamwork' ? 'Travail d\'équipe' : 'Innovation'}
                                    </span>
                                    <span className={`text-sm font-bold ${getPerformanceColor(score as number)}`}>
                                      {score}/5
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Objectifs:</h5>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                                {evaluation.objectives.map((objective, index) => (
                                  <li key={index}>{objective}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-center mb-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Note globale</p>
                          <p className={`text-3xl font-bold ${getPerformanceColor(evaluation.overallScore)}`}>
                            {evaluation.overallScore}/5
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Prochaine évaluation: {evaluation.nextEvaluation}
                        </p>
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg text-sm hover:bg-orange-200 dark:hover:bg-orange-900/50">
                            Voir détails
                          </button>
                          <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50">
                            Plan développement
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payroll' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Personnel & RH - Gestion de la paie</h3>
                <button className="inline-flex items-center px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-800">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Calculer paie
                </button>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-900/30">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Masse salariale</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Salaires bruts</span>
                      <span className="font-bold">€45,230</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Charges sociales</span>
                      <span className="font-bold text-red-600 dark:text-red-400">€13,569</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Primes</span>
                      <span className="font-bold text-green-600 dark:text-green-400">€2,340</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="text-xl font-bold">€61,139</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-900/30">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Impôts et taxes</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">TVA à payer</span>
                      <span className="font-bold">€8,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Impôt sur sociétés</span>
                      <span className="font-bold">€3,200</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Taxe professionnelle</span>
                      <span className="font-bold">€1,890</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="text-xl font-bold text-red-600 dark:text-red-400">€13,540</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-900/30">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Personnel actif</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Enseignants</span>
                      <span className="font-bold">45</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Administration</span>
                      <span className="font-bold">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Personnel technique</span>
                      <span className="font-bold">8</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="text-xl font-bold">65</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Analytics RH</h3>
              
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Effectifs</h4>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">65</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Personnel total</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Enseignants</span>
                        <span className="font-medium">45 (69%)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Administration</span>
                        <span className="font-medium">12 (18%)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Technique</span>
                        <span className="font-medium">8 (13%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Performance</h4>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">4.3/5</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Satisfaction moyenne</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Excellent (4.5-5)</span>
                        <span className="font-medium">35%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Bon (4-4.5)</span>
                        <span className="font-medium">45%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Satisfaisant (3.5-4)</span>
                        <span className="font-medium">20%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Turnover</h4>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">5.2%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Taux de rotation annuel</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Départs</span>
                        <span className="font-medium">3 cette année</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Arrivées</span>
                        <span className="font-medium">5 cette année</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Ancienneté moyenne</span>
                        <span className="font-medium">6.2 ans</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Évolution des coûts</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">Masse salariale</span>
                      <span className="font-bold text-green-600 dark:text-green-400">+2.1%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">Charges sociales</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">+1.8%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">Formation</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">+15.3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">Recrutement</span>
                      <span className="font-bold text-orange-600 dark:text-orange-400">+8.7%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Indicateurs clés</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">Absentéisme</span>
                      <span className="font-bold text-yellow-600 dark:text-yellow-400">2.1%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">Heures supplémentaires</span>
                      <span className="font-bold text-red-600 dark:text-red-400">156h/mois</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">Formations suivies</span>
                      <span className="font-bold text-green-600 dark:text-green-400">89%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">Évaluations à jour</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">95%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <TeacherModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        onSave={handleSaveTeacher}
        teacherData={selectedItem}
        isEdit={isEditMode}
      />

      <EvaluationModal
        isOpen={isEvaluationModalOpen}
        onClose={() => setIsEvaluationModalOpen(false)}
        onSave={handleSaveEvaluation}
        evaluationData={selectedItem}
        isEdit={isEditMode}
        employees={personnel.map(p => ({ id: p.id, name: `${p.firstName} ${p.lastName}`, position: p.position }))}
      />

      <TrainingModal
        isOpen={isTrainingModalOpen}
        onClose={() => setIsTrainingModalOpen(false)}
        onSave={handleSaveTraining}
        trainingData={selectedItem}
        isEdit={isEditMode}
        employees={personnel.map(p => ({ id: p.id, name: `${p.firstName} ${p.lastName}`, position: p.position }))}
      />

      <ContractModal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
        onSave={handleSaveContract}
        contractData={selectedItem}
        isEdit={isEditMode}
        employees={personnel.map(p => ({ id: p.id, name: `${p.firstName} ${p.lastName}`, position: p.position }))}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.`}
        type="danger"
      />

      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        title={alertMessage.title}
        message={alertMessage.message}
        type={alertMessage.type}
      />
    </div>
  );
};

export default HR;