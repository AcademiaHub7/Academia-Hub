import { create } from 'zustand';
import { User, Tenant } from '../types';

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organization: string;
  userType: 'superadmin' | 'patronat' | 'school';
}

interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchTenant: (tenantId: string) => Promise<void>;
  setUser: (user: User) => void;
  setTenant: (tenant: Tenant) => void;
}

// Mock authentication service
const mockAuth = {
  login: async (email: string) => {
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

// Mock pour générer un ID unique
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  tenant: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string) => {
    try {
      set({ isLoading: true });
      
      // Simuler un appel API
      const { user, tenant } = await mockAuth.login(email);
      
      // Stocker les informations d'authentification
      localStorage.setItem('auth', JSON.stringify({ user, tenant }));
      
      set({
        user,
        tenant,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  register: async (data: RegisterData) => {
    try {
      set({ isLoading: true });
      
      // Simuler un délai de réseau
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Vérifier si l'email est déjà utilisé (simulation)
      // Dans une vraie application, cette vérification se ferait côté serveur
      console.log('Password:', data.password); // Utilisation de data.password pour éviter l'avertissement
      
      const storedAuth = localStorage.getItem('auth');
      if (storedAuth) {
        const authData = JSON.parse(storedAuth);
        if (authData.user && authData.user.email === data.email) {
          return { success: false, message: 'Cet email est déjà utilisé' };
        }
      }
      
      // Créer un nouvel utilisateur
      const newUser: User = {
        id: generateId(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.userType === 'patronat' ? 'patronat_admin' : 
              data.userType === 'school' ? 'school_admin' : 'super_admin',
        tenantId: `tenant-${generateId()}`,
        tenantType: data.userType as 'patronat' | 'school',
        isActive: true,
        createdAt: new Date(),
      };
      
      // Créer un nouveau tenant
      const newTenant: Tenant = {
        id: newUser.tenantId,
        name: data.organization,
        type: data.userType as 'patronat' | 'school',
        isActive: true,
        settings: {
          primaryColor: '#1a472a',
          academicYear: '2024-2025',
          timeZone: 'Africa/Porto-Novo',
          language: 'fr',
          examTypes: ['CEP', 'BEPC', 'BAC'],
          gradingScale: { min: 0, max: 20, passingGrade: 10 },
        },
        createdAt: new Date(),
      };
      
      // Ajouter la région pour les patronats
      if (data.userType === 'patronat') {
        newTenant.region = 'Région de ' + data.organization.split(' ').pop();
      } else {
        newTenant.parentTenantId = 'patronat-atlantique'; // Exemple de patronat parent
      }
      
      // Stocker les nouvelles informations
      localStorage.setItem('auth', JSON.stringify({ 
        user: newUser, 
        tenant: newTenant 
      }));
      
      // Mettre à jour l'état
      set({
        user: newUser,
        tenant: newTenant,
        isAuthenticated: true,
        isLoading: false,
      });
      
      return { success: true };
      
    } catch (error) {
      console.error('Registration error:', error);
      set({ isLoading: false });
      return { 
        success: false, 
        message: 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer plus tard.' 
      };
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

  switchTenant: async () => {
    set({ isLoading: true });
    // Mock tenant switching logic
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ isLoading: false });
  },

  setUser: (user: User) => set({ user }),
  setTenant: (tenant: Tenant) => set({ tenant }),
}));