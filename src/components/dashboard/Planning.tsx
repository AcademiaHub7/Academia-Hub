import React, { useState, useEffect, useMemo } from 'react';
// Import shared dashboard styles
import '../../styles/dashboardStyles.css';
import '../../styles/fichesStyles.css';
import { 
  Building, 
  Plus, 
  Filter, 
  Calendar,
  Users,
  MapPin,
  Clock,
  Settings,
  AlertTriangle,
  Book,
  BookOpen,
  User,
  Monitor,
  Wrench,
  BarChart3,
  X,
  Search,
  Trash2,
  Edit,
  Check,
  FileText,
  Home,
  Map,
  Tool,
  Clipboard,
  Printer
 } from 'lucide-react';
import { FicheProvider } from './fiches_pedagogiques/context/FicheContext';
import { 
  AlertModal,
  ClassModal,
  ClassStudentAssignmentModal,
  ConfirmModal,
  RoomMaintenanceModal,
  RoomManagementModal,
  RoomReservationModal,
  ResourcePlanningModal,
  TeacherAssignmentModal,
  ScheduleEntryModal,
  TeacherAvailabilityModal,
  TeacherScheduleModal,
  WorkHoursModal,
  SubjectModal 
} from '../modals';
import FormModal from '../modals/FormModal';
import { Subject } from '../modals/SubjectModal';
import JournalTab from './JournalTab';
import CahierTexteBoard from './textes/CahierTexteBoard';


