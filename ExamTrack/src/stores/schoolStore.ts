import { create } from 'zustand';
import { School } from '../types';

interface SchoolState {
  schools: School[];
  currentSchool: School | null;
  isLoading: boolean;
  
  fetchSchools: (patronatId: string) => Promise<void>;
  createSchool: (schoolData: Partial<School>) => Promise<void>;
  updateSchool: (schoolId: string, updates: Partial<School>) => Promise<void>;
  deleteSchool: (schoolId: string) => Promise<void>;
  setCurrentSchool: (school: School | null) => void;
  generateCredentials: (schoolId: string) => Promise<{ username: string; password: string }>;
}

// Mock schools data
const mockSchools: School[] = [
  {
    id: 'ecole-sainte-marie',
    name: 'École Sainte Marie',
    code: 'ESM001',
    patronatId: 'patronat-atlantique',
    address: 'Cotonou, Quartier Akpakpa',
    phone: '+229 21 30 45 67',
    email: 'contact@sainte-marie.edu.bj',
    directorName: 'M. ADJOVI Paul',
    studentCapacity: 800,
    currentStudents: 652,
    isActive: true,
    credentials: {
      username: 'esm001',
      password: 'ESM2024!secure',
    },
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'college-notre-dame',
    name: 'Collège Notre Dame',
    code: 'CND002',
    patronatId: 'patronat-atlantique',
    address: 'Cotonou, Quartier Cadjehoun',
    phone: '+229 21 31 28 94',
    email: 'direction@notre-dame.edu.bj',
    directorName: 'Mme HOUNKPATIN Sylvie',
    studentCapacity: 600,
    currentStudents: 543,
    isActive: true,
    credentials: {
      username: 'cnd002',
      password: 'CND2024!secure',
    },
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'lycee-saint-joseph',
    name: 'Lycée Saint Joseph',
    code: 'LSJ003',
    patronatId: 'patronat-atlantique',
    address: 'Abomey-Calavi, Centre-ville',
    phone: '+229 21 36 42 15',
    email: 'admin@saint-joseph.edu.bj',
    directorName: 'Père TOSSOU Michel',
    studentCapacity: 1200,
    currentStudents: 1089,
    isActive: true,
    credentials: {
      username: 'lsj003',
      password: 'LSJ2024!secure',
    },
    createdAt: new Date('2024-02-01'),
  },
];

export const useSchoolStore = create<SchoolState>((set, get) => ({
  schools: mockSchools,
  currentSchool: null,
  isLoading: false,

  fetchSchools: async (patronatId: string) => {
    set({ isLoading: true });
    try {
      // Filter schools by patronat
      const filteredSchools = mockSchools.filter(
        school => school.patronatId === patronatId
      );
      
      await new Promise(resolve => setTimeout(resolve, 800));
      set({ schools: filteredSchools, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createSchool: async (schoolData: Partial<School>) => {
    set({ isLoading: true });
    try {
      const newSchool: School = {
        id: `school-${Date.now()}`,
        name: schoolData.name || '',
        code: schoolData.code || `SCH${Date.now().toString().slice(-3)}`,
        patronatId: schoolData.patronatId || '',
        address: schoolData.address || '',
        phone: schoolData.phone,
        email: schoolData.email,
        directorName: schoolData.directorName || '',
        studentCapacity: schoolData.studentCapacity || 0,
        currentStudents: 0,
        isActive: true,
        credentials: {
          username: schoolData.code?.toLowerCase() || `sch${Date.now()}`,
          password: `${schoolData.code || 'SCH'}2024!secure`,
        },
        createdAt: new Date(),
      };

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set(state => ({
        schools: [...state.schools, newSchool],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateSchool: async (schoolId: string, updates: Partial<School>) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        schools: state.schools.map(school =>
          school.id === schoolId ? { ...school, ...updates } : school
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteSchool: async (schoolId: string) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        schools: state.schools.filter(school => school.id !== schoolId),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  setCurrentSchool: (school: School | null) => {
    set({ currentSchool: school });
  },

  generateCredentials: async (schoolId: string) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const credentials = {
        username: `sch${Date.now().toString().slice(-6)}`,
        password: `SCH${Math.random().toString(36).substring(2, 8).toUpperCase()}2024!`,
      };

      set(state => ({
        schools: state.schools.map(school =>
          school.id === schoolId 
            ? { ...school, credentials }
            : school
        ),
        isLoading: false,
      }));

      return credentials;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));