import { Fiche } from './Fiche';

export enum ValidationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  NEEDS_REVISION = 'needs_revision'
}

export type EvaluationType = 'formative' | 'summative' | 'diagnostic';

export interface CompetenceAnalysis {
  type: string;
  present: boolean;
  score: number;
  recommendations: string[];
}

export interface ActivityAnalysis {
  id: string;
  durationValid: boolean;
  materialValid: boolean;
  phaseValid: boolean;
  recommendations: string[];
}

export interface PedagogicalAnalysis {
  coherenceScore: number;
  progressionScore: number;
  taxonomicLevel: number;
  evaluationScore: number;
  programCompliance: boolean;
  recommendations: string[];
}

export interface ValidationWorkflow {
  status: ValidationStatus;
  currentStep: string;
  history: {
    step: string;
    timestamp: Date;
    comments: string[];
  }[];
  notifications: {
    type: 'info' | 'warning' | 'error';
    message: string;
    timestamp: Date;
  }[];
}

export interface CompetenceValidation {
  ficheId: string;
  competences: CompetenceAnalysis[];
  activities: ActivityAnalysis[];
  pedagogicalAnalysis: PedagogicalAnalysis;
  workflow: ValidationWorkflow;
  score: number;
  overallStatus: ValidationStatus;
  recommendations: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CompetenceValidationResult {
  fiche: Fiche;
  validation: CompetenceValidation;
  suggestions: {
    improvements: string[];
    alternatives: string[];
    methodological: string[];
    warnings: string[];
    qualityScore: number;
  };
}
