import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  MoreHorizontal,
  Users,
  GraduationCap,
  Calendar,
  Phone,
  Mail,
  FileText,
  Camera,
  UserX,
  AlertTriangle,
  CheckCircle,
  Award,
  BookOpen,
  Shield
} from 'lucide-react';
import { 
  StudentModal, 
  AbsenceModal, 
  DisciplineModal, 
  ClassTransferModal, 
  DocumentGenerationModal,
  ConfirmModal,
  AlertModal
} from '../modals';

const Students: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [activeTab, setActiveTab] = useState('list');
  
  // Modals state
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isAbsenceModalOpen, setIsAbsenceModalOpen] = useState(false);
  const [isDisciplineModalOpen, setIsDisciplineModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  
  interface Student {
    id: string;
    firstName: string;
    lastName: string;
    class: string;
    age: number;
    phone: string;
    email: string;
    parentName: string;
    parentPhone: string;
    status: string;
    fees: string;
    photo: string | null;
    enrollmentDate: string;
    medicalInfo: string;
  }

  interface AlertMessage {
    title: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [alertMessage, setAlertMessage] = useState<AlertMessage>({ title: '', message: '', type: 'success' });

  // Mock data
  const students: Student[] = [
    {
      id: 'MAT-2024-00001',
      firstName: 'Marie',
      lastName: 'Dubois',
      class: '3ème A',
      age: 14,
      phone: '06 12 34 56 78',
      email: 'marie.dubois@email.com',
      parentName: 'Jean Dubois',
      parentPhone: '06 98 76 54 32',
      status: 'active',
      fees: 'paid',
      photo: null,
      enrollmentDate: '2023-09-01',
      medicalInfo: 'Aucune allergie connue'
    },
    {
      id: 'MAT-2024-00002',
      firstName: 'Pierre',
      lastName: 'Martin',
      class: '2nde B',
      age: 15,
      phone: '06 11 22 33 44',
      email: 'pierre.martin@email.com',
      parentName: 'Sophie Martin',
      parentPhone: '06 55 66 77 88',
      status: 'active',
      fees: 'pending',
      photo: null,
      enrollmentDate: '2023-09-01',
      medicalInfo: 'Asthme léger'
    },
    {
      id: 'MAT-2024-00003',
      firstName: 'Sophie',
      lastName: 'Lambert',
      class: '1ère C',
      age: 16,
      phone: '06 33 44 55 66',
      email: 'sophie.lambert@email.com',
      parentName: 'Michel Lambert',
      parentPhone: '06 77 88 99 00',
      status: 'absent',
      fees: 'paid',
      photo: null,
      enrollmentDate: '2023-09-01',
      medicalInfo: 'Allergie aux arachides'
    }
  ];

  const absences = [
    {
      studentId: 'MAT-2024-00003',
      studentName: 'Sophie Lambert',
      class: '1ère C',
      date: '2024-01-10',
      period: 'Matin',
      reason: 'Maladie',
      justified: false,
      parentNotified: true
    },
    {
      studentId: 'MAT-2024-00001',
      studentName: 'Marie Dubois',
      class: '3ème A',
      date: '2024-01-09',
      period: 'Après-midi',
      reason: 'Rendez-vous médical',
      justified: true,
      parentNotified: true
    }
  ];

  const disciplinaryIncidents = [
    {
      id: 'DISC-2024-001',
      studentId: 'MAT-2024-00002',
      studentName: 'Pierre Martin',
      class: '2nde B',
      date: '2024-01-08',
      incident: 'Perturbation en cours',
      severity: 'minor',
      action: 'Avertissement',
      teacher: 'M. Dubois'
    }
  ];

  const enrollmentStats = [
    {
      title: 'Total Élèves',
      value: '1,247',
      change: '+12',
      icon: Users,
      color: 'from-blue-600 to-blue-700'
    },
    {
      title: 'Présents aujourd\'hui',
      value: '1,189',
      change: '95.3%',
      icon: CheckCircle,
      color: 'from-green-600 to-green-700'
    },
    {
      title: 'Absents',
      value: '58',
      change: '4.7%',
      icon: UserX,
      color: 'from-red-600 to-red-700'
    },
    {
      title: 'Nouveaux cette semaine',
      value: '12',
      change: '+5',
      icon: GraduationCap,
      color: 'from-purple-600 to-purple-700'
    }
  ];

  const classes = ['all', '6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale'];

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = selectedClass === 'all' || student.class.includes(selectedClass);
    
    return matchesSearch && matchesClass;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFeesColor = (fees: string) => {
    switch (fees) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor': return 'bg-yellow-100 text-yellow-800';
      case 'major': return 'bg-red-100 text-red-800';
      case 'severe': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handlers pour les modals
  const handleNewStudent = () => {
    setIsEditMode(false);
    setSelectedStudent(null);
    setIsStudentModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setIsEditMode(true);
    setSelectedStudent(student);
    setIsStudentModalOpen(true);
  };

  const handleDeleteStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsConfirmModalOpen(true);
  };

  const handleNewAbsence = () => {
    setIsEditMode(false);
    setSelectedStudent(null);
    setIsAbsenceModalOpen(true);
  };

  const handleNewDiscipline = () => {
    setIsEditMode(false);
    setSelectedStudent(null);
    setIsDisciplineModalOpen(true);
  };

  const handleNewTransfer = () => {
    setIsEditMode(false);
    setSelectedStudent(null);
    setIsTransferModalOpen(true);
  };

  const handleGenerateDocument = () => {
    setIsDocumentModalOpen(true);
  };


  const handleSaveStudent = (studentData: Omit<Student, 'id' | 'enrollmentDate'> & { id?: string }) => {
    console.log('Saving student:', studentData);
    setAlertMessage({
      title: isEditMode ? 'Élève mis à jour' : 'Élève ajouté',
      message: isEditMode 
        ? `Les informations de ${studentData.firstName} ${studentData.lastName} ont été mises à jour avec succès.`
        : `L'élève ${studentData.firstName} ${studentData.lastName} a été ajouté avec succès.`,
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  interface AbsenceData {
    studentName: string;
    date: string;
    reason: string;
  }

  const handleSaveAbsence = (absenceData: AbsenceData) => {
    console.log('Saving absence:', absenceData);
    setAlertMessage({
      title: 'Absence enregistrée',
      message: `L'absence de ${absenceData.studentName} a été enregistrée avec succès.`,
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  interface IncidentData {
    studentName: string;
    date: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }

  const handleSaveDiscipline = (incidentData: IncidentData) => {
    console.log('Saving discipline incident:', incidentData);
    setAlertMessage({
      title: 'Incident enregistré',
      message: `L'incident disciplinaire concernant ${incidentData.studentName} a été enregistré avec succès.`,
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  interface TransferData {
    studentName: string;
    fromClass: string;
    toClass: string;
    date: string;
    reason: string;
  }

  const handleSaveTransfer = (transferData: TransferData) => {
    console.log('Saving transfer:', transferData);
    setAlertMessage({
      title: 'Transfert effectué',
      message: `Le transfert de ${transferData.studentName} a été effectué avec succès.`,
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  interface DocumentData {
    documentType: string;
    studentName: string;
    date: string;
    additionalNotes?: string;
  }

  const handleGenerateDocumentSubmit = (documentData: DocumentData) => {
    console.log('Generating document:', documentData);
    setAlertMessage({
      title: 'Document généré',
      message: `Le document a été généré avec succès.`,
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  const confirmDeleteStudent = () => {
    console.log('Deleting student:', selectedStudent);
    setIsConfirmModalOpen(false);
    setAlertMessage({
      title: 'Élève supprimé',
      message: `L'élève ${selectedStudent?.firstName} ${selectedStudent?.lastName} a été supprimé avec succès.`,
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Scolarité & Gestion des élèves</h1>
          <p className="text-gray-600 dark:text-gray-400">Dossiers complets et gestion administrative</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button 
            onClick={() => setIsDocumentModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Camera className="w-4 h-4 mr-2" />
            Trombinoscope
          </button>
          <button 
            onClick={handleNewStudent}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvel élève
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {enrollmentStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
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
              { id: 'list', label: 'Liste des élèves', icon: Users },
              { id: 'enrollment', label: 'Inscriptions', icon: FileText },
              { id: 'movements', label: 'Mouvements', icon: Calendar },
              { id: 'absences', label: 'Absences', icon: UserX },
              { id: 'discipline', label: 'Discipline', icon: Shield },
              { id: 'documents', label: 'Documents', icon: BookOpen }
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
          {activeTab === 'list' && (
            <div className="space-y-6">
              {/* Filters and Search */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      placeholder="Rechercher un élève..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    aria-label="Filtrer par classe"
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="all">Toutes les classes</option>
                    {classes.slice(1).map(className => (
                      <option key={className} value={className}>{className}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtres
                  </button>
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </button>
                </div>
              </div>

              {/* Students Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Élève
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Matricule
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Classe
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Parent/Tuteur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Frais
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {student.firstName[0]}{student.lastName[0]}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {student.firstName} {student.lastName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {student.age} ans
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {student.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                            {student.class}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <span>{student.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-400">{student.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          <div>{student.parentName}</div>
                          <div className="text-gray-600 dark:text-gray-400">{student.parentPhone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                            {student.status === 'active' ? 'Actif' : 
                             student.status === 'absent' ? 'Absent' : 'Autre'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFeesColor(student.fees)}`}>
                            {student.fees === 'paid' ? 'Payé' : 
                             student.fees === 'pending' ? 'En attente' : 'En retard'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button 
                              aria-label={`Voir les détails de ${student.firstName} ${student.lastName}`}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEditStudent(student)}
                              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                              aria-label={`Modifier ${student.firstName} ${student.lastName}`}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteStudent(student)}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                              aria-label={`Supprimer ${student.firstName} ${student.lastName}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button 
                              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                              aria-label="Plus d'options"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'enrollment' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Processus d'inscription</h3>
                <button 
                  onClick={handleNewStudent}
                  className="inline-flex items-center px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle inscription
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-900/30">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Inscriptions en cours</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Lucas Moreau</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">6ème A - Dossier incomplet</p>
                      </div>
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-xs">
                        En attente
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Emma Petit</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">5ème B - Validation finale</p>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs">
                        À valider
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-900/30">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Statistiques d'effectifs</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">6ème</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">156 élèves</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">5ème</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">142 élèves</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">4ème</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">138 élèves</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">3ème</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">134 élèves</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'movements' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Gestion des mouvements</h3>
                <button 
                  onClick={handleNewTransfer}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Nouveau transfert
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Changements de classe récents</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-600 dark:bg-blue-700 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Thomas Durand</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">3ème A → 3ème B</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">Motif: Changement d'option</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">15/01/2024</p>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs">
                        Validé
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'absences' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Gestion des absences</h3>
                <div className="flex space-x-2">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Download className="w-4 h-4 mr-2" />
                    Rapport d'assiduité
                  </button>
                  <button 
                    onClick={handleNewAbsence}
                    className="inline-flex items-center px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800"
                  >
                    <UserX className="w-4 h-4 mr-2" />
                    Saisir absence
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                {absences.map((absence, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                          <UserX className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{absence.studentName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{absence.class} • {absence.period}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">{absence.date} • {absence.reason}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            absence.justified ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                          }`}>
                            {absence.justified ? 'Justifiée' : 'Non justifiée'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            absence.parentNotified ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                          }`}>
                            {absence.parentNotified ? 'Parent informé' : 'À notifier'}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50">
                            Justifier
                          </button>
                          <button className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm hover:bg-green-200 dark:hover:bg-green-900/50">
                            Contacter
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'discipline' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Conseils de discipline</h3>
                <button 
                  onClick={handleNewDiscipline}
                  className="inline-flex items-center px-4 py-2 bg-orange-600 dark:bg-orange-700 text-white rounded-lg hover:bg-orange-700 dark:hover:bg-orange-800"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Signaler incident
                </button>
              </div>

              <div className="grid gap-4">
                {disciplinaryIncidents.map((incident) => (
                  <div key={incident.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                          <AlertTriangle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{incident.studentName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{incident.class} • {incident.incident}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">{incident.date} • Signalé par {incident.teacher}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                          {incident.severity === 'minor' ? 'Mineur' : 
                           incident.severity === 'major' ? 'Majeur' : 'Grave'}
                        </span>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Action: {incident.action}</p>
                        <div className="flex space-x-2 mt-2">
                          <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50">
                            PV
                          </button>
                          <button className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm hover:bg-green-200 dark:hover:bg-green-900/50">
                            Médiation
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Éditions et documents</h3>
                <button 
                  onClick={handleGenerateDocument}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Générer document
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">Certificats</h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Génération de certificats de scolarité</p>
                  <button 
                    onClick={handleGenerateDocument}
                    className="w-full px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50"
                  >
                    Générer
                  </button>
                </div>

                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <Award className="w-8 h-8 text-green-600 dark:text-green-400" />
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">Attestations</h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Attestations de réussite et diplômes</p>
                  <button 
                    onClick={handleGenerateDocument}
                    className="w-full px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50"
                  >
                    Générer
                  </button>
                </div>

                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">Listes</h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Listes d'élèves par classe ou niveau</p>
                  <button 
                    onClick={handleGenerateDocument}
                    className="w-full px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50"
                  >
                    Générer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSave={handleSaveStudent}
        studentData={selectedStudent}
        isEdit={isEditMode}
      />

      <AbsenceModal
        isOpen={isAbsenceModalOpen}
        onClose={() => setIsAbsenceModalOpen(false)}
        onSave={handleSaveAbsence}
        students={students.map(s => ({ id: s.id, name: `${s.firstName} ${s.lastName}`, class: s.class }))}
      />

      <DisciplineModal
        isOpen={isDisciplineModalOpen}
        onClose={() => setIsDisciplineModalOpen(false)}
        onSave={handleSaveDiscipline}
        students={students.map(s => ({ id: s.id, name: `${s.firstName} ${s.lastName}`, class: s.class }))}
      />

      <ClassTransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onSave={handleSaveTransfer}
        students={students.map(s => ({ id: s.id, name: `${s.firstName} ${s.lastName}`, class: s.class }))}
      />

      <DocumentGenerationModal
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        onGenerate={handleGenerateDocumentSubmit}
        students={students.map(s => ({ id: s.id, name: `${s.firstName} ${s.lastName}`, class: s.class }))}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDeleteStudent}
        title="Supprimer cet élève ?"
        message={`Êtes-vous sûr de vouloir supprimer l'élève ${selectedStudent?.firstName} ${selectedStudent?.lastName} ? Cette action est irréversible.`}
        type="danger"
        confirmText="Supprimer"
        cancelText="Annuler"
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

export default Students;