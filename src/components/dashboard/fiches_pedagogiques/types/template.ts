export interface TemplateSection {
  id: string;
  title: string;
  description?: string;
  required: boolean;
  content: string;
  order: number;
}

export interface TemplateStep {
  id: string;
  title: string;
  description?: string;
  duration?: number; // in minutes
  order: number;
  sections: TemplateSection[];
}

export interface TemplateTableColumn {
  id: string;
  label: string;
  width: string;
  required: boolean;
}

export interface TemplateTableRow {
  id: string;
  number: string;
  instruction: string;
  expectedResult: string;
}

export interface TemplateTable {
  columns: TemplateTableColumn[];
  rows: TemplateTableRow[];
}

export interface TemplateHeader {
  saNumber: string;
  sequenceNumber: string;
  date: string;
  course: string;
  duration: number; // in minutes
  title: string;
}

export interface TemplateValidation {
  isAPCCompliant: boolean;
  requiredPhases: boolean;
  skillsValidated: boolean;
  pedagogicalCoherence: boolean;
  validatedBy?: string;
  validatedAt?: string;
  comments?: string;
}

export interface TemplateMetadata {
  id: string;
  name: string;
  subject: string;
  description: string;
  version: string;
  isDefault: boolean;
  isShared: boolean;
  schoolId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface Template extends TemplateMetadata {
  header: TemplateHeader;
  planningSections: TemplateSection[];
  procedureTable: TemplateTable;
  steps: TemplateStep[];
  validation?: TemplateValidation;
  variables: Record<string, {
    type: 'text' | 'number' | 'date' | 'select' | 'checkbox';
    label: string;
    required: boolean;
    options?: string[];
    defaultValue?: any;
  }>;
}

// Template subjects
export const TEMPLATE_SUBJECTS = [
  'Mathématiques',
  'Français',
  'Sciences',
  'Histoire-Géographie',
  'EPS',
  'Arts',
  'Anglais',
  'Autre'
] as const;

export type TemplateSubject = typeof TEMPLATE_SUBJECTS[number];

// Default templates for each subject
export const DEFAULT_TEMPLATES: Record<TemplateSubject, Omit<Template, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'version'>> = {
  'Mathématiques': {
    name: 'Résolution de problèmes',
    subject: 'Mathématiques',
    description: 'Template pour les fiches de résolution de problèmes mathématiques',
    isDefault: true,
    isShared: true,
    tags: ['maths', 'problème', 'résolution'],
    header: {
      saNumber: '',
      sequenceNumber: '',
      date: new Date().toISOString().split('T')[0],
      course: 'Mathématiques',
      duration: 60,
      title: 'Résolution de problème',
    },
    planningSections: [
      {
        id: 'objectifs',
        title: 'Objectifs d\'apprentissage',
        required: true,
        content: '',
        order: 1
      },
      // ... autres sections
    ],
    procedureTable: {
      columns: [
        { id: 'number', label: 'N°', width: '10%', required: true },
        { id: 'instruction', label: 'Consigne', width: '60%', required: true },
        { id: 'expected', label: 'Résultats attendus', width: '30%', required: true },
      ],
      rows: [
        {
          id: '1',
          number: '1',
          instruction: 'Présentation du problème',
          expectedResult: 'Les élèves comprennent le problème posé',
        },
        // ... autres lignes
      ]
    },
    steps: [
      {
        id: 'introduction',
        title: 'Introduction',
        order: 1,
        sections: [
          {
            id: 'mise-en-situation',
            title: 'Mise en situation',
            required: true,
            content: '',
            order: 1
          }
        ]
      },
      // ... autres étapes
    ],
    variables: {
      niveau: {
        type: 'select',
        label: 'Niveau de difficulté',
        required: true,
        options: ['Facile', 'Moyen', 'Difficile'],
        defaultValue: 'Moyen'
      },
      // ... autres variables
    }
  },
  // Templates pour les autres matières avec leurs structures spécifiques
  'Français': { /* ... */ },
  'Sciences': { /* ... */ },
  'Histoire-Géographie': { /* ... */ },
  'EPS': { /* ... */ },
  'Arts': { /* ... */ },
  'Anglais': { /* ... */ },
  'Autre': { /* ... */ }
};

export interface TemplateVersion {
  version: string;
  createdAt: string;
  createdBy: string;
  changes: string;
  template: Template;
}

export interface TemplateSharing {
  sharedWith: string[]; // user IDs
  sharedBy: string;
  sharedAt: string;
  canEdit: boolean;
}

export interface TemplateComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  replies: TemplateComment[];
}

export interface TemplateUsageStats {
  timesUsed: number;
  lastUsed?: string;
  averageRating?: number;
  userRatings: Record<string, number>; // userId -> rating (1-5)
  feedback: string[];
}

export interface TemplateWithStats extends Template {
  stats: TemplateUsageStats;
  versions: TemplateVersion[];
  sharing: TemplateSharing;
  comments: TemplateComment[];
}
