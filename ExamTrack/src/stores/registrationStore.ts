import { create } from 'zustand';
import { PatronatRegistration, SubscriptionPlan, Payment, RegistrationStatus } from '../types';

interface RegistrationState {
  currentRegistration: PatronatRegistration | null;
  subscriptionPlans: SubscriptionPlan[];
  payments: Payment[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  startRegistration: (personalInfo: any) => Promise<void>;
  updateOrganizationInfo: (organizationInfo: any) => Promise<void>;
  selectPlan: (planId: string, billingCycle: string) => Promise<void>;
  processPayment: (paymentData: any) => Promise<{ success: boolean; paymentUrl?: string }>;
  fetchSubscriptionPlans: () => Promise<void>;
  checkRegistrationStatus: (registrationId: string) => Promise<void>;
}

// Mock subscription plans
const mockPlans: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Parfait pour les petits patronats régionaux',
    price: 25000,
    currency: 'XOF',
    duration: 'monthly',
    maxSchools: 5,
    maxStudents: 1000,
    features: [
      { id: '1', name: 'Gestion de 5 écoles maximum', description: '', included: true },
      { id: '2', name: 'Jusqu\'à 1000 élèves', description: '', included: true },
      { id: '3', name: 'Examens illimités', description: '', included: true },
      { id: '4', name: 'Support par email', description: '', included: true },
      { id: '5', name: 'Rapports de base', description: '', included: true },
      { id: '6', name: 'Analytics avancés', description: '', included: false },
      { id: '7', name: 'Support prioritaire', description: '', included: false },
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Idéal pour les patronats de taille moyenne',
    price: 45000,
    currency: 'XOF',
    duration: 'monthly',
    maxSchools: 15,
    maxStudents: 5000,
    isPopular: true,
    features: [
      { id: '1', name: 'Gestion de 15 écoles maximum', description: '', included: true },
      { id: '2', name: 'Jusqu\'à 5000 élèves', description: '', included: true },
      { id: '3', name: 'Examens illimités', description: '', included: true },
      { id: '4', name: 'Support par email et téléphone', description: '', included: true },
      { id: '5', name: 'Rapports avancés', description: '', included: true },
      { id: '6', name: 'Analytics avancés', description: '', included: true },
      { id: '7', name: 'Formation en ligne', description: '', included: true },
      { id: '8', name: 'Support prioritaire', description: '', included: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Pour les grands patronats régionaux',
    price: 75000,
    currency: 'XOF',
    duration: 'monthly',
    maxSchools: -1, // Illimité
    maxStudents: -1, // Illimité
    features: [
      { id: '1', name: 'Écoles illimitées', description: '', included: true },
      { id: '2', name: 'Élèves illimités', description: '', included: true },
      { id: '3', name: 'Examens illimités', description: '', included: true },
      { id: '4', name: 'Support 24/7', description: '', included: true },
      { id: '5', name: 'Rapports personnalisés', description: '', included: true },
      { id: '6', name: 'Analytics avancés', description: '', included: true },
      { id: '7', name: 'Formation dédiée', description: '', included: true },
      { id: '8', name: 'Support prioritaire', description: '', included: true },
      { id: '9', name: 'API personnalisée', description: '', included: true },
    ],
  },
];

export const useRegistrationStore = create<RegistrationState>((set, get) => ({
  currentRegistration: null,
  subscriptionPlans: mockPlans,
  payments: [],
  isLoading: false,
  error: null,

  startRegistration: async (personalInfo: any) => {
    set({ isLoading: true, error: null });
    try {
      const registration: PatronatRegistration = {
        id: `reg_${Date.now()}`,
        personalInfo,
        organizationInfo: {
          name: '',
          region: '',
          address: '',
          registrationNumber: '',
          taxNumber: '',
        },
        planSelection: {
          planId: '',
          billingCycle: 'monthly',
        },
        status: 'organization_info',
        createdAt: new Date(),
      };

      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ currentRegistration: registration, isLoading: false });
    } catch (error) {
      set({ error: 'Erreur lors de l\'initialisation de l\'inscription', isLoading: false });
    }
  },

  updateOrganizationInfo: async (organizationInfo: any) => {
    set({ isLoading: true, error: null });
    try {
      const { currentRegistration } = get();
      if (!currentRegistration) throw new Error('Aucune inscription en cours');

      const updatedRegistration = {
        ...currentRegistration,
        organizationInfo,
        status: 'plan_selection' as RegistrationStatus,
      };

      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ currentRegistration: updatedRegistration, isLoading: false });
    } catch (error) {
      set({ error: 'Erreur lors de la mise à jour des informations', isLoading: false });
    }
  },

  selectPlan: async (planId: string, billingCycle: string) => {
    set({ isLoading: true, error: null });
    try {
      const { currentRegistration } = get();
      if (!currentRegistration) throw new Error('Aucune inscription en cours');

      const updatedRegistration = {
        ...currentRegistration,
        planSelection: { planId, billingCycle },
        status: 'payment_pending' as RegistrationStatus,
      };

      await new Promise(resolve => setTimeout(resolve, 500));
      set({ currentRegistration: updatedRegistration, isLoading: false });
    } catch (error) {
      set({ error: 'Erreur lors de la sélection du plan', isLoading: false });
    }
  },

  processPayment: async (paymentData: any) => {
    set({ isLoading: true, error: null });
    try {
      // Simulation de l'intégration FedaPay
      const fedapayResponse = await mockFedaPayPayment(paymentData);
      
      if (fedapayResponse.success) {
        const { currentRegistration } = get();
        if (currentRegistration) {
          // Passer directement à "under_review" après le paiement
          // sans étape KYC
          const updatedRegistration = {
            ...currentRegistration,
            status: 'under_review' as RegistrationStatus,
          };
          set({ currentRegistration: updatedRegistration });
        }
        
        set({ isLoading: false });
        return { success: true, paymentUrl: fedapayResponse.paymentUrl };
      } else {
        throw new Error('Échec du paiement');
      }
    } catch (error) {
      set({ error: 'Erreur lors du traitement du paiement', isLoading: false });
      return { success: false };
    }
  },

  fetchSubscriptionPlans: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ subscriptionPlans: mockPlans, isLoading: false });
    } catch (error) {
      set({ error: 'Erreur lors du chargement des plans', isLoading: false });
    }
  },

  checkRegistrationStatus: async (registrationId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulation de vérification du statut
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Erreur lors de la vérification du statut', isLoading: false });
    }
  },
}));

// Mock FedaPay integration
async function mockFedaPayPayment(paymentData: any) {
  // Simulation d'appel à l'API FedaPay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    success: true,
    paymentUrl: 'https://fedapay.com/pay/mock-transaction-id',
    transactionId: 'txn_mock_' + Date.now(),
  };
}