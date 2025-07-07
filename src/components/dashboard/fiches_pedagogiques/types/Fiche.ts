export interface Objective {
  id: string;
  description: string;
  verbs: string[];
}

export interface Competence {
  id: string;
  type: string;
  description: string;
}

export interface Activity {
  id: string;
  description: string;
  duration: number;
  phase: number;
  materials: Material[];
}

export interface Material {
  id: string;
  name: string;
  available: boolean;
}

export interface Evaluation {
  id: string;
  type: string;
  description: string;
}

export interface Fiche {
  id: string;
  title: string;
  level: 'primary' | 'secondary' | 'higher';
  competences: Competence[];
  objectives: Objective[];
  activities: Activity[];
  evaluations: Evaluation[];
  programId: string;
  createdAt: Date;
  updatedAt: Date;
}
