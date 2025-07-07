export interface FicheStats {
  total: number;
  byTeacher: Record<string, number>;
  bySubject: Record<string, number>;
  byLevel: Record<string, number>;
  byStatus: Record<string, number>;
  averageValidationTime: number;
  averageScore: number;
}

export interface PedagogicalAnalysis {
  competenceDistribution: {
    cognitive: number;
    procedural: number;
    attitudinal: number;
  };
  teachingStrategies: {
    direct: number;
    collaborative: number;
    inquiry: number;
    project: number;
  };
  evaluationMethods: {
    formative: number;
    summative: number;
    self: number;
    peer: number;
  };
  progressionQuality: number;
  gaps: string[];
}

export interface AdministrativeReport {
  preparationRate: number;
  programCompliance: number;
  averagePedagogicalQuality: number;
  trainingNeeds: string[];
  practiceEvaluation: {
    strengths: string[];
    areasForImprovement: string[];
  };
}

export interface ExportOptions {
  type: 'annual' | 'titularization' | 'portfolio' | 'yearly' | 'inspection';
  teacherId?: string;
  academicYear?: string;
  subject?: string;
  includeDetails: boolean;
  format: 'pdf' | 'docx' | 'html';
}

export interface ReportData {
  teacherInfo: {
    name: string;
    subject: string;
    experience: number;
  };
  ficheStats: FicheStats;
  pedagogicalAnalysis: PedagogicalAnalysis;
  administrativeReport: AdministrativeReport;
  detailedFiches?: any[];
  recommendations: string[];
}

export enum ReportStatus {
  PENDING = 'pending',
  GENERATING = 'generating',
  READY = 'ready',
  ERROR = 'error'
}

export interface ReportProgress {
  status: ReportStatus;
  progress: number;
  message?: string;
}
