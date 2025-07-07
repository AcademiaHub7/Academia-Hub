export interface Assessment {
  id: string;
  ficheId: string;
  date: Date;
  type: 'formative' | 'summative' | 'continuous';
  competencies: string[];
  criteria: AssessmentCriteria[];
  status: 'planned' | 'in_progress' | 'completed';
}

export interface AssessmentCriteria {
  id: string;
  description: string;
  weight: number;
  competency: string;
  rubric: AssessmentRubric;
}

export interface AssessmentRubric {
  id: string;
  levels: AssessmentLevel[];
  type: 'numeric' | 'qualitative' | 'mixed';
}

export interface AssessmentLevel {
  id: string;
  score: number;
  description: string;
  indicators: string[];
}

export interface Grade {
  id: string;
  assessmentId: string;
  studentId: string;
  scores: Record<string, number>;
  comments: string;
  date: Date;
  status: 'draft' | 'validated' | 'final';
}

export interface CompetencyProgress {
  competency: string;
  assessments: string[];
  scores: number[];
  average: number;
  trends: ProgressTrend[];
}

export interface ProgressTrend {
  period: string;
  value: number;
  direction: 'up' | 'down' | 'stable';
  comments: string;
}

export interface GradeDistribution {
  competency: string;
  criteria: string;
  scores: number[];
  average: number;
  standardDeviation: number;
  distribution: {
    min: number;
    max: number;
    quartiles: [number, number, number];
  };
}

export interface AssessmentAnalysis {
  competencyDistribution: Record<string, number>;
  criteriaCoverage: Record<string, number>;
  gradeTrends: ProgressTrend[];
  correlation: {
    competency: string;
    criteria: string;
    correlation: number;
    significance: number;
  }[];
}

export interface ExamIntegrationStatus {
  assessments: {
    planned: number;
    completed: number;
    pending: number;
  };
  grades: {
    total: number;
    validated: number;
    pending: number;
  };
  coverage: {
    competencies: number;
    criteria: number;
    rubrics: number;
  };
  warnings: string[];
}
