export interface JournalEntry {
  id: string;
  date: Date;
  ficheId: string;
  content: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  modifications: JournalModification[];
}

export interface JournalModification {
  timestamp: Date;
  field: string;
  oldValue: string;
  newValue: string;
  reason: string;
}

export interface TextbookEntry {
  id: string;
  ficheId: string;
  date: Date;
  content: string;
  realization: {
    planned: string[];
    completed: string[];
    pending: string[];
  };
  progression: {
    current: number;
    target: number;
  };
  modifications: TextbookModification[];
}

export interface TextbookModification {
  timestamp: Date;
  field: string;
  oldValue: string;
  newValue: string;
  reason: string;
}

export interface ScheduleEntry {
  id: string;
  ficheId: string;
  slotId: string;
  date: Date;
  startTime: string;
  endTime: string;
  room: string;
  teacher: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  constraints: ScheduleConstraint[];
}

export interface ScheduleConstraint {
  type: 'time' | 'room' | 'teacher' | 'student';
  value: string;
  priority: number;
}

export interface IntegrationStatus {
  journal: {
    lastSync: Date;
    status: 'synced' | 'pending' | 'error';
    error?: string;
  };
  textbook: {
    lastSync: Date;
    status: 'synced' | 'pending' | 'error';
    error?: string;
  };
  schedule: {
    lastSync: Date;
    status: 'synced' | 'pending' | 'error';
    error?: string;
  };
}

export interface IntegrationAlert {
  type: 'divergence' | 'constraint' | 'modification';
  severity: 'warning' | 'error';
  message: string;
  details: any;
  timestamp: Date;
}
