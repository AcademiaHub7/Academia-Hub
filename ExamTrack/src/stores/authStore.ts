import { create } from 'zustand';
import { User, Tenant } from '../types';

interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchTenant: (tenantId: string) => Promise<void>;
  setUser: (user: User) => void;
  setTenant: (tenant: Tenant) => void;
}

// Mock authentication service
const mockAuth = {
  login: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock different user types
    if (email.includes('superadmin')) {
      return {
        user: {
          id: '1',
          email,
          firstName: 'Admin',
          lastName: 'Sistema',
          role: 'super_admin' as const,
          tenantId: 'system',
          tenantType: 'patronat' as const,
          isActive: true,
          createdAt: new Date(),
        },
        tenant: {
          id: 'system',
          name: 'Academia Hub System',
          type: 'patronat' as const,
          isActive: true,
          settings: {
            primaryColor: '#1a472a',
            academicYear: '2024-2025',
            timeZone: 'Africa/Porto-Novo',
            language: 'fr' as const,
            examTypes: ['CEP', 'BEPC', 'BAC'],
            gradingScale: { min: 0, max: 20, passingGrade: 10 },
          },
          createdAt: new Date(),
        },
      };
    } else if (email.includes('patronat') || email.includes('atlantique')) {
      return {
        user: {
          id: '2',
          email,
          firstName: 'Directeur',
          lastName: 'Patronat',
          role: 'patronat_admin' as const,
          tenantId: 'patronat-atlantique',
          tenantType: 'patronat' as const,
          isActive: true,
          createdAt: new Date(),
        },
        tenant: {
          id: 'patronat-atlantique',
          name: 'Patronat de l\'Atlantique',
          type: 'patronat' as const,
          region: 'Atlantique',
          isActive: true,
          settings: {
            primaryColor: '#1a472a',
            academicYear: '2024-2025',
            timeZone: 'Africa/Porto-Novo',
            language: 'fr' as const,
            examTypes: ['CEP', 'BEPC', 'BAC', 'Contrôle Continu'],
            gradingScale: { min: 0, max: 20, passingGrade: 10 },
          },
          createdAt: new Date(),
        },
      };
    } else {
      return {
        user: {
          id: '3',
          email,
          firstName: 'Directeur',
          lastName: 'École',
          role: 'school_admin' as const,
          tenantId: 'ecole-sainte-marie',
          tenantType: 'school' as const,
          isActive: true,
          createdAt: new Date(),
        },
        tenant: {
          id: 'ecole-sainte-marie',
          name: 'École Sainte Marie',
          type: 'school' as const,
          parentTenantId: 'patronat-atlantique',
          isActive: true,
          settings: {
            primaryColor: '#1a472a',
            academicYear: '2024-2025',
            timeZone: 'Africa/Porto-Novo',
            language: 'fr' as const,
            examTypes: ['Contrôle Continu', 'Composition', 'Examen Blanc'],
            gradingScale: { min: 0, max: 20, passingGrade: 10 },
          },
          createdAt: new Date(),
        },
      };
    }
  },
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  tenant: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { user, tenant } = await mockAuth.login(email, password);
      set({
        user,
        tenant,
        isAuthenticated: true,
        isLoading: false,
      });
      
      // Ne pas faire de redirection automatique ici
      // Laisser React Router gérer la navigation
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    set({
      user: null,
      tenant: null,
      isAuthenticated: false,
    });
    // Redirection vers la page d'accueil après déconnexion
    window.location.href = '/';
  },

  switchTenant: async (tenantId: string) => {
    set({ isLoading: true });
    // Mock tenant switching logic
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ isLoading: false });
  },

  setUser: (user: User) => set({ user }),
  setTenant: (tenant: Tenant) => set({ tenant }),
}));