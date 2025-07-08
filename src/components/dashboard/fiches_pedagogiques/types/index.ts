// Types pour les fiches pédagogiques
export type FicheStatus = 'draft' | 'pending' | 'validated' | 'rejected';
export type FicheViewMode = 'list' | 'grid' | 'detail';

export interface Fiche {
  id: string;
  title: string;
  subject: string;
  class: string;
  level: string;
  duration: number;
  date: Date;
  description: string;
  objectives: string[];
  activities: Array<{
    title: string;
    description: string;
    duration: number;
  }>;
  resources: string[];
  status: FicheStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  validatedBy?: string;
  validatedAt?: Date;
  comments?: Comment[];
  isFavorite?: boolean;
  isRecent?: boolean;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
  isRead: boolean;
}

export interface Resource {
  type: string;
  url: string;
  description: string;
}

// Types pour les filtres
export interface FicheFilters {
  subject: string;
  class: string;
  status: string;
  period: string;
  search: string;
  favorite: boolean;
  recent: boolean;
}

// Types pour les statistiques
export interface FicheStats {
  created: number;
  validated: number;
  pending: number;
  rejected: number;
  bySubject: Record<string, number>;
  byClass: Record<string, number>;
  byMonth: Record<string, number>;
}

// Types pour les notifications
export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  date: Date;
  read: boolean;
  link?: string;
  relatedFicheId?: string;
}

// Types pour les options de sélection
export interface SelectOption {
  value: string;
  label: string;
}

// Types pour la sécurité
export interface SecurityContext {
  permissions: {
    canRead: boolean;
    canWrite: boolean;
    canValidate: boolean;
    canDelete: boolean;
  };
  user: {
    id: string;
    name: string;
    role: string;
  };
}

// Types pour les notifications
export interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  date: Date;
  read: boolean;
  link?: string;
  relatedFicheId?: string;
}

export const SUBJECTS: SelectOption[] = [
  { value: 'math', label: 'Mathématiques' },
  { value: 'french', label: 'Français' },
  { value: 'history', label: 'Histoire-Géographie' },
  { value: 'physics', label: 'Physique-Chimie' },
  { value: 'biology', label: 'SVT' },
  { value: 'english', label: 'Anglais' },
  { value: 'spanish', label: 'Espagnol' },
  { value: 'german', label: 'Allemand' },
  { value: 'art', label: 'Arts Plastiques' },
  { value: 'music', label: 'Éducation Musicale' },
  { value: 'sport', label: 'EPS' },
  { value: 'technology', label: 'Technologie' }
];

export const CLASS_LEVELS: SelectOption[] = [
  { value: '6', label: '6ème' },
  { value: '5', label: '5ème' },
  { value: '4', label: '4ème' },
  { value: '3', label: '3ème' },
  { value: '2', label: '2nde' },
  { value: '1', label: '1ère' },
  { value: 'T', label: 'Terminale' }
];

export const STATUS_OPTIONS: SelectOption[] = [
  { value: 'draft', label: 'Brouillon' },
  { value: 'pending', label: 'En attente' },
  { value: 'validated', label: 'Validée' },
  { value: 'rejected', label: 'Rejetée' }
];

export const PERIOD_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Toute l\'année' },
  { value: 'current', label: 'Trimestre en cours' },
  { value: 'next', label: 'Prochain trimestre' },
  { value: 'custom', label: 'Période personnalisée' }
];
