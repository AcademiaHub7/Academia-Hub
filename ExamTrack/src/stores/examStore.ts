import { create } from 'zustand';
import { Exam, ExamType, ExamStatus, Grade, ExamResult } from '../types';

interface ExamState {
  exams: Exam[];
  currentExam: Exam | null;
  grades: Grade[];
  results: ExamResult[];
  isLoading: boolean;
  
  // Actions
  fetchExams: (tenantId: string) => Promise<void>;
  createExam: (examData: Partial<Exam>) => Promise<void>;
  updateExam: (examId: string, updates: Partial<Exam>) => Promise<void>;
  deleteExam: (examId: string) => Promise<void>;
  setCurrentExam: (exam: Exam | null) => void;
  
  // Grade management
  fetchGrades: (examId: string) => Promise<void>;
  saveGrades: (examId: string, grades: Grade[]) => Promise<void>;
  validateGrades: (examId: string) => Promise<void>;
  
  // Results
  calculateResults: (examId: string) => Promise<void>;
  publishResults: (examId: string) => Promise<void>;
}

// Mock exam data
const mockExams: Exam[] = [
  {
    id: '1',
    name: 'Composition du 1er Trimestre',
    type: 'Composition',
    academicYear: '2024-2025',
    term: 1,
    tenantId: 'ecole-sainte-marie',
    tenantType: 'school',
    schoolId: 'ecole-sainte-marie',
    status: 'completed',
    startDate: new Date('2024-10-15'),
    endDate: new Date('2024-10-25'),
    subjects: [
      {
        code: 'MATH',
        name: 'Mathématiques',
        coefficient: 4,
        duration: '2h00',
        evaluationType: 'Écrit',
      },
      {
        code: 'FR',
        name: 'Français',
        coefficient: 4,
        duration: '2h00',
        evaluationType: 'Écrit',
      },
      {
        code: 'ANG',
        name: 'Anglais',
        coefficient: 2,
        duration: '1h30',
        evaluationType: 'Écrit',
      },
    ],
    targetClasses: ['6ème A', '6ème B'],
    settings: {
      requirePatronatApproval: false,
      publishResultsAutomatically: false,
      allowMakeup: true,
      gradingScale: { min: 0, max: 20 },
      passingGrade: 10,
    },
    createdBy: '3',
    createdAt: new Date('2024-10-01'),
  },
  {
    id: '2',
    name: 'Examen Blanc BEPC',
    type: 'Examen Blanc',
    academicYear: '2024-2025',
    term: 1,
    tenantId: 'patronat-atlantique',
    tenantType: 'patronat',
    status: 'scheduled',
    startDate: new Date('2024-12-02'),
    endDate: new Date('2024-12-05'),
    subjects: [
      {
        code: 'MATH',
        name: 'Mathématiques',
        coefficient: 4,
        duration: '3h00',
        evaluationType: 'Écrit',
      },
      {
        code: 'FR',
        name: 'Français',
        coefficient: 4,
        duration: '3h00',
        evaluationType: 'Écrit',
      },
      {
        code: 'ANG',
        name: 'Anglais',
        coefficient: 2,
        duration: '2h00',
        evaluationType: 'Écrit',
      },
      {
        code: 'SVT',
        name: 'Sciences de la Vie et de la Terre',
        coefficient: 3,
        duration: '2h30',
        evaluationType: 'Écrit',
      },
    ],
    targetClasses: ['3ème'],
    settings: {
      requirePatronatApproval: true,
      publishResultsAutomatically: false,
      allowMakeup: false,
      gradingScale: { min: 0, max: 20 },
      passingGrade: 10,
    },
    createdBy: '2',
    createdAt: new Date('2024-10-20'),
  },
];

export const useExamStore = create<ExamState>((set, get) => ({
  exams: mockExams,
  currentExam: null,
  grades: [],
  results: [],
  isLoading: false,

  fetchExams: async (tenantId: string) => {
    set({ isLoading: true });
    try {
      // Mock API call - filter exams by tenant
      const filteredExams = mockExams.filter(exam => 
        exam.tenantId === tenantId || 
        (exam.tenantType === 'patronat' && exam.tenantId.includes('patronat'))
      );
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ exams: filteredExams, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createExam: async (examData: Partial<Exam>) => {
    set({ isLoading: true });
    try {
      const newExam: Exam = {
        id: Date.now().toString(),
        name: examData.name || '',
        type: examData.type || 'Contrôle Continu',
        academicYear: examData.academicYear || '2024-2025',
        term: examData.term || 1,
        tenantId: examData.tenantId || '',
        tenantType: examData.tenantType || 'school',
        schoolId: examData.schoolId,
        status: 'draft',
        startDate: examData.startDate || new Date(),
        endDate: examData.endDate || new Date(),
        subjects: examData.subjects || [],
        targetClasses: examData.targetClasses || [],
        settings: examData.settings || {
          requirePatronatApproval: false,
          publishResultsAutomatically: false,
          allowMakeup: true,
          gradingScale: { min: 0, max: 20 },
          passingGrade: 10,
        },
        createdBy: examData.createdBy || '',
        createdAt: new Date(),
      };

      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        exams: [...state.exams, newExam],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateExam: async (examId: string, updates: Partial<Exam>) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        exams: state.exams.map(exam =>
          exam.id === examId ? { ...exam, ...updates } : exam
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteExam: async (examId: string) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        exams: state.exams.filter(exam => exam.id !== examId),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  setCurrentExam: (exam: Exam | null) => {
    set({ currentExam: exam });
  },

  fetchGrades: async (examId: string) => {
    set({ isLoading: true });
    try {
      // Mock grades data
      const mockGrades: Grade[] = [];
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ grades: mockGrades, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  saveGrades: async (examId: string, grades: Grade[]) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ grades, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  validateGrades: async (examId: string) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Update exam status to completed
      set(state => ({
        exams: state.exams.map(exam =>
          exam.id === examId ? { ...exam, status: 'completed' as ExamStatus } : exam
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  calculateResults: async (examId: string) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Mock calculation results
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  publishResults: async (examId: string) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set(state => ({
        exams: state.exams.map(exam =>
          exam.id === examId ? { ...exam, status: 'results_published' as ExamStatus } : exam
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));