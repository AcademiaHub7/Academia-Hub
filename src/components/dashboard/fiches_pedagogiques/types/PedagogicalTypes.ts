export interface Objective {
  id: string;
  description: string;
  type: string;
  level: number;
  duration?: number;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  duration: number;
  phase: 'introduction' | 'development' | 'conclusion';
  materials: {
    id: string;
    name: string;
    available: boolean;
  }[];
}

export interface Evaluation {
  id: string;
  type: 'formative' | 'summative' | 'diagnostic';
  description: string;
  criteria: string[];
  weight: number;
}
