import React, { useState } from 'react';
// Import shared dashboard styles
import '../../styles/dashboardStyles.css';
import { 
  Building, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Users,
  MapPin,
  Clock,
  Settings,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  User,
  Monitor,
  Wrench,
  BarChart3
} from 'lucide-react';
import { 
  ClassModal, 
  RoomReservationModal, 
  TeacherAssignmentModal, 
  ScheduleEntryModal, 
  TeacherAvailabilityModal, 
  WorkHoursModal,
  ConfirmModal,
  AlertModal,
  RoomManagementModal,
  RoomMaintenanceModal,
  ResourcePlanningModal,
  ClassStudentAssignmentModal
} from '../modals';

const Planning: React.FC = () => {
  const [activeTab, setActiveTab] = useState('classes');
  
  // Modals state
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isRoomReservationModalOpen, setIsRoomReservationModalOpen] = useState(false);
  const [isTeacherAssignmentModalOpen, setIsTeacherAssignmentModalOpen] = useState(false);
  const [isScheduleEntryModalOpen, setIsScheduleEntryModalOpen] = useState(false);
  const [isTeacherAvailabilityModalOpen, setIsTeacherAvailabilityModalOpen] = useState(false);
  const [isWorkHoursModalOpen, setIsWorkHoursModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isRoomManagementModalOpen, setIsRoomManagementModalOpen] = useState(false);
  const [isRoomMaintenanceModalOpen, setIsRoomMaintenanceModalOpen] = useState(false);
  const [isResourcePlanningModalOpen, setIsResourcePlanningModalOpen] = useState(false);
  const [isClassStudentAssignmentModalOpen, setIsClassStudentAssignmentModalOpen] = useState(false);
  
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedResourceForPlanning, setSelectedResourceForPlanning] = useState<any>(null);
  const [selectedClassForAssignment, setSelectedClassForAssignment] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ title: '', message: '', type: 'success' as 'success' | 'error' | 'info' | 'warning' });

  // Données factices pour les élèves
  const studentsData = [
    { id: 'STD001', firstName: 'Jean', lastName: 'Dupont', classId: 'CLS001', status: 'active' },
    { id: 'STD002', firstName: 'Marie', lastName: 'Martin', classId: 'CLS001', status: 'active' },
    { id: 'STD003', firstName: 'Lucas', lastName: 'Bernard', classId: 'CLS002', status: 'active' },
    { id: 'STD004', firstName: 'Emma', lastName: 'Petit', classId: 'CLS002', status: 'active' },
    { id: 'STD005', firstName: 'Thomas', lastName: 'Robert', classId: 'CLS003', status: 'active' },
    { id: 'STD006', firstName: 'Léa', lastName: 'Richard', classId: null, status: 'active' },
    { id: 'STD007', firstName: 'Hugo', lastName: 'Moreau', classId: null, status: 'active' },
    { id: 'STD008', firstName: 'Chloé', lastName: 'Simon', classId: null, status: 'active' },
    { id: 'STD009', firstName: 'Nathan', lastName: 'Laurent', classId: null, status: 'active' },
    { id: 'STD010', firstName: 'Camille', lastName: 'Michel', classId: null, status: 'active' },
  ];

  const classesData = [
    {
      id: 'CLS-2024-001',
      name: '6ème A',
      level: '6ème',
      capacity: 30,
      enrolled: 28,
      mainTeacher: 'Mme Dubois',
      classroom: 'Salle 101',
      subjects: ['Français', 'Mathématiques', 'Histoire-Géo', 'Anglais']
    },
    {
      id: 'CLS-2024-002',
      name: '5ème B',
      level: '5ème',
      capacity: 32,
      enrolled: 30,
      mainTeacher: 'M. Martin',
      classroom: 'Salle 205',
      subjects: ['Français', 'Mathématiques', 'SVT', 'Espagnol']
    },
    {
      id: 'CLS-2024-003',
      name: 'Terminale S',
      level: 'Terminale',
      capacity: 35,
      enrolled: 33,
      mainTeacher: 'M. Laurent',
      classroom: 'Salle 301',
      subjects: ['Mathématiques', 'Physique-Chimie', 'SVT', 'Philosophie']
    }
  ];

  const resourcesData = [
    {
      id: 'ROOM-001',
      name: 'Salle 101',
      type: 'Salle de classe',
      capacity: 30,
      equipment: ['Tableau interactif', 'Projecteur', 'Ordinateur'],
      status: 'available',
      nextReservation: '14:00 - Mathématiques'
    },
    {
      id: 'LAB-001',
      name: 'Laboratoire SVT',
      type: 'Laboratoire',
      capacity: 24,
      equipment: ['Microscopes', 'Paillasses', 'Hotte aspirante'],
      status: 'occupied',
      nextReservation: 'Libre à 16:00'
    },
    {
      id: 'ROOM-205',
      name: 'Salle informatique',
      type: 'Salle spécialisée',
      capacity: 20,
      equipment: ['20 ordinateurs', 'Serveur', 'Tableau numérique'],
      status: 'maintenance',
      nextReservation: 'Maintenance jusqu\'à 15:00'
    }
  ];

  const teachersData = [
    {
      id: 'PER-2024-001',
      name: 'Marie Dubois',
      subject: 'Français',
      classes: ['6ème A', '5ème B', '4ème C'],
      weeklyHours: 18,
      maxHours: 20,
      availability: 'Disponible',
      mainClass: '6ème A'
    },
    {
      id: 'PER-2024-002',
      name: 'Pierre Martin',
      subject: 'Mathématiques',
      classes: ['5ème B', '4ème A', 'Terminale S'],
      weeklyHours: 20,
      maxHours: 20,
      availability: 'Complet',
      mainClass: '5ème B'
    },
    {
      id: 'PER-2024-003',
      name: 'Sophie Laurent',
      subject: 'Anglais',
      classes: ['6ème A', '3ème B', '2nde A'],
      weeklyHours: 16,
      maxHours: 18,
      availability: 'Disponible',
      mainClass: null
    }
  ];

  const scheduleData = [
    {
      time: '08:00-09:00',
      monday: { subject: 'Français', teacher: 'Mme Dubois', room: 'Salle 101' },
      tuesday: { subject: 'Mathématiques', teacher: 'M. Martin', room: 'Salle 102' },
      wednesday: { subject: 'Histoire', teacher: 'M. Durand', room: 'Salle 103' },
      thursday: { subject: 'Anglais', teacher: 'Mme Laurent', room: 'Salle 104' },
      friday: { subject: 'SVT', teacher: 'M. Bernard', room: 'Lab SVT' }
    },
    {
      time: '09:00-10:00',
      monday: { subject: 'Mathématiques', teacher: 'M. Martin', room: 'Salle 102' },
      tuesday: { subject: 'Français', teacher: 'Mme Dubois', room: 'Salle 101' },
      wednesday: { subject: 'Sport', teacher: 'M. Petit', room: 'Gymnase' },
      thursday: { subject: 'Physique', teacher: 'M. Moreau', room: 'Lab Physique' },
      friday: { subject: 'Anglais', teacher: 'Mme Laurent', room: 'Salle 104' }
    }
  ];

  const planningStats = [
    {
      title: 'Classes actives',
      value: '24',
      change: '+2',
      icon: Building,
      color: 'from-blue-600 to-blue-700'
    },
    {
      title: 'Salles disponibles',
      value: '18/25',
      change: '72%',
      icon: MapPin,
      color: 'from-green-600 to-green-700'
    },
    {
      title: 'Enseignants affectés',
      value: '45',
      change: '+3',
      icon: Users,
      color: 'from-purple-600 to-purple-700'
    },
    {
      title: 'Heures planifiées',
      value: '890h',
      change: '+45h',
      icon: Clock,
      color: 'from-orange-600 to-orange-700'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'occupied': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Disponible': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Complet': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'Partiel': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Handlers pour les modals
  const handleNewClass = () => {
    setIsEditMode(false);
    setSelectedItem(null);
    setIsClassModalOpen(true);
  };

  const handleEditClass = (classItem: any) => {
    setIsEditMode(true);
    setSelectedItem(classItem);
    setIsClassModalOpen(true);
  };

  const handleNewReservation = () => {
    setIsEditMode(false);
    setSelectedItem(null);
    setIsRoomReservationModalOpen(true);
  };

  const handleNewTeacherAssignment = () => {
    setIsEditMode(false);
    setSelectedItem(null);
    setIsTeacherAssignmentModalOpen(true);
  };

  const handleTeacherAvailability = (teacher: any) => {
    setSelectedItem(teacher);
    setIsTeacherAvailabilityModalOpen(true);
  };

  const handleNewScheduleEntry = () => {
    setIsEditMode(false);
    setSelectedItem(null);
    setIsScheduleEntryModalOpen(true);
  };

  const handleWorkHours = () => {
    setIsEditMode(false);
    setSelectedItem(null);
    setIsWorkHoursModalOpen(true);
  };

  const handleManageRooms = () => {
    setIsRoomManagementModalOpen(true);
  };

  const handleMaintenanceClick = () => {
    if (resourcesData.length === 0) {
      setAlertMessage({
        title: 'Aucune salle disponible',
        message: 'Veuillez d\'abord ajouter des salles avant de planifier une maintenance.',
        type: 'warning'
      });
      setIsAlertModalOpen(true);
      return;
    }
    setIsRoomMaintenanceModalOpen(true);
  };

  const handleOpenResourcePlanning = (resource: any = null) => {
    setSelectedResourceForPlanning(resource);
    setIsResourcePlanningModalOpen(true);
  };

  const handleAssignStudents = (classItem: any) => {
    console.log('1. handleAssignStudents appelé avec:', classItem);
    
    // Vérifier que studentsData est défini
    console.log('2. studentsData:', studentsData);
    
    // Filtrer les élèves actuels
    const currentStudents = studentsData.filter(student => student.classId === classItem.id);
    console.log('3. Élèves actuels de la classe:', currentStudents);
    
    // Mettre à jour l'état avec les informations de la classe
    setSelectedClassForAssignment({
      id: classItem.id,
      name: classItem.name,
      level: classItem.level,
      currentStudents: currentStudents
    });
    
    console.log('4. selectedClassForAssignment mis à jour');
    
    // Ouvrir le modal
    console.log('5. Ouverture du modal...');
    setIsClassStudentAssignmentModalOpen(true);
    console.log('6. isClassStudentAssignmentModalOpen:', true);
  };

  const handleSaveClass = (classData: any) => {
    console.log('Saving class:', classData);
    setAlertMessage({
      title: isEditMode ? 'Classe mise à jour' : 'Classe créée',
      message: isEditMode 
        ? `La classe "${classData.name}" a été mise à jour avec succès.`
        : `La classe "${classData.name}" a été créée avec succès.`,
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  const handleSaveReservation = (reservationData: any) => {
    console.log('Saving reservation:', reservationData);
    setAlertMessage({
      title: 'Réservation enregistrée',
      message: 'La réservation a été enregistrée avec succès.',
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  const handleSaveTeacherAssignment = (assignmentData: any) => {
    console.log('Saving teacher assignment:', assignmentData);
    setAlertMessage({
      title: 'Affectation enregistrée',
      message: 'L\'affectation de l\'enseignant a été enregistrée avec succès.',
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  const handleSaveTeacherAvailability = (availabilityData: any) => {
    console.log('Saving teacher availability:', availabilityData);
    setAlertMessage({
      title: 'Disponibilités enregistrées',
      message: 'Les disponibilités de l\'enseignant ont été enregistrées avec succès.',
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  const handleSaveScheduleEntry = (scheduleData: any) => {
    console.log('Saving schedule entry:', scheduleData);
    setAlertMessage({
      title: 'Cours ajouté',
      message: 'Le cours a été ajouté à l\'emploi du temps avec succès.',
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  const handleSaveWorkHours = (workHoursData: any) => {
    console.log('Saving work hours:', workHoursData);
    setAlertMessage({
      title: 'Heures enregistrées',
      message: 'Les heures de travail ont été enregistrées avec succès.',
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  const handleSaveRoom = (roomData: any) => {
    console.log('Saving room:', roomData);
    setAlertMessage({
      title: 'Salle enregistrée',
      message: `La salle "${roomData.name}" a été enregistrée avec succès.`,
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  const handleSaveMaintenance = (maintenanceData: any) => {
    console.log('Saving maintenance:', maintenanceData);
    setAlertMessage({
      title: 'Maintenance planifiée',
      message: `La maintenance pour la salle a été enregistrée avec succès.`,
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  const handleSaveResourcePlanning = (planningData: any) => {
    console.log('Saving resource planning:', planningData);
    setAlertMessage({
      title: 'Planning enregistré',
      message: 'Le planning a été mis à jour avec succès.',
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  const handleSaveStudentAssignments = (selectedStudentIds: string[]) => {
    // Mettre à jour les données des élèves avec leur nouvelle classe
    const updatedStudents = studentsData.map(student => ({
      ...student,
      classId: selectedStudentIds.includes(student.id) ? selectedClassForAssignment.id : student.classId
    }));
    
    // Ici, vous devriez mettre à jour votre état ou votre base de données avec les nouvelles affectations
    console.log('Mise à jour des affectations des élèves :', updatedStudents);
    
    // Afficher un message de confirmation
    setAlertMessage({
      title: 'Affectations enregistrées',
      message: `Les affectations des élèves pour la classe ${selectedClassForAssignment.name} ont été mises à jour.`,
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Études & Planification</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestion des classes, ressources et emplois du temps</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button 
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() => setIsScheduleEntryModalOpen(true)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Optimiser
          </button>
          <button 
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
            onClick={handleNewClass}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle classe
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {planningStats.map((stat, index) => {
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
              { id: 'classes', label: 'Classes & Séries', icon: Building },
              { id: 'resources', label: 'Ressources', icon: MapPin },
              { id: 'teachers', label: 'Enseignants', icon: Users },
              { id: 'schedule', label: 'Emploi du temps', icon: Calendar },
              { id: 'availability', label: 'Disponibilités', icon: Clock },
              { id: 'hours', label: 'Heures de cours', icon: BarChart3 }
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
          {activeTab === 'classes' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Gestion des classes et séries</h3>
                <div className="flex space-x-2">
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtres
                  </button>
                  <button 
                    className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
                    onClick={handleNewClass}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle classe
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                {classesData.map((classItem) => (
                  <div key={classItem.id} className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-900/30 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <Building className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{classItem.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Niveau: {classItem.level} • Prof principal: {classItem.mainTeacher}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">Salle: {classItem.classroom}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Effectif</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{classItem.enrolled}/{classItem.capacity}</p>
                            <div className="w-16 progress-bar-container mt-1">
                                <div 
                                className={`progress-bar-fill progress-bar-fill-blue w-${Math.round((classItem.enrolled / classItem.capacity) * 100 / 10) * 10}`}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Matières</p>
                            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{classItem.subjects.length}</p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 mt-4">
                          <button 
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50"
                            onClick={() => handleEditClass(classItem)}
                          >
                            Modifier
                          </button>
                          <button 
                            className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm hover:bg-green-200 dark:hover:bg-green-900/50"
                            onClick={() => handleAssignStudents(classItem)}
                          >
                            Affecter élèves
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Gestion des ressources</h3>
                <div className="flex space-x-2">
                  <button 
                    className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={handleManageRooms}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Gérer les salles
                  </button>
                  <button 
                    className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={handleMaintenanceClick}
                  >
                    <Wrench className="w-4 h-4 mr-2" />
                    Maintenance
                  </button>
                  <button 
                    className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => handleOpenResourcePlanning()}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Planning
                  </button>
                  <button 
                    className="inline-flex items-center px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800"
                    onClick={handleNewReservation}
                    disabled={resourcesData.length === 0}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Réserver une salle
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                {resourcesData.map((resource) => (
                  <div key={resource.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                          {resource.type === 'Laboratoire' ? (
                            <Monitor className="w-6 h-6 text-white" />
                          ) : (
                            <MapPin className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{resource.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{resource.type} • Capacité: {resource.capacity} places</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">Équipements: {resource.equipment.join(', ')}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(resource.status)}`}>
                          {resource.status === 'available' ? 'Disponible' : 
                           resource.status === 'occupied' ? 'Occupé' : 'Maintenance'}
                        </span>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{resource.nextReservation}</p>
                        <div className="flex space-x-2 mt-2">
                          <button 
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-800"
                            onClick={() => handleNewReservation(resource)}
                          >
                            Réserver
                          </button>
                          <button 
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
                            onClick={() => handleOpenResourcePlanning(resource)}
                          >
                            Planning
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'teachers' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Programmation des cours</h3>
                <button 
                  className="inline-flex items-center px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800"
                  onClick={handleNewTeacherAssignment}
                >
                  <User className="w-4 h-4 mr-2" />
                  Affecter enseignant
                </button>
              </div>

              <div className="grid gap-4">
                {teachersData.map((teacher) => (
                  <div key={teacher.id} className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-900/30 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{teacher.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{teacher.subject} • Classes: {teacher.classes.join(', ')}</p>
                          {teacher.mainClass && (
                            <p className="text-sm text-gray-500 dark:text-gray-500">Professeur principal: {teacher.mainClass}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Charge horaire</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{teacher.weeklyHours}h/{teacher.maxHours}h</p>
                            <div className="w-16 progress-bar-container mt-1">
                                <div 
                                className={`progress-bar-fill progress-bar-fill-purple w-${Math.round((teacher.weeklyHours / teacher.maxHours) * 100 / 10) * 10}`}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAvailabilityColor(teacher.availability)}`}>
                              {teacher.availability}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 mt-4">
                          <button className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50">
                            Planning
                          </button>
                          <button 
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50"
                            onClick={() => handleTeacherAvailability(teacher)}
                          >
                            Disponibilités
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Emploi du temps - 6ème A</h3>
                <div className="flex space-x-2">
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Settings className="w-4 h-4 mr-2" />
                    Générer auto
                  </button>
                  <button 
                    className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
                    onClick={handleNewScheduleEntry}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Ajouter un cours
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Horaires
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Lundi
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Mardi
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Mercredi
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Jeudi
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Vendredi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {scheduleData.map((slot, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                            {slot.time}
                          </td>
                          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day) => {
                            const course = slot[day as keyof typeof slot] as any;
                            return (
                              <td key={day} className="px-4 py-4 whitespace-nowrap">
                                {course && (
                                  <div 
                                    className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-2 border-l-4 border-blue-500 dark:border-blue-400 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/50"
                                    onClick={handleNewScheduleEntry}
                                  >
                                    <p className="text-sm font-medium text-blue-900 dark:text-blue-300">{course.subject}</p>
                                    <p className="text-xs text-blue-700 dark:text-blue-400">{course.teacher}</p>
                                    <p className="text-xs text-blue-600 dark:text-blue-500">{course.room}</p>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'availability' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Gestion des disponibilités</h3>
                <button 
                  className="inline-flex items-center px-4 py-2 bg-orange-600 dark:bg-orange-700 text-white rounded-lg hover:bg-orange-700 dark:hover:bg-orange-800"
                  onClick={() => setIsTeacherAvailabilityModalOpen(true)}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Détecter conflits
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-900/30">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Disponibilités enseignants</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">Mme Dubois</span>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs">
                        Disponible
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">M. Martin</span>
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-xs">
                        Conflit 14h-15h
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">Mme Laurent</span>
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-xs">
                        Partiel
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-900/30">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Conflits détectés</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Salle 101 - Double réservation</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Mardi 14h: Français et Mathématiques</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-500 dark:text-yellow-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">M. Martin - Surcharge</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">22h/semaine (max: 20h)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hours' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Gestion des heures de cours</h3>
                <button 
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-800"
                  onClick={handleWorkHours}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Saisir des heures
                </button>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-900/30">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Heures effectuées</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Cette semaine</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">890h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Ce mois</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">3,560h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Année scolaire</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">28,450h</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-900/30">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Heures complémentaires</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Heures sup.</span>
                      <span className="font-bold text-green-600 dark:text-green-400">+45h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Remplacements</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">+12h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Soutien</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">+8h</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-900/30">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Impact budgétaire</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Coût heures normales</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">€45,230</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Coût heures sup.</span>
                      <span className="font-bold text-orange-600 dark:text-orange-400">€2,340</span>
                    </div>
                    <div className="border-t pt-2 border-yellow-200 dark:border-yellow-900/50 flex justify-between">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Total</span>
                      <span className="font-bold text-lg text-gray-900 dark:text-gray-100">€47,570</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ClassModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        onSave={handleSaveClass}
        classData={selectedItem}
        isEdit={isEditMode}
      />

      <RoomReservationModal
        isOpen={isRoomReservationModalOpen}
        onClose={() => setIsRoomReservationModalOpen(false)}
        onSave={handleSaveReservation}
      />

      <TeacherAssignmentModal
        isOpen={isTeacherAssignmentModalOpen}
        onClose={() => setIsTeacherAssignmentModalOpen(false)}
        onSave={handleSaveTeacherAssignment}
      />

      <ScheduleEntryModal
        isOpen={isScheduleEntryModalOpen}
        onClose={() => setIsScheduleEntryModalOpen(false)}
        onSave={handleSaveScheduleEntry}
      />

      <TeacherAvailabilityModal
        isOpen={isTeacherAvailabilityModalOpen}
        onClose={() => setIsTeacherAvailabilityModalOpen(false)}
        onSave={handleSaveTeacherAvailability}
        teacherId={selectedItem?.id}
        teacherName={selectedItem?.name}
      />

      <WorkHoursModal
        isOpen={isWorkHoursModalOpen}
        onClose={() => setIsWorkHoursModalOpen(false)}
        onSave={handleSaveWorkHours}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => setIsConfirmModalOpen(false)}
        title="Confirmer l'action"
        message="Êtes-vous sûr de vouloir effectuer cette action ?"
        type="warning"
      />

      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        title={alertMessage.title}
        message={alertMessage.message}
        type={alertMessage.type}
      />

      <RoomManagementModal
        isOpen={isRoomManagementModalOpen}
        onClose={() => setIsRoomManagementModalOpen(false)}
        onSave={handleSaveRoom}
        rooms={resourcesData}
      />

      <RoomMaintenanceModal
        isOpen={isRoomMaintenanceModalOpen}
        onClose={() => setIsRoomMaintenanceModalOpen(false)}
        onSave={handleSaveMaintenance}
        rooms={resourcesData}
      />

      <ResourcePlanningModal
        isOpen={isResourcePlanningModalOpen}
        onClose={() => {
          setIsResourcePlanningModalOpen(false);
          setSelectedResourceForPlanning(null);
        }}
        onSave={handleSaveResourcePlanning}
        resource={selectedResourceForPlanning}
      />

      {selectedClassForAssignment && (
        <>
          {console.log('7. Rendu du modal avec selectedClassForAssignment:', selectedClassForAssignment)}
          <ClassStudentAssignmentModal
            isOpen={isClassStudentAssignmentModalOpen}
            onClose={() => {
              console.log('8. Fermeture du modal');
              setIsClassStudentAssignmentModalOpen(false);
            }}
            onSave={(selectedStudents) => {
              console.log('9. Élèves sélectionnés:', selectedStudents);
              handleSaveStudentAssignments(selectedStudents);
            }}
            classInfo={{
              id: selectedClassForAssignment.id,
              name: selectedClassForAssignment.name,
              level: selectedClassForAssignment.level,
              currentStudents: selectedClassForAssignment.currentStudents || []
            }}
            allStudents={studentsData}
          />
        </>
      )}
    </div>
  );
};

export default Planning;