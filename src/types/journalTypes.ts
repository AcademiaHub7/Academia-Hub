export interface LessonObjective {
  id: string;
  description: string;
  competency: string;
  domain: string;
}

export interface LessonStep {
  id: string;
  order: number;
  duration: number;
  description: string;
  materials: string[];
  grouping: 'individual' | 'pairs' | 'small_groups' | 'whole_class';
}

export interface JournalEntry {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  class: string;
  subject: string;
  title: string;
  objectives: LessonObjective[];
  steps: LessonStep[];
  materials: string[];
  evaluation: {
    type: 'formative' | 'summative' | 'diagnostic';
    description: string;
    criteria: string[];
  };
  observations: string;
  status: 'planned' | 'in_progress' | 'completed' | 'postponed';
  lastModified: string;
  isSync: boolean;
}

export type JournalViewMode = 'week' | 'month';
