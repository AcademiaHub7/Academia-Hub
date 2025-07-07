import { Fiche } from '../../types/Fiche';
import { Comment } from '../../types/Comment';
import { CorrectionCode } from '../../types/CorrectionCode';
import { ValidationHistory } from '../../types/ValidationHistory';
import { Annotation } from '../../types/Annotation';
import { Recommendation } from '../../types/Recommendation';
import { ValidationStatistics } from '../../types/ValidationStatistics';

export interface DirectorValidationState {
  pendingFiches: Fiche[];
  activeFicheId: string | null;
  annotations: Record<string, Annotation[]>;
  comments: Record<string, Comment[]>;
  recommendations: Record<string, Recommendation[]>;
  history: ValidationHistory[];
  statistics: ValidationStatistics;
  correctionCodes: CorrectionCode[];
}

export interface Annotation {
  id: string;
  sectionId: string;
  content: string;
  type: 'highlight' | 'comment' | 'suggestion';
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: Date;
  author: string;
}

export interface Comment {
  id: string;
  sectionId: string;
  content: string;
  type: 'standard' | 'preset';
  tags: string[];
  timestamp: Date;
  author: string;
}

export interface Recommendation {
  id: string;
  sectionId: string;
  content: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: Date;
  author: string;
}

export interface ValidationHistory {
  ficheId: string;
  version: number;
  timestamp: Date;
  changes: Record<string, string[]>;
  status: 'pending' | 'validated' | 'rejected';
  comments: Comment[];
}

export interface ValidationStatistics {
  totalPending: number;
  totalValidated: number;
  averageTurnaround: number;
  byTeacher: Record<string, {
    pending: number;
    validated: number;
    averageTime: number;
  }>;
}

export interface PresetComment {
  id: string;
  category: string;
  content: string;
  tags: string[];
  usageCount: number;
}

export interface CorrectionCode {
  id: string;
  category: string;
  description: string;
  examples: string[];
  suggestions: string[];
}
