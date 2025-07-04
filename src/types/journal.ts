export interface JournalObjective {
  id: string;
  title: string;
  description: string;
  competencies: string[];
  evaluationCriteria?: string[];
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
}

export interface JournalTemplate {
  id: string;
  title: string;
  subject: string;
  level: string;
  duration: number;
  objectives: JournalObjective[];
  steps: JournalStep[];
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
  period: 'all' | 'today' | 'week' | 'month';
  status?: 'planned' | 'in_progress' | 'completed' | 'postponed';
}
