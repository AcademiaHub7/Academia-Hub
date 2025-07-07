export interface JournalObjective {
  id: string;
  title: string;
  description: string;
  competencies: string[];
  evaluationCriteria?: string[];
  completed?: boolean;
}

export interface JournalStep {
  id: string;
  title: string;
  duration: number; // in minutes
  description: string;
  resources?: string[];
  grouping?: 'individual' | 'pairs' | 'small_groups' | 'whole_class';
  teacherRole?: string;
  studentRole?: string;
  completed?: boolean;
}

export interface JournalEntry {
  id: string;
  title: string;
  date: string;
  subject: string;
  class: string;
  duration: number; // in minutes
  status: 'planned' | 'in_progress' | 'completed' | 'postponed';
  objectives: JournalObjective[];
  steps: JournalStep[];
  description?: string;
  materials?: string;
  notes?: string;
  resources?: string[];
  prerequisites?: string[];
  differentiation?: string;
  observations?: string;
  evaluation?: {
    type: 'formative' | 'summative';
    method: string;
    criteria: string[];
  };
  createdAt: string;
  updatedAt: string;
  offline?: boolean;
  lastSyncedAt?: string;
  // Champs pour la comparaison prévu/réalisé
  actualDuration?: number; // Durée réelle de la séance en minutes
  completionRate?: number; // Taux de complétion de 0 à 100
  progressStatus?: 'not_started' | 'behind' | 'on_track' | 'ahead' | 'completed';
  feedback?: string; // Retour sur la séance après réalisation
  // Alerte pour séance non préparée
  preparationStatus?: 'not_started' | 'in_progress' | 'ready';
  preparationAlert?: boolean; // Indique si une alerte doit être affichée
  lastAutoSave?: string; // Timestamp de la dernière sauvegarde automatique
}

export interface JournalTemplate {
  id: string;
  title: string;
  subject: string;
  level: string;
  duration: number;
  objectives: JournalObjective[];
  steps: JournalStep[];
  description?: string;
  materials?: string;
  notes?: string;
  resources?: string[];
  evaluation?: {
    type: 'formative' | 'summative';
    method: string;
    criteria: string[];
  };
}

export interface JournalFilter {
  class: string;
  subject: string;
  period: 'all' | 'today' | 'week' | 'month' | 'future' | 'past' | 'unplanned';
  status?: 'planned' | 'in_progress' | 'completed' | 'postponed';
  preparationStatus?: 'not_started' | 'in_progress' | 'ready';
  progressStatus?: 'not_started' | 'behind' | 'on_track' | 'ahead' | 'completed';
  search?: string;
}