const Planning: React.FC = () => {
  const [activeTab, setActiveTab] = useState('classes');
  // Ajouter un état pour suivre si l'onglet fiches a été cliqué
  const [ficheTabClicked, setFicheTabClicked] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>('6ème A'); // Classe par défaut
  
  // État pour les heures de pause
  const [breakTimes, setBreakTimes] = useState({
    morning: { start: '10:00', end: '10:15', label: 'Récréation matin' },
    lunch: { start: '12:00', end: '13:30', label: 'Pause déjeuner' },
    afternoon: { start: '15:30', end: '15:45', label: 'Récréation après-midi' }
  });
  const [isBreakTimeModalOpen, setIsBreakTimeModalOpen] = useState(false);
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);
  const [isScheduleGenerationModalOpen, setIsScheduleGenerationModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isJournalEntryModalOpen, setIsJournalEntryModalOpen] = useState(false);
  const [selectedJournalEntry, setSelectedJournalEntry] = useState<any>(null);
  const [selectedTextbookEntry, setSelectedTextbookEntry] = useState<any>(null);
  const [journalFilter, setJournalFilter] = useState({
    class: '',
    subject: '',
    period: 'all' // 'all', 'today', 'week', 'month'
  });
  const [textbookFilter, setTextbookFilter] = useState({
    class: '',
    subject: '',
    period: 'all' // 'all', 'today', 'week', 'month'
  });
  const [isTextbookEntryModalOpen, setIsTextbookEntryModalOpen] = useState(false);
  
  // Modals state
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isRoomReservationModalOpen, setIsRoomReservationModalOpen] = useState(false);
  const [isTeacherAssignmentModalOpen, setIsTeacherAssignmentModalOpen] = useState(false);
  const [isScheduleEntryModalOpen, setIsScheduleEntryModalOpen] = useState(false);
  const [isTeacherAvailabilityModalOpen, setIsTeacherAvailabilityModalOpen] = useState(false);
  const [isWorkHoursModalOpen, setIsWorkHoursModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isRoomManagementModalOpen, setIsRoomManagementModalOpen] = useState(false);
  const [isRoomMaintenanceModalOpen, setIsRoomMaintenanceModalOpen] = useState(false);
  const [isResourcePlanningModalOpen, setIsResourcePlanningModalOpen] = useState(false);
  const [isClassStudentAssignmentModalOpen, setIsClassStudentAssignmentModalOpen] = useState(false);
  const [isTeacherScheduleModalOpen, setIsTeacherScheduleModalOpen] = useState(false);
  
  // État pour les notifications
  const [notifications, setNotifications] = useState<any[]>([]);
  
  // Contexte de sécurité
  const securityContext = {
    canEdit: true,
    canView: true,
    canDelete: true,
    userRole: 'teacher' // ou 'admin' selon le rôle de l'utilisateur
  };
  
  const [selectedItem, setSelectedItem] = useState<Subject | any>(null);
  const [selectedResourceForPlanning, setSelectedResourceForPlanning] = useState<any>(null);
  const [selectedClassForAssignment, setSelectedClassForAssignment] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEducationLevel, setSelectedEducationLevel] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState({ title: '', message: '', type: 'success' as 'success' | 'error' | 'info' | 'warning' });
  
  // États pour le filtrage des classes
  const [isClassFilterModalOpen, setIsClassFilterModalOpen] = useState(false);
  const [classFilters, setClassFilters] = useState({
    level: '',
    occupancyRate: 'all', // 'all', 'low', 'medium', 'high', 'full'
    hasSubjects: 'all' // 'all', 'yes', 'no'
  });

  // Données factices pour le cahier journal
  const [journalEntriesData, setJournalEntriesData] = useState([
    {
      id: 'JRN-2024-001',
      date: '2025-07-01',
      class: '6ème A',
      subject: 'Français',
      teacher: 'Marie Dubois',
      title: 'Étude de texte - Les Fables de La Fontaine',
      content: 'Lecture et analyse de la fable "Le Corbeau et le Renard". Travail sur le vocabulaire et la morale de l\'histoire. Exercices d\'application sur les figures de style.',
      homework: '',
      resources: ['Manuel p.45-47', 'Fiche d\'exercices distribuée en classe'],
      status: 'completed'
    },
    {
      id: 'JRN-2024-002',
      date: '2025-07-02',
      class: '5ème B',
      subject: 'Mathématiques',
      teacher: 'Pierre Martin',
      title: 'Théorème de Pythagore - Introduction',
      content: 'Présentation du théorème de Pythagore. Démonstration géométrique. Exercices d\'application simples sur des triangles rectangles.',
      homework: 'Exercices 1 à 5 page 112 du manuel.',
      resources: ['Manuel p.110-115', 'Vidéo explicative partagée sur l\'ENT'],
      status: 'completed'
    },
    {
      id: 'JRN-2024-003',
      date: '2025-07-03',
      class: 'Terminale S',
      subject: 'Physique-Chimie',
      teacher: 'Jean Moreau',
      title: 'Réactions d\'oxydo-réduction',
      content: 'Cours sur les réactions d\'oxydo-réduction. Définition des notions d\'oxydant et de réducteur. Équilibrage des équations redox. TP sur la pile Daniell.',
      homework: 'Préparer l\'exercice type bac p.245',
      resources: ['Manuel p.240-248', 'Protocole de TP distribué'],
      status: 'completed'
    },
    {
      id: 'JRN-2024-004',
      date: '2025-07-04',
      class: '6ème A',
      subject: 'Anglais',
      teacher: 'Sophie Laurent',
      title: 'Present continuous - Practice',
      content: 'Révision de la formation du present continuous. Exercices d\'application à l\'oral et à l\'écrit. Jeu de rôle par groupes de deux.',
      homework: 'Workbook p.28 ex.3-4',
      resources: ['Student\'s book p.34-35', 'Audio tracks 15-16'],
      status: 'in-progress'
    },
    {
      id: 'JRN-2024-005',
      date: '2025-07-08',
      class: 'Terminale S',
      subject: 'Mathématiques',
      teacher: 'Pierre Martin',
      title: 'Révisions - Fonctions exponentielles',
      content: 'Séance de révision sur les fonctions exponentielles et logarithmes. Rappels théoriques et exercices type bac.',
      homework: 'Terminer les exercices commencés en classe',
      resources: ['Polycopié de révision', 'Annales BAC 2024'],
      status: 'planned'
    }
  ]);

  // Données factices pour le cahier de textes
  const [textbookEntriesData, setTextbookEntriesData] = useState([
    {
      id: 'TXT-2024-001',
      date: '2025-07-01',
      class: '6ème A',
      subject: 'Français',
      teacher: 'Marie Dubois',
      title: 'Les Fables de La Fontaine',
      content: '',
      homework: 'Apprendre la fable "Le Corbeau et le Renard" par cœur pour la récitation de la semaine prochaine.',
      resources: ['Manuel p.45-47'],
      status: 'completed'
    },
    {
      id: 'TXT-2024-002',
      date: '2025-07-02',
      class: '5ème B',
      subject: 'Mathématiques',
      teacher: 'Pierre Martin',
      title: 'Théorème de Pythagore',
      content: '',
      homework: 'Exercices 1 à 5 page 112 du manuel. À rendre pour le prochain cours.',
      resources: ['Manuel p.110-115'],
      status: 'completed'
    },
    {
      id: 'TXT-2024-003',
      date: '2025-07-03',
      class: 'Terminale S',
      subject: 'Physique-Chimie',
      teacher: 'Jean Moreau',
      title: 'Réactions d\'oxydo-réduction',
      content: '',
      homework: 'Préparer l\'exercice type bac p.245 pour le prochain cours. Réviser les définitions d\'oxydant et réducteur.',
      resources: ['Manuel p.240-248'],
      status: 'completed'
    },
    {
      id: 'TXT-2024-004',
      date: '2025-07-04',
      class: '6ème A',
      subject: 'Anglais',
      teacher: 'Sophie Laurent',
      title: 'Present continuous',
      content: '',
      homework: 'Workbook p.28 ex.3-4. Préparer une description de 5 lignes en utilisant le present continuous.',
      resources: ['Student\'s book p.34-35'],
      status: 'in-progress'
    },
    {
      id: 'TXT-2024-005',
      date: '2025-07-08',
      class: 'Terminale S',
      subject: 'Mathématiques',
      teacher: 'Pierre Martin',
      title: 'Fonctions exponentielles',
      content: '',
      homework: 'Terminer les exercices commencés en classe. Préparer les annales p.45-48.',
      resources: ['Polycopié de révision', 'Annales BAC 2024'],
      status: 'planned'
    }
  ]);
  
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

  const classesData = useMemo(() => [
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
  ], []);

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

  // Données d'emploi du temps par classe
  const classSchedules = {
    '6ème A': [
      {
        time: '08:00-09:00',
        monday: { subject: 'Français', teacher: 'Mme Dubois', room: 'Salle 101' },
        tuesday: { subject: 'Mathématiques', teacher: 'M. Martin', room: 'Salle 102' },
        wednesday: { subject: 'Histoire-Géo', teacher: 'M. Durand', room: 'Salle 103' },
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
      },
      {
        time: '10:00-11:00',
        monday: { subject: 'Histoire-Géo', teacher: 'M. Durand', room: 'Salle 103' },
        tuesday: { subject: 'SVT', teacher: 'M. Bernard', room: 'Lab SVT' },
        wednesday: { subject: 'Français', teacher: 'Mme Dubois', room: 'Salle 101' },
        thursday: { subject: 'Mathématiques', teacher: 'M. Martin', room: 'Salle 102' },
        friday: { subject: 'Technologie', teacher: 'Mme Roux', room: 'Salle Tech' }
      }
    ],
    '5ème B': [
      {
        time: '08:00-09:00',
        monday: { subject: 'Mathématiques', teacher: 'M. Martin', room: 'Salle 205' },
        tuesday: { subject: 'Français', teacher: 'Mme Dubois', room: 'Salle 206' },
        wednesday: { subject: 'SVT', teacher: 'M. Bernard', room: 'Lab SVT' },
        thursday: { subject: 'Espagnol', teacher: 'Mme Garcia', room: 'Salle 207' },
        friday: { subject: 'Histoire-Géo', teacher: 'M. Durand', room: 'Salle 208' }
      },
      {
        time: '09:00-10:00',
        monday: { subject: 'Français', teacher: 'Mme Dubois', room: 'Salle 206' },
        tuesday: { subject: 'Mathématiques', teacher: 'M. Martin', room: 'Salle 205' },
        wednesday: { subject: 'Technologie', teacher: 'Mme Roux', room: 'Salle Tech' },
        thursday: { subject: 'SVT', teacher: 'M. Bernard', room: 'Lab SVT' },
        friday: { subject: 'Sport', teacher: 'M. Petit', room: 'Gymnase' }
      },
      {
        time: '10:00-11:00',
        monday: { subject: 'Histoire-Géo', teacher: 'M. Durand', room: 'Salle 208' },
        tuesday: { subject: 'Espagnol', teacher: 'Mme Garcia', room: 'Salle 207' },
        wednesday: { subject: 'Mathématiques', teacher: 'M. Martin', room: 'Salle 205' },
        thursday: { subject: 'Français', teacher: 'Mme Dubois', room: 'Salle 206' },
        friday: { subject: 'Physique', teacher: 'M. Moreau', room: 'Lab Physique' }
      }
    ],
    'Terminale S': [
      {
        time: '08:00-09:00',
        monday: { subject: 'Mathématiques', teacher: 'M. Martin', room: 'Salle 301' },
        tuesday: { subject: 'Physique-Chimie', teacher: 'M. Moreau', room: 'Lab Physique' },
        wednesday: { subject: 'SVT', teacher: 'M. Bernard', room: 'Lab SVT' },
        thursday: { subject: 'Philosophie', teacher: 'Mme Lefèvre', room: 'Salle 302' },
        friday: { subject: 'Mathématiques', teacher: 'M. Martin', room: 'Salle 301' }
      },
      {
        time: '09:00-10:00',
        monday: { subject: 'Physique-Chimie', teacher: 'M. Moreau', room: 'Lab Physique' },
        tuesday: { subject: 'Mathématiques', teacher: 'M. Martin', room: 'Salle 301' },
        wednesday: { subject: 'Philosophie', teacher: 'Mme Lefèvre', room: 'Salle 302' },
        thursday: { subject: 'SVT', teacher: 'M. Bernard', room: 'Lab SVT' },
        friday: { subject: 'Physique-Chimie', teacher: 'M. Moreau', room: 'Lab Physique' }
      },
      {
        time: '10:00-11:00',
        monday: { subject: 'SVT', teacher: 'M. Bernard', room: 'Lab SVT' },
        tuesday: { subject: 'Philosophie', teacher: 'Mme Lefèvre', room: 'Salle 302' },
        wednesday: { subject: 'Mathématiques', teacher: 'M. Martin', room: 'Salle 301' },
        thursday: { subject: 'Physique-Chimie', teacher: 'M. Moreau', room: 'Lab Physique' },
        friday: { subject: 'SVT', teacher: 'M. Bernard', room: 'Lab SVT' }
      }
    ]
  };

  // État pour stocker les emplois du temps générés
  const [generatedSchedules, setGeneratedSchedules] = useState(classSchedules);

  // Récupérer l'emploi du temps de la classe sélectionnée
  const scheduleData = useMemo(() => {
    // Récupérer les données de base
    const baseSchedule = generatedSchedules[selectedClass] || generatedSchedules['6ème A'];
    
    // Ajouter le samedi si manquant dans les données
    const scheduleWithSaturday = baseSchedule.map(slot => {
      if (!('saturday' in slot)) {
        return { ...slot, saturday: null };
      }
      return slot;
    });
    
    // Ajouter les pauses au planning
    const scheduleWithBreaks = [...scheduleWithSaturday];
    
    // Ajouter pause du matin
    scheduleWithBreaks.push({
      time: `${breakTimes.morning.start}-${breakTimes.morning.end}`,
      isBreak: true,
      label: breakTimes.morning.label,
      monday: { isBreak: true },
      tuesday: { isBreak: true },
      wednesday: { isBreak: true },
      thursday: { isBreak: true },
      friday: { isBreak: true }
    });
    
    // Ajouter pause déjeuner
    scheduleWithBreaks.push({
      time: `${breakTimes.lunch.start}-${breakTimes.lunch.end}`,
      isBreak: true,
      label: breakTimes.lunch.label,
      monday: { isBreak: true },
      tuesday: { isBreak: true },
      wednesday: { isBreak: true },
      thursday: { isBreak: true },
      friday: { isBreak: true }
    });
    
    // Ajouter pause après-midi
    scheduleWithBreaks.push({
      time: `${breakTimes.afternoon.start}-${breakTimes.afternoon.end}`,
      isBreak: true,
      label: breakTimes.afternoon.label,
      monday: { isBreak: true },
      tuesday: { isBreak: true },
      wednesday: { isBreak: true },
      thursday: { isBreak: true },
      friday: { isBreak: true }
    });
    
    // Trier le planning par heure
    return scheduleWithBreaks.sort((a, b) => {
      const timeA = a.time.split('-')[0];
      const timeB = b.time.split('-')[0];
      return timeA.localeCompare(timeB);
    });
  }, [selectedClass, breakTimes]);

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

  const subjectsData = [
    {
      id: 'SUB-2024-001',
      name: 'Français',
      level: 'Tous niveaux',
      department: 'Langues',
      hoursPerWeek: {
        'Maternelle': 5,
        'Primaire': 6,
        'Secondaire': 4
      },
      coefficient: 3,
      teachers: ['Mme Dubois', 'M. Leroy', 'Mme Petit']
    },
    {
      id: 'SUB-2024-002',
      name: 'Mathématiques',
      level: 'Tous niveaux',
      department: 'Sciences',
      hoursPerWeek: {
        'Maternelle': 3,
        'Primaire': 5,
        'Secondaire': 5
      },
      coefficient: 4,
      teachers: ['M. Martin', 'Mme Roux', 'M. Moreau']
    },
    {
      id: 'SUB-2024-003',
      name: 'Histoire-Géographie',
      level: 'Primaire et Secondaire',
      department: 'Sciences',
      hoursPerWeek: {
        'Primaire': 3,
        'Secondaire': 3.5
      },
      coefficient: 2,
      teachers: ['M. Durand', 'Mme Lefebvre']
    },
    {
      id: 'SUB-2024-004',
      name: 'Sciences de la Vie et de la Terre',
      level: 'Secondaire',
      department: 'Sciences',
      hoursPerWeek: {
        'Secondaire': 2.5
      },
      coefficient: 2,
      teachers: ['M. Bernard', 'Mme Girard']
    },
    {
      id: 'SUB-2024-005',
      name: 'Anglais',
      level: 'Primaire et Secondaire',
      department: 'Langues',
      hoursPerWeek: {
        'Primaire': 2,
        'Secondaire': 3
      },
      coefficient: 2,
      teachers: ['Mme Laurent', 'M. Thomas']
    }
  ];

  const educationLevels = [
    { id: 'MAT', name: 'Maternelle', classes: ['Petite Section', 'Moyenne Section', 'Grande Section'] },
    { id: 'PRI', name: 'Primaire', classes: ['CP', 'CE1', 'CE2', 'CM1', 'CM2'] },
    { id: 'SEC', name: 'Secondaire', classes: ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale'] }
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
  
  // État pour les classes filtrées
  const [filteredClassesData, setFilteredClassesData] = useState<any[]>([]);
  
  // Initialiser les données filtrées au chargement du composant
  useEffect(() => {
    setFilteredClassesData(classesData);
  }, [classesData]);
  
  // Appliquer les filtres quand ils changent
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...classesData];
      
      // Filtrer par niveau d'éducation
      if (classFilters.level) {
        filtered = filtered.filter(classItem => classItem.level === classFilters.level);
      }
      
      // Filtrer par taux d'occupation
      if (classFilters.occupancyRate !== 'all') {
        filtered = filtered.filter(classItem => {
          const occupancyRate = classItem.enrolled / classItem.capacity;
          
          switch (classFilters.occupancyRate) {
            case 'low': return occupancyRate < 0.25;
            case 'medium': return occupancyRate >= 0.25 && occupancyRate < 0.5;
            case 'high': return occupancyRate >= 0.5 && occupancyRate < 0.9;
            case 'full': return occupancyRate >= 0.9;
            default: return true;
          }
        });
      }
      
      // Filtrer par présence de matières
      if (classFilters.hasSubjects !== 'all') {
        filtered = filtered.filter(classItem => {
          if (classFilters.hasSubjects === 'yes') {
            return classItem.subjects && classItem.subjects.length > 0;
          } else {
            return !classItem.subjects || classItem.subjects.length === 0;
          }
        });
      }
      
      setFilteredClassesData(filtered);
    };
    
    applyFilters();
  }, [classFilters, classesData]);
  
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

  const handleTeacherSchedule = (teacher: any) => {
    setSelectedItem(teacher);
    setIsTeacherScheduleModalOpen(true);
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

  // Fonction pour générer automatiquement les emplois du temps
  const generateSchedules = () => {
    setIsGeneratingSchedule(true);
    
    // Créer une copie des emplois du temps actuels
    const newSchedules = { ...generatedSchedules };
    
    // Pour chaque classe
    classesData.forEach(classItem => {
      // Si la classe n'a pas d'emploi du temps, en créer un vide
      if (!newSchedules[classItem.name]) {
        newSchedules[classItem.name] = [];
      }
      
      // Créer un tableau pour les créneaux horaires standards
      const timeSlots = ['08:00-09:00', '09:00-10:00', '10:30-11:30', '11:30-12:30', '14:00-15:00', '15:00-16:00', '16:15-17:15'];
      
      // Créer un emploi du temps vide avec ces créneaux
      const emptySchedule = timeSlots.map(time => ({
        time,
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null
      }));
      
      // Fusionner avec l'emploi du temps existant pour conserver les entrées déjà définies
      const existingSlots = newSchedules[classItem.name];
      const mergedSchedule = emptySchedule.map(slot => {
        const existingSlot = existingSlots.find(existing => existing.time === slot.time);
        return existingSlot || slot;
      });
      
      // Répartir les matières sur les créneaux disponibles
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const subjects = classItem.subjects || [];
      
      // Pour chaque matière
      subjects.forEach(subject => {
        // Trouver un enseignant pour cette matière
        const teacher = teachersData.find(t => t.subject === subject && t.weeklyHours < t.maxHours);
        
        if (teacher) {
          // Trouver une salle disponible
          const room = resourcesData.find(r => r.status === 'available');
          const roomName = room ? room.name : 'À définir';
          
          // Chercher des créneaux libres pour cette matière
          // On essaie de placer chaque matière au moins 2 fois par semaine
          let placedCount = 0;
          
          days.forEach(day => {
            if (placedCount < 2) {
              // Chercher un créneau libre ce jour
              const availableSlot = mergedSchedule.find(slot => 
                !slot[day] && // Le créneau est libre ce jour
                !days.some(otherDay => // L'enseignant n'est pas déjà occupé sur ce créneau
                  slot[otherDay] && slot[otherDay].teacher === teacher.name
                )
              );
              
              if (availableSlot) {
                // Placer le cours
                availableSlot[day] = {
                  subject,
                  teacher: teacher.name,
                  room: roomName
                };
                placedCount++;
              }
            }
          });
        }
      });
      
      // Mettre à jour l'emploi du temps de la classe
      newSchedules[classItem.name] = mergedSchedule;
    });
    
    // Mettre à jour l'état avec les nouveaux emplois du temps
    setGeneratedSchedules(newSchedules);
    setIsGeneratingSchedule(false);
    
    // Afficher un message de confirmation
    setAlertMessage({
      title: 'Emplois du temps générés',
      message: 'Les emplois du temps ont été générés avec succès pour toutes les classes.',
      type: 'success'
    });
    setIsAlertModalOpen(true);
    setIsScheduleGenerationModalOpen(false);
  };
  
  // Gestionnaire pour le bouton "Générer auto"
  const handleGenerateSchedules = () => {
    setIsScheduleGenerationModalOpen(true);
  };
  
  // Gestion du cahier journal
  const handleAddJournalEntry = () => {
    setSelectedJournalEntry(null);
    setIsJournalEntryModalOpen(true);
  };

  const handleEditJournalEntry = (entry: any) => {
    setSelectedJournalEntry(entry);
    setIsJournalEntryModalOpen(true);
  };

  const handleDeleteJournalEntry = (entryId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette entrée du cahier journal ?')) {
      const updatedEntries = journalEntriesData.filter(entry => entry.id !== entryId);
      setJournalEntriesData(updatedEntries);
      
      setAlertMessage({
        title: 'Entrée supprimée',
        message: 'L\'entrée du cahier journal a été supprimée avec succès.',
        type: 'success'
      });
      setIsAlertModalOpen(true);
    }
  };

  const handleSaveJournalEntry = (entryData: any) => {
    // Traitement des ressources si elles sont fournies sous forme de chaîne
    let resources = entryData.resources;
    if (typeof resources === 'string') {
      resources = resources.split(',').map(item => item.trim()).filter(item => item !== '');
    } else if (!Array.isArray(resources)) {
      resources = [];
    }
    
    // Création ou mise à jour de l'entrée
    const updatedEntry = {
      ...entryData,
      resources,
      id: selectedJournalEntry ? selectedJournalEntry.id : `JRN-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
    };
    
    // Mise à jour des données
    if (selectedJournalEntry) {
      // Mise à jour d'une entrée existante
      const updatedEntries = journalEntriesData.map(entry => 
        entry.id === selectedJournalEntry.id ? updatedEntry : entry
      );
      // Dans un environnement réel, vous enverriez ces données à votre API
      console.log('Entrées mises à jour:', updatedEntries);
      setJournalEntriesData(updatedEntries);
    } else {
      // Ajout d'une nouvelle entrée
      const newEntries = [updatedEntry, ...journalEntriesData];
      // Dans un environnement réel, vous enverriez ces données à votre API
      console.log('Nouvelles entrées:', newEntries);
      setJournalEntriesData(newEntries);
    }
    
    // Fermeture du modal et affichage du message de confirmation
    setIsJournalEntryModalOpen(false);
    setAlertMessage({
      title: selectedJournalEntry ? 'Entrée modifiée' : 'Nouvelle entrée ajoutée',
      message: selectedJournalEntry 
        ? 'L\'entrée du cahier journal a été modifiée avec succès.' 
        : 'Une nouvelle entrée a été ajoutée au cahier journal.',
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };
  
  // Gestion du cahier de textes
  const handleAddTextbookEntry = () => {
    setSelectedTextbookEntry(null);
    setIsTextbookEntryModalOpen(true);
  };

  const handleEditTextbookEntry = (entry: any) => {
    setSelectedTextbookEntry(entry);
    setIsTextbookEntryModalOpen(true);
  };

  const handleDeleteTextbookEntry = (entryId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette entrée du cahier de textes ?')) {
      const updatedEntries = textbookEntriesData.filter(entry => entry.id !== entryId);
      setTextbookEntriesData(updatedEntries);
      
      setAlertMessage({
        title: 'Entrée supprimée',
        message: 'L\'entrée du cahier de textes a été supprimée avec succès.',
        type: 'success'
      });
      setIsAlertModalOpen(true);
    }
  };

  const handleSaveTextbookEntry = (entryData: any) => {
    // Traitement des ressources si elles sont fournies sous forme de chaîne
    let resources = entryData.resources;
    if (typeof resources === 'string') {
      resources = resources.split(',').map(item => item.trim()).filter(item => item !== '');
    } else if (!Array.isArray(resources)) {
      resources = [];
    }
    
    // Création ou mise à jour de l'entrée
    const updatedEntry = {
      ...entryData,
      resources,
      id: selectedTextbookEntry ? selectedTextbookEntry.id : `TXT-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
    };
    
    // Mise à jour des données
    if (selectedTextbookEntry) {
      // Mise à jour d'une entrée existante
      const updatedEntries = textbookEntriesData.map(item => 
        item.id === selectedTextbookEntry.id ? { ...item, ...entryData } : item
      );
      setTextbookEntriesData(updatedEntries);
    } else {
      // Ajout d'une nouvelle entrée
      const newEntry = {
        id: Date.now().toString(),
        ...entryData,
        date: new Date().toISOString(),
        teacher: 'Enseignant actuel' // À remplacer par l'utilisateur connecté
      };
      setTextbookEntriesData([...textbookEntriesData, newEntry]);
    }
    
    // Fermeture du modal et affichage du message de confirmation
    setIsTextbookEntryModalOpen(false);
    setAlertMessage({
      title: selectedTextbookEntry ? 'Entrée modifiée' : 'Nouvelle entrée ajoutée',
      message: selectedTextbookEntry 
        ? 'L\'entrée du cahier de textes a été modifiée avec succès.' 
        : 'Une nouvelle entrée a été ajoutée au cahier de textes.',
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };
  
  // Filtrer les entrées du cahier de textes
  const filteredTextbookEntries = useMemo(() => {
    return textbookEntriesData.filter(entry => {
      // Filtrer par classe
      if (textbookFilter.class && entry.class !== textbookFilter.class) {
        return false;
      }
      
      // Filtrer par matière
      if (textbookFilter.subject && entry.subject !== textbookFilter.subject) {
        return false;
      }
      
      // Filtrer par période
      if (textbookFilter.period !== 'all') {
        const entryDate = new Date(entry.date);
        const today = new Date();
        
        if (textbookFilter.period === 'today') {
          return entryDate.toDateString() === today.toDateString();
        }
        
        if (textbookFilter.period === 'week') {
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          return entryDate >= weekStart && entryDate <= weekEnd;
        }
        
        if (textbookFilter.period === 'month') {
          return entryDate.getMonth() === today.getMonth() && entryDate.getFullYear() === today.getFullYear();
        }
      }
      
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [textbookEntriesData, textbookFilter]);
  
  // Filtrer les entrées du cahier journal
  const filteredJournalEntries = useMemo(() => {
    return journalEntriesData.filter(entry => {
      // Filtrer par classe
      if (journalFilter.class && entry.class !== journalFilter.class) {
        return false;
      }
      
      // Filtrer par matière
      if (journalFilter.subject && entry.subject !== journalFilter.subject) {
        return false;
      }
      
      // Filtrer par période
      if (journalFilter.period !== 'all') {
        const entryDate = new Date(entry.date);
        const today = new Date();
        
        if (journalFilter.period === 'today') {
          return entryDate.toDateString() === today.toDateString();
        }
        
        if (journalFilter.period === 'week') {
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay() + 1); // Lundi de la semaine en cours
          return entryDate >= weekStart;
        }
        
        if (journalFilter.period === 'month') {
          return entryDate.getMonth() === today.getMonth() && 
                 entryDate.getFullYear() === today.getFullYear();
        }
      }
      
      return true;
    });
  }, [journalEntriesData, journalFilter]);
  
  // Fonction pour imprimer l'emploi du temps
  const printSchedule = () => {
    // Fermer le modal d'impression
    setIsPrintModalOpen(false);
    
    // Créer une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setAlertMessage({
        title: 'Erreur d\'impression',
        message: 'Impossible d\'ouvrir la fenêtre d\'impression. Veuillez vérifier les paramètres de votre navigateur.',
        type: 'error'
      });
      setIsAlertModalOpen(true);
      return;
    }
    
    // Récupérer les données de l'emploi du temps actuel
    const currentSchedule = generatedSchedules[selectedClass] || [];
    
    // Créer le contenu HTML pour l'impression
    const printContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Emploi du temps - ${selectedClass}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .school-info {
            font-size: 14px;
            margin-bottom: 10px;
          }
          h1 {
            font-size: 24px;
            margin: 0;
            padding: 0;
          }
          .subtitle {
            font-size: 16px;
            margin: 5px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          .time-col {
            width: 100px;
            font-weight: bold;
          }
          .break-row {
            background-color: #fff8e1;
          }
          .subject {
            font-weight: bold;
            margin-bottom: 3px;
          }
          .teacher {
            font-size: 12px;
            margin-bottom: 2px;
          }
          .room {
            font-size: 12px;
            font-style: italic;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            text-align: center;
            color: #666;
          }
          @media print {
            body {
              padding: 0;
              margin: 0;
            }
            button {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-info">Academia Hub - Établissement scolaire</div>
          <h1>Emploi du temps</h1>
          <p class="subtitle">Classe: ${selectedClass} - Année scolaire 2024-2025</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th class="time-col">Horaire</th>
              <th>Lundi</th>
              <th>Mardi</th>
              <th>Mercredi</th>
              <th>Jeudi</th>
              <th>Vendredi</th>
              <th>Samedi</th>
            </tr>
          </thead>
          <tbody>
            ${scheduleData.map(slot => {
              const isBreak = slot.isBreak === true;
              return `
                <tr class="${isBreak ? 'break-row' : ''}">
                  <td class="time-col">
                    ${slot.time}
                    ${isBreak ? `<div><small>${slot.label || ''}</small></div>` : ''}
                  </td>
                  ${['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map(day => {
                    const course = slot[day];
                    if (!course) return '<td></td>';
                    return `
                      <td>
                        ${course.subject ? `<div class="subject">${course.subject}</div>` : ''}
                        ${course.teacher ? `<div class="teacher">${course.teacher}</div>` : ''}
                        ${course.room ? `<div class="room">${course.room}</div>` : ''}
                      </td>
                    `;
                  }).join('')}
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          }
        </script>
      </body>
      </html>
    `;
    
    // Écrire le contenu dans la nouvelle fenêtre
    printWindow.document.write(printContent);
    printWindow.document.close();
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

  // Note: Les fonctions de gestion du cahier journal sont définies plus haut dans le fichier

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

  const handleNewSubject = () => {
    setIsEditMode(false);
    setSelectedItem(null);
    setIsSubjectModalOpen(true);
  };

  const handleEditSubject = (subject: Subject) => {
    setIsEditMode(true);
    setSelectedItem(subject);
    setIsSubjectModalOpen(true);
  };

  // Gestion des fiches pédagogiques
  const handleEditFiche = (id: string) => {
    console.log(`Édition de la fiche ${id}`);
    // Logique pour éditer une fiche pédagogique
  };

  const handleViewFiche = (id: string) => {
    console.log(`Visualisation de la fiche ${id}`);
    // Logique pour visualiser une fiche pédagogique
  };

  const handleUpdateFiche = (id: string, updates: any) => {
    console.log(`Mise à jour de la fiche ${id}`, updates);
    // Logique pour mettre à jour une fiche pédagogique
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
            className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
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
              { id: 'resources', label: 'Ressources', icon: MapPin },
              { id: 'subjects', label: 'Matières', icon: Book },
              { id: 'classes', label: 'Classes & Séries', icon: Building },
              { id: 'teachers', label: 'Enseignants', icon: Users },
              { id: 'schedule', label: 'Emploi du temps', icon: Calendar },
              { id: 'journal', label: 'Cahier journal', icon: BookOpen },
              { id: 'fiches', label: 'Fiches pédagogiques', icon: FileText },
              { id: 'textes', label: 'Cahier de textes', icon: Clipboard },
              { id: 'availability', label: 'Disponibilités', icon: Clock },
              { id: 'hours', label: 'Heures de cours', icon: BarChart3 }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    // Si l'onglet fiches est cliqué, mettre à jour l'état ficheTabClicked
                    if (tab.id === 'fiches') {
                      setFicheTabClicked(true);
                      console.log('Fiches tab clicked, setting activeTab to:', tab.id);
                    }
                  }}
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
                    Créer les salles
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
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50"
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

          {activeTab === 'subjects' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Gestion des matières</h3>
                <div className="flex space-x-2">
                  <button 
                    className="inline-flex items-center px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800"
                    onClick={handleNewSubject}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle matière
                  </button>
                </div>
              </div>

              {/* Filtres par niveau */}
              <div className="flex flex-wrap gap-2">
                <button 
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${selectedEducationLevel === null ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                  onClick={() => setSelectedEducationLevel(null)}
                  aria-label="Afficher toutes les matières, tous niveaux confondus"
                  title="Afficher toutes les matières, tous niveaux confondus"
                >
                  Tous les niveaux
                </button>
                {educationLevels.map(level => (
                  <button 
                    key={level.id}
                    className={`px-3 py-1 rounded-lg text-sm ${selectedEducationLevel === level.name ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    onClick={() => setSelectedEducationLevel(level.name)}
                    aria-label={`Filtrer les matières du niveau ${level.name}`}
                    title={`Filtrer les matières du niveau ${level.name}`}
                  >
                    {level.name}
                  </button>
                ))}
              </div>

              {/* Liste des matières */}
              <div className="grid gap-4">
                {subjectsData
                  .filter(subject => {
                    if (selectedEducationLevel === null) return true;
                    
                    // Vérifier si la matière s'applique au niveau sélectionné
                    if (subject.level === selectedEducationLevel) return true;
                    if (subject.level === 'Tous niveaux') return true;
                    if (subject.level === 'Primaire et Secondaire' && 
                        (selectedEducationLevel === 'Primaire' || selectedEducationLevel === 'Secondaire')) return true;
                    if (subject.level.includes(selectedEducationLevel)) return true;
                    
                    // Vérifier si la matière a des heures définies pour ce niveau
                    return subject.hoursPerWeek[selectedEducationLevel] !== undefined;
                  })
                  .map((subject) => (
                  <div key={subject.id} className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-900/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{subject.name} {subject.abbreviation && <span className="text-gray-600 dark:text-gray-400">({subject.abbreviation})</span>}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Niveau: {subject.level} • Département: {subject.department}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">Enseignants: {subject.teachers.join(', ')}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex flex-col space-y-2">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Heures hebdomadaires</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {Object.entries(subject.hoursPerWeek).map(([level, hours]) => (
                                <span key={level} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded text-xs">
                                  {level}: {hours}h
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {/* Affichage du coefficient pour les matières du secondaire */}
                          {(subject.level === 'Secondaire' || subject.level === 'Tous niveaux' || subject.level === 'Primaire et Secondaire') && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600 dark:text-gray-400">Coefficient (Secondaire)</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded text-xs font-semibold">
                                  Coef. {subject.coefficient}
                                </span>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex space-x-2 mt-2">
                            <button 
                              className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50"
                              onClick={() => handleEditSubject(subject)}
                            >
                              Modifier
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Espace réservé pour de futures fonctionnalités */}
            </div>
          )}

          {activeTab === 'classes' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Gestion des classes et séries</h3>
                <div className="flex flex-wrap gap-2">
                  <button 
                    className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => setIsClassFilterModalOpen(true)}
                  >
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
              
              {/* Filtres actifs */}
              <div className="flex flex-wrap gap-2 items-center">
                {(classFilters.level || classFilters.occupancyRate !== 'all' || classFilters.hasSubjects !== 'all') && (
                  <>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Filtres actifs:</span>
                    
                    {classFilters.level && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        Niveau: {classFilters.level}
                        <X 
                          className="w-3 h-3 ml-1 cursor-pointer" 
                          onClick={() => setClassFilters(prev => ({ ...prev, level: '' }))}
                        />
                      </span>
                    )}
                    
                    {classFilters.occupancyRate !== 'all' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                        Occupation: {classFilters.occupancyRate === 'low' ? 'Faible' : 
                                    classFilters.occupancyRate === 'medium' ? 'Moyenne' : 
                                    classFilters.occupancyRate === 'high' ? 'Élevée' : 'Complète'}
                        <X 
                          className="w-3 h-3 ml-1 cursor-pointer" 
                          onClick={() => setClassFilters(prev => ({ ...prev, occupancyRate: 'all' }))}
                        />
                      </span>
                    )}
                    
                    {classFilters.hasSubjects !== 'all' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                        Matières: {classFilters.hasSubjects === 'yes' ? 'Avec matières' : 'Sans matières'}
                        <X 
                          className="w-3 h-3 ml-1 cursor-pointer" 
                          onClick={() => setClassFilters(prev => ({ ...prev, hasSubjects: 'all' }))}
                        />
                      </span>
                    )}
                    
                    <button 
                      className="inline-flex items-center px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                      onClick={() => setClassFilters({ level: '', occupancyRate: 'all', hasSubjects: 'all' })}
                    >
                      Effacer tous les filtres
                    </button>
                  </>
                )}
              </div>

              <div className="grid gap-4">
                {filteredClassesData.map((classItem) => (
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
                          <button
                            className="px-3 py-1.5 text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                            onClick={() => handleTeacherSchedule(teacher)}
                            title="Voir le planning de l'enseignant"
                          >
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
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Emploi du temps</h3>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-gray-200"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    aria-label="Sélectionner une classe"
                    title="Sélectionner une classe"
                  >
                    {classesData.map((cls) => (
                      <option key={cls.id} value={cls.name}>
                        {cls.name} ({cls.level})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => setIsBreakTimeModalOpen(true)}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Modifier les pauses
                  </button>
                  <button 
                    className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={handleGenerateSchedules}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Générer auto
                  </button>
                  <button 
                    className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => setIsPrintModalOpen(true)}
                    aria-label="Imprimer l'emploi du temps"
                    title="Imprimer l'emploi du temps"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimer
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
                        <th className="px-4 py-2 text-center text-sm font-medium text-gray-900 dark:text-gray-100 border-b dark:border-gray-700">Vendredi</th>
                        <th className="px-4 py-2 text-center text-sm font-medium text-gray-900 dark:text-gray-100 border-b dark:border-gray-700">Samedi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {scheduleData.map((slot, index) => (
                        <tr key={index} className={`${slot.isBreak ? 'bg-amber-50 dark:bg-amber-900/20' : ''} hover:bg-gray-50 dark:hover:bg-gray-900/50`}>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${slot.isBreak ? 'text-amber-700 dark:text-amber-400' : 'text-gray-900 dark:text-gray-100'}`}>
                            {slot.time}
                            {slot.isBreak && <span className="block text-xs font-medium">{slot.label}</span>}
                          </td>
                          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) => {
                            const course = slot[day as keyof typeof slot] as any;
                            return (
                              <td key={day} className="px-4 py-4 whitespace-nowrap">
                                {course && course.isBreak ? (
                                  <div className="bg-amber-100 dark:bg-amber-900/20 rounded-lg p-2 border-l-4 border-amber-500 dark:border-amber-700">
                                    <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Pause</p>
                                  </div>
                                ) : course && (
                                  <div 
                                    className={`rounded-lg p-2 cursor-pointer hover:opacity-90 transition-opacity ${
                                      course.subject === 'Français' ? 'bg-blue-100 border-l-4 border-blue-500' :
                                      course.subject === 'Mathématiques' ? 'bg-purple-100 border-l-4 border-purple-500' :
                                      course.subject === 'Histoire-Géo' ? 'bg-green-100 border-l-4 border-green-500' :
                                      course.subject === 'Anglais' ? 'bg-yellow-100 border-l-4 border-yellow-500' :
                                      course.subject === 'SVT' ? 'bg-pink-100 border-l-4 border-pink-500' :
                                      course.subject === 'Sport' ? 'bg-orange-100 border-l-4 border-orange-500' :
                                      course.subject === 'Physique' ? 'bg-red-100 border-l-4 border-red-500' :
                                      'bg-gray-100 border-l-4 border-gray-500'
                                    } dark:bg-gray-900/30 dark:border-gray-700`}
                                    onClick={() => {
                                      setSelectedItem(course);
                                      setIsScheduleEntryModalOpen(true);
                                    }}
                                  >
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{course.subject}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{course.teacher}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">{course.room}</p>
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

              {/* Indicateurs de conflits */}
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Conflits potentiels</h4>
                    <ul className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      {scheduleData.map((slot, index) => {
                        const conflicts = {};
                        const daySlots = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
                        
                        // Vérifier les conflits de salle dans tous les emplois du temps
                        const rooms = new Set();
                        daySlots.forEach(day => {
                          const course = slot[day as keyof typeof slot];
                          if (course && course.room) {
                            // Vérifier les conflits dans les autres classes à la même heure
                            Object.entries(classSchedules).forEach(([className, classSchedule]) => {
                              if (className !== selectedClass && classSchedule[index]) {
                                const otherCourse = classSchedule[index][day as keyof typeof slot];
                                if (otherCourse && otherCourse.room === course.room) {
                                  conflicts[`${course.room} (avec ${className})`] = true;
                                }
                              }
                            });
                            
                            // Vérifier les conflits dans la même classe
                            if (rooms.has(course.room)) {
                              conflicts[course.room] = true;
                            }
                            rooms.add(course.room);
                          }
                        });

                        // Vérifier les conflits d'enseignant
                        const teachers = new Set();
                        daySlots.forEach(day => {
                          const course = slot[day as keyof typeof slot];
                          if (course && course.teacher) {
                            // Vérifier les conflits dans les autres classes à la même heure
                            Object.entries(classSchedules).forEach(([className, classSchedule]) => {
                              if (className !== selectedClass && classSchedule[index]) {
                                const otherCourse = classSchedule[index][day as keyof typeof slot];
                                if (otherCourse && otherCourse.teacher === course.teacher) {
                                  conflicts[`${course.teacher} (avec ${className})`] = true;
                                }
                              }
                            });
                            
                            // Vérifier les conflits dans la même classe
                            if (teachers.has(course.teacher)) {
                              conflicts[course.teacher] = true;
                            }
                            teachers.add(course.teacher);
                          }
                        });

                        if (Object.keys(conflicts).length > 0) {
                          return (
                            <li key={index}>
                              <span className="font-medium">{slot.time}:</span>
                              {Object.entries(conflicts).map(([entity, _]) => (
                                <span key={entity} className="ml-2">
                                  <span className="text-yellow-600 dark:text-yellow-400">⚠️</span> {entity} en double
                                </span>
                              ))}
                            </li>
                          );
                        }
                        return null;
                      }).filter(Boolean)}
                    </ul>
                  </div>
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

          {activeTab === 'journal' && (
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Cahier Journal</h3>
              </div>
              <JournalTab onlineStatus={true} />
            </div>
          )}
          
          {activeTab === 'textes' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Cahier de Textes</h3>
              </div>
              
              <CahierTexteBoard onlineStatus={true} onAddEntry={handleAddTextbookEntry} />
            </div>
          )}
          
          {(activeTab === 'fiches' || ficheTabClicked) && (
            <div className="space-y-6 fiches-container">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Fiches pédagogiques</h3>
              </div>
              <FicheProvider>
                <FichesPedagogiquesTab
                  onEdit={handleEditFiche}
                  onView={handleViewFiche}
                  updateFiche={handleUpdateFiche}
                  securityContext={securityContext}
                  setNotifications={setNotifications}
                />
              </FicheProvider>
            </div>
          )}

          {activeTab === 'hours' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Heures de cours</h3>
                <button 
                  className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
                  onClick={() => setIsWorkHoursModalOpen(true)}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Définir les heures
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
      {/* Modal pour configurer les heures de pause */}
      <FormModal
        isOpen={isBreakTimeModalOpen}
        onClose={() => setIsBreakTimeModalOpen(false)}
        title="Configuration des heures de pause"
        footer={
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsBreakTimeModalOpen(false)}
            >
              Annuler
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-800"
              onClick={() => {
                setIsBreakTimeModalOpen(false);
                setAlertMessage({
                  title: 'Pauses mises à jour',
                  message: 'Les horaires de pause ont été mis à jour avec succès.',
                  type: 'success'
                });
                setIsAlertModalOpen(true);
              }}
            >
              Enregistrer
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Récréation du matin</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Début</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800"
                  value={breakTimes.morning.start}
                  onChange={(e) => setBreakTimes(prev => ({
                    ...prev,
                    morning: { ...prev.morning, start: e.target.value }
                  }))}
                  aria-label="Heure de début de la récréation du matin"
                  title="Heure de début de la récréation du matin"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Fin</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800"
                  value={breakTimes.morning.end}
                  onChange={(e) => setBreakTimes(prev => ({
                    ...prev,
                    morning: { ...prev.morning, end: e.target.value }
                  }))}
                  aria-label="Heure de fin de la récréation du matin"
                  title="Heure de fin de la récréation du matin"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Pause déjeuner</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Début</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800"
                  value={breakTimes.lunch.start}
                  onChange={(e) => setBreakTimes(prev => ({
                    ...prev,
                    lunch: { ...prev.lunch, start: e.target.value }
                  }))}
                  aria-label="Heure de début de la pause déjeuner"
                  title="Heure de début de la pause déjeuner"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Fin</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800"
                  value={breakTimes.lunch.end}
                  onChange={(e) => setBreakTimes(prev => ({
                    ...prev,
                    lunch: { ...prev.lunch, end: e.target.value }
                  }))}
                  aria-label="Heure de fin de la pause déjeuner"
                  title="Heure de fin de la pause déjeuner"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Récréation de l'après-midi</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Début</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800"
                  value={breakTimes.afternoon.start}
                  onChange={(e) => setBreakTimes(prev => ({
                    ...prev,
                    afternoon: { ...prev.afternoon, start: e.target.value }
                  }))}
                  aria-label="Heure de début de la récréation de l'après-midi"
                  title="Heure de début de la récréation de l'après-midi"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Fin</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800"
                  value={breakTimes.afternoon.end}
                  onChange={(e) => setBreakTimes(prev => ({
                    ...prev,
                    afternoon: { ...prev.afternoon, end: e.target.value }
                  }))}
                  aria-label="Heure de fin de la récréation de l'après-midi"
                  title="Heure de fin de la récréation de l'après-midi"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Libellés des pauses</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Récréation matin</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800"
                  value={breakTimes.morning.label}
                  onChange={(e) => setBreakTimes(prev => ({
                    ...prev,
                    morning: { ...prev.morning, label: e.target.value }
                  }))}
                  aria-label="Libellé de la récréation du matin"
                  title="Libellé de la récréation du matin"
                  placeholder="Libellé affiché dans l'emploi du temps"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Pause déjeuner</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800"
                  value={breakTimes.lunch.label}
                  onChange={(e) => setBreakTimes(prev => ({
                    ...prev,
                    lunch: { ...prev.lunch, label: e.target.value }
                  }))}
                  aria-label="Libellé de la pause déjeuner"
                  title="Libellé de la pause déjeuner"
                  placeholder="Libellé affiché dans l'emploi du temps"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Récréation après-midi</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800"
                  value={breakTimes.afternoon.label}
                  onChange={(e) => setBreakTimes(prev => ({
                    ...prev,
                    afternoon: { ...prev.afternoon, label: e.target.value }
                  }))}
                  aria-label="Libellé de la récréation de l'après-midi"
                  title="Libellé de la récréation de l'après-midi"
                  placeholder="Libellé affiché dans l'emploi du temps"
                />
              </div>
            </div>
          </div>
        </div>
      </FormModal>
      
      {/* Modal d'impression */}
      {/* Modal d'ajout/modification d'entrée de journal */}
      <FormModal
        isOpen={isJournalEntryModalOpen}
        onClose={() => setIsJournalEntryModalOpen(false)}
        title={selectedJournalEntry ? "Modifier l'entrée" : "Nouvelle entrée de journal"}
        size="lg"
        footer={
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsJournalEntryModalOpen(false)}
            >
              Annuler
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-800"
              onClick={() => handleSaveJournalEntry({})}
            >
              {selectedJournalEntry ? "Enregistrer les modifications" : "Ajouter l'entrée"}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="journalTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre</label>
              <input
                type="text"
                id="journalTitle"
                className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:text-gray-200"
                defaultValue={selectedJournalEntry?.title || ''}
                placeholder="Titre de la séance"
                aria-label="Titre de l'entrée"
              />
            </div>
            
            <div>
              <label htmlFor="journalDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
              <input
                type="date"
                id="journalDate"
                className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:text-gray-200"
                defaultValue={selectedJournalEntry?.date || new Date().toISOString().split('T')[0]}
                aria-label="Date de la séance"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="journalClass" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Classe</label>
              <select
                id="journalClass"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-gray-200"
                defaultValue={selectedJournalEntry?.class || ''}
                aria-label="Classe concernée"
              >
                <option value="">Sélectionner une classe</option>
                {classesData.map((cls) => (
                  <option key={cls.id} value={cls.name}>{cls.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="journalSubject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Matière</label>
              <select
                id="journalSubject"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-gray-200"
                defaultValue={selectedJournalEntry?.subject || ''}
                aria-label="Matière concernée"
              >
                <option value="">Sélectionner une matière</option>
                {Array.from(new Set(journalEntriesData.map(entry => entry.subject))).map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="journalContent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contenu du cours</label>
            <textarea
              id="journalContent"
              rows={5}
              className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:text-gray-200"
              defaultValue={selectedJournalEntry?.content || ''}
              placeholder="Détaillez le contenu de la séance..."
              aria-label="Contenu du cours"
            />
          </div>
          
          <div>
            <label htmlFor="journalHomework" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Travail à faire</label>
            <textarea
              id="journalHomework"
              rows={2}
              className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:text-gray-200"
              defaultValue={selectedJournalEntry?.homework || ''}
              placeholder="Travail à faire pour la prochaine séance..."
              aria-label="Travail à faire"
            />
          </div>
          
          <div>
            <label htmlFor="journalResources" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ressources</label>
            <textarea
              id="journalResources"
              rows={2}
              className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:text-gray-200"
              defaultValue={selectedJournalEntry?.resources ? selectedJournalEntry.resources.join('\n') : ''}
              placeholder="Une ressource par ligne (manuels, liens, documents...)"
              aria-label="Ressources utilisées"
            />
          </div>
          
          <div>
            <label htmlFor="journalStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Statut</label>
            <select
              id="journalStatus"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-gray-200"
              defaultValue={selectedJournalEntry?.status || 'planned'}
              aria-label="Statut de la séance"
            >
              <option value="planned">Planifié</option>
              <option value="in-progress">En cours</option>
              <option value="completed">Terminé</option>
            </select>
          </div>
        </div>
      </FormModal>
      
      {/* Modal pour l'ajout/édition d'une entrée du cahier de textes */}
      <FormModal
        isOpen={isTextbookEntryModalOpen}
        onClose={() => setIsTextbookEntryModalOpen(false)}
        title={selectedTextbookEntry ? 'Modifier une entrée du cahier de textes' : 'Ajouter une entrée au cahier de textes'}
        onSubmit={(data) => handleSaveTextbookEntry(data)}
        initialValues={selectedTextbookEntry || {
          date: new Date().toISOString().split('T')[0],
          class: '',
          subject: '',
          teacher: '',
          title: '',
          content: '',
          homework: '',
          resources: [],
          status: 'planned'
        }}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  value={values.date || ''}
                  onChange={(e) => setFieldValue('date', e.target.value)}
                  className={`w-full px-3 py-2 border ${touched.date && errors.date ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                />
                {touched.date && errors.date && (
                  <p className="mt-1 text-sm text-red-500">{errors.date}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="class" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Classe <span className="text-red-500">*</span>
                </label>
                <select
                  id="class"
                  name="class"
                  required
                  value={values.class || ''}
                  onChange={(e) => setFieldValue('class', e.target.value)}
                  className={`w-full px-3 py-2 border ${touched.class && errors.class ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                >
                  <option value="">Sélectionner une classe</option>
                  {Array.from(new Set(classesData.map(c => c.name))).map(className => (
                    <option key={className} value={className}>{className}</option>
                  ))}
                </select>
                {touched.class && errors.class && (
                  <p className="mt-1 text-sm text-red-500">{errors.class}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Matière <span className="text-red-500">*</span>
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={values.subject || ''}
                  onChange={(e) => setFieldValue('subject', e.target.value)}
                  className={`w-full px-3 py-2 border ${touched.subject && errors.subject ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                >
                  <option value="">Sélectionner une matière</option>
                  {Array.from(new Set(subjectsData.map(s => s.name))).map(subjectName => (
                    <option key={subjectName} value={subjectName}>{subjectName}</option>
                  ))}
                </select>
                {touched.subject && errors.subject && (
                  <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="teacher" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Enseignant <span className="text-red-500">*</span>
                </label>
                <select
                  id="teacher"
                  name="teacher"
                  required
                  value={values.teacher || ''}
                  onChange={(e) => setFieldValue('teacher', e.target.value)}
                  className={`w-full px-3 py-2 border ${touched.teacher && errors.teacher ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                >
                  <option value="">Sélectionner un enseignant</option>
                  {Array.from(new Set(teachersData.map(t => t.name))).map(teacherName => (
                    <option key={teacherName} value={teacherName}>{teacherName}</option>
                  ))}
                </select>
                {touched.teacher && errors.teacher && (
                  <p className="mt-1 text-sm text-red-500">{errors.teacher}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Titre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={values.title || ''}
                onChange={(e) => setFieldValue('title', e.target.value)}
                className={`w-full px-3 py-2 border ${touched.title && errors.title ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                placeholder="Titre de la séance"
              />
              {touched.title && errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contenu du cours
              </label>
              <textarea
                id="content"
                name="content"
                rows={3}
                value={values.content || ''}
                onChange={(e) => setFieldValue('content', e.target.value)}
                className={`w-full px-3 py-2 border ${touched.content && errors.content ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                placeholder="Contenu du cours (optionnel pour le cahier de textes)"
              />
              {touched.content && errors.content && (
                <p className="mt-1 text-sm text-red-500">{errors.content}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="homework" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Travail à faire <span className="text-red-500">*</span>
              </label>
              <textarea
                id="homework"
                name="homework"
                rows={5}
                required
                value={values.homework || ''}
                onChange={(e) => setFieldValue('homework', e.target.value)}
                className={`w-full px-3 py-2 border ${touched.homework && errors.homework ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                placeholder="Détaillez le travail à faire pour la prochaine séance"
              />
              {touched.homework && errors.homework && (
                <p className="mt-1 text-sm text-red-500">{errors.homework}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="resources" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ressources
              </label>
              <textarea
                id="resources"
                name="resources"
                rows={2}
                value={Array.isArray(values.resources) ? values.resources.join(', ') : values.resources || ''}
                onChange={(e) => setFieldValue('resources', e.target.value)}
                className={`w-full px-3 py-2 border ${touched.resources && errors.resources ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                placeholder="Liste des ressources séparées par des virgules"
              />
              {touched.resources && errors.resources && (
                <p className="mt-1 text-sm text-red-500">{errors.resources}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Statut
              </label>
              <select
                id="status"
                name="status"
                value={values.status || 'planned'}
                onChange={(e) => setFieldValue('status', e.target.value)}
                className={`w-full px-3 py-2 border ${touched.status && errors.status ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
              >
                <option value="planned">Planifié</option>
                <option value="in-progress">En cours</option>
                <option value="completed">Terminé</option>
              </select>
              {touched.status && errors.status && (
                <p className="mt-1 text-sm text-red-500">{errors.status}</p>
              )}
            </div>
          </form>
        )}
      </FormModal>
      
      <FormModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title="Imprimer l'emploi du temps"
        size="sm"
        footer={
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsPrintModalOpen(false)}
            >
              Annuler
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-800"
              onClick={printSchedule}
            >
              Imprimer
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Vous êtes sur le point d'imprimer l'emploi du temps de la classe <strong>{selectedClass}</strong>.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <input type="checkbox" id="includeLogo" className="rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500 dark:bg-gray-800" defaultChecked />
              <label htmlFor="includeLogo" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Inclure le logo de l'établissement</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="includeFooter" className="rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500 dark:bg-gray-800" defaultChecked />
              <label htmlFor="includeFooter" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Inclure les informations en pied de page</label>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Une nouvelle fenêtre va s'ouvrir avec la version imprimable de l'emploi du temps.
            </p>
          </div>
        </div>
      </FormModal>
      
      {/* Modal de confirmation pour la génération d'emploi du temps */}
      <FormModal
        isOpen={isScheduleGenerationModalOpen}
        onClose={() => setIsScheduleGenerationModalOpen(false)}
        title="Génération automatique des emplois du temps"
        size="md"
        footer={
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsScheduleGenerationModalOpen(false)}
            >
              Annuler
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-800"
              onClick={generateSchedules}
              disabled={isGeneratingSchedule}
            >
              {isGeneratingSchedule ? 'Génération en cours...' : 'Générer les emplois du temps'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Cette action va générer automatiquement les emplois du temps pour toutes les classes en fonction des enseignants disponibles et des matières assignées.
          </p>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md border border-yellow-200 dark:border-yellow-900/30">
            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-400 mb-2">Attention</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              La génération automatique peut écraser certaines entrées existantes dans les emplois du temps. Les pauses configurées seront préservées.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Paramètres de génération</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <input type="checkbox" id="respectTeacherAvailability" className="rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500 dark:bg-gray-800" defaultChecked />
                <label htmlFor="respectTeacherAvailability" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Respecter les disponibilités des enseignants</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="avoidConflicts" className="rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500 dark:bg-gray-800" defaultChecked />
                <label htmlFor="avoidConflicts" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Éviter les conflits de salles</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="balanceSubjects" className="rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500 dark:bg-gray-800" defaultChecked />
                <label htmlFor="balanceSubjects" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Équilibrer les matières sur la semaine</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="includeSaturday" className="rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500 dark:bg-gray-800" defaultChecked />
                <label htmlFor="includeSaturday" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Inclure le samedi dans la planification</label>
              </div>
            </div>
          </div>
        </div>
      </FormModal>

      <ClassModal 
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        onSave={handleSaveClass}
        classData={selectedItem}
        isEdit={isEditMode}
      />
      
      {/* Modal de filtres pour les classes */}
      <FormModal
        isOpen={isClassFilterModalOpen}
        onClose={() => setIsClassFilterModalOpen(false)}
        title="Filtrer les classes"
        submitLabel="Appliquer les filtres"
        onSubmit={() => setIsClassFilterModalOpen(false)}
        size="md"
        icon={Filter}
      >
        <form className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Niveau d'éducation
              </label>
              <select
                id="level"
                name="level"
                value={classFilters.level}
                onChange={(e) => setClassFilters(prev => ({ ...prev, level: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Tous les niveaux</option>
                {educationLevels.map(level => (
                  <option key={level.id} value={level.name}>{level.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="occupancyRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Taux d'occupation
              </label>
              <select
                id="occupancyRate"
                name="occupancyRate"
                value={classFilters.occupancyRate}
                onChange={(e) => setClassFilters(prev => ({ ...prev, occupancyRate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="all">Tous les taux</option>
                <option value="low">Faible (&lt; 25%)</option>
                <option value="medium">Moyen (25% - 50%)</option>
                <option value="high">Élevé (50% - 90%)</option>
                <option value="full">Complet (&gt; 90%)</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="hasSubjects" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Matières
              </label>
              <select
                id="hasSubjects"
                name="hasSubjects"
                value={classFilters.hasSubjects}
                onChange={(e) => setClassFilters(prev => ({ ...prev, hasSubjects: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="all">Toutes les classes</option>
                <option value="yes">Avec matières</option>
                <option value="no">Sans matières</option>
              </select>
            </div>
          </div>
        </form>
      </FormModal>

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

      {/* Modal pour l'ajout/édition d'une entrée du cahier journal */}
      <FormModal
        isOpen={isJournalEntryModalOpen}
        onClose={() => setIsJournalEntryModalOpen(false)}
        title={selectedJournalEntry ? 'Modifier une entrée du cahier journal' : 'Ajouter une entrée au cahier journal'}
        onSubmit={(data) => handleSaveJournalEntry(data)}
        initialValues={selectedJournalEntry || {
          date: new Date().toISOString().split('T')[0],
          class: '',
          subject: '',
          teacher: '',
          title: '',
          content: '',
          homework: '',
          resources: [],
          status: 'planned'
        }}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  value={values.date || ''}
                  onChange={(e) => setFieldValue('date', e.target.value)}
                  className={`w-full px-3 py-2 border ${touched.date && errors.date ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                />
                {touched.date && errors.date && (
                  <p className="mt-1 text-sm text-red-500">{errors.date}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="class" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Classe <span className="text-red-500">*</span>
                </label>
                <select
                  id="class"
                  name="class"
                  required
                  value={values.class || ''}
                  onChange={(e) => setFieldValue('class', e.target.value)}
                  className={`w-full px-3 py-2 border ${touched.class && errors.class ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                >
                  <option value="">Sélectionner une classe</option>
                  {Array.from(new Set(classesData.map(c => c.name))).map(className => (
                    <option key={className} value={className}>{className}</option>
                  ))}
                </select>
                {touched.class && errors.class && (
                  <p className="mt-1 text-sm text-red-500">{errors.class}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Matière <span className="text-red-500">*</span>
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={values.subject || ''}
                  onChange={(e) => setFieldValue('subject', e.target.value)}
                  className={`w-full px-3 py-2 border ${touched.subject && errors.subject ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                >
                  <option value="">Sélectionner une matière</option>
                  {Array.from(new Set(subjectsData.map(s => s.name))).map(subjectName => (
                    <option key={subjectName} value={subjectName}>{subjectName}</option>
                  ))}
                </select>
                {touched.subject && errors.subject && (
                  <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="teacher" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Enseignant <span className="text-red-500">*</span>
                </label>
                <select
                  id="teacher"
                  name="teacher"
                  required
                  value={values.teacher || ''}
                  onChange={(e) => setFieldValue('teacher', e.target.value)}
                  className={`w-full px-3 py-2 border ${touched.teacher && errors.teacher ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                >
                  <option value="">Sélectionner un enseignant</option>
                  {Array.from(new Set(teachersData.map(t => t.name))).map(teacherName => (
                    <option key={teacherName} value={teacherName}>{teacherName}</option>
                  ))}
                </select>
                {touched.teacher && errors.teacher && (
                  <p className="mt-1 text-sm text-red-500">{errors.teacher}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Titre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={values.title || ''}
                onChange={(e) => setFieldValue('title', e.target.value)}
                placeholder="Titre de la séance"
                className={`w-full px-3 py-2 border ${touched.title && errors.title ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
              />
              {touched.title && errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contenu du cours <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                required
                value={values.content || ''}
                onChange={(e) => setFieldValue('content', e.target.value)}
                rows={4}
                placeholder="Description détaillée du contenu du cours..."
                className={`w-full px-3 py-2 border ${touched.content && errors.content ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
              ></textarea>
              {touched.content && errors.content && (
                <p className="mt-1 text-sm text-red-500">{errors.content}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="homework" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Travail à faire
              </label>
              <textarea
                id="homework"
                name="homework"
                value={values.homework || ''}
                onChange={(e) => setFieldValue('homework', e.target.value)}
                rows={3}
                placeholder="Devoirs à faire pour la prochaine séance..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="resources" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ressources (séparées par des virgules)
              </label>
              <input
                type="text"
                id="resources"
                name="resources"
                value={Array.isArray(values.resources) ? values.resources.join(', ') : values.resources || ''}
                onChange={(e) => setFieldValue('resources', e.target.value)}
                placeholder="Manuel p.45-47, Fiche d'exercices, Vidéo explicative..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Statut
              </label>
              <select
                id="status"
                name="status"
                value={values.status || 'planned'}
                onChange={(e) => setFieldValue('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="planned">Planifié</option>
                <option value="in-progress">En cours</option>
                <option value="completed">Terminé</option>
              </select>
            </div>
          </form>
        )}
      </FormModal>

      <TeacherAvailabilityModal
        isOpen={isTeacherAvailabilityModalOpen}
        onClose={() => setIsTeacherAvailabilityModalOpen(false)}
        onSave={handleSaveTeacherAvailability}
        teacherId={selectedItem?.id}
        teacherName={selectedItem?.name}
      />

      <TeacherScheduleModal
        isOpen={isTeacherScheduleModalOpen}
        onClose={() => setIsTeacherScheduleModalOpen(false)}
        teacher={selectedItem}
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

      <SubjectModal 
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        onSave={(subjectData) => {
          // Ici, vous pourriez sauvegarder les données de la matière
          console.log('Données de la matière:', subjectData);
          
          // Si nous sommes en mode édition, nous mettons à jour la matière existante
          // Sinon, nous ajoutons une nouvelle matière
          if (isEditMode && selectedItem) {
            // Logique pour mettre à jour une matière existante
            // Dans une application réelle, vous appelleriez une API ici
            console.log('Mise à jour de la matière existante:', selectedItem.id);
          } else {
            // Logique pour ajouter une nouvelle matière
            // Dans une application réelle, vous appelleriez une API ici
            console.log('Création d\'une nouvelle matière');
          }
          
          // Afficher un message de confirmation
          setAlertMessage({
            title: isEditMode ? 'Matière mise à jour' : 'Matière créée',
            message: isEditMode 
              ? `La matière ${subjectData.name} a été mise à jour avec succès.` 
              : `La matière ${subjectData.name} a été créée avec succès.`,
            type: 'success'
          });
          
          // Fermer le modal de matière et ouvrir le modal d'alerte
          setIsSubjectModalOpen(false);
          setIsAlertModalOpen(true);
        }}
        subjectData={selectedItem}
        isEdit={isEditMode}
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