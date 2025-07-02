/**
 * Service pour la gestion du processus d'inscription multi-étapes
 * @module services/registration/registrationService
 */

import { api } from '../api/client';
import { School } from '../../models/School';
import { User } from '../../models/User';
import { Plan } from '../../models/Plan';
import { Subscription } from '../../models/Subscription';
import { PaymentStatus } from '../../types/common';

/**
 * Interface pour les données d'inscription de l'école
 */
export interface SchoolRegistrationData {
  name: string;
  subdomain: string;
  address: string;
  type: string;
  country: string;
  city: string;
  phone?: string;
  email?: string;
}

/**
 * Interface pour les données d'inscription du promoteur
 */
export interface PromoterRegistrationData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
}

/**
 * Interface pour les données de vérification KYC
 */
export interface KycDocumentData {
  document_type: string;
  document_number: string;
  expiry_date?: string;
  file: File;
}

/**
 * Interface pour les données de session d'inscription
 */
export interface RegistrationSession {
  id: string;
  promoter?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    position?: string;
    password?: string;
    confirmPassword?: string;
    emailVerified?: boolean;
  };
  school?: {
    name?: string;
    type?: string;
    address?: string;
    subdomain?: string;
    country?: string;
    city?: string;
    postalCode?: string;
    phone?: string;
    website?: string;
    foundedYear?: number;
    numberOfStudents?: number;
  };
  status?: 'pending' | 'email_verified' | 'completed' | 'cancelled';
  subscription?: {
    planId?: string;
    status?: string;
  };
  payment?: {
    status?: string;
    transactionId?: string;
  };
  kyc?: {
    status?: string;
  };
  activation?: {
    status?: string;
  };
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Service pour la gestion du processus d'inscription multi-étapes
 */
export const registrationService = {
  /**
   * Démarre une nouvelle session d'inscription
   * @returns Promise<RegistrationSession>
   */
  async startRegistrationSession(): Promise<RegistrationSession> {
    try {
      console.log('Démarrage d\'une nouvelle session d\'inscription');
      // Ajout d'un second paramètre vide pour l'API post
      const response = await api.post<RegistrationSession>('/registration/start-session', {});
      console.log('Réponse reçue:', response);
      
      // Création d'une session avec les valeurs par défaut si les propriétés n'existent pas
      const session = {
        id: response?.id || 'temp-session-' + Date.now(),
        status: 'pending' as 'pending' | 'email_verified' | 'completed' | 'cancelled',
        promoter: response?.promoter ? {
          email: response.promoter?.email || '',
          firstName: response.promoter?.firstName,
          lastName: response.promoter?.lastName,
          phone: response.promoter?.phone,
          emailVerified: response.status === 'email_verified'
        } : { email: '' }, // Valeur minimale requise
        school: response?.school,
        subscription: response?.subscription,
        payment: response?.payment,
        kyc: response?.kyc,
        activation: response?.activation,
        metadata: response?.metadata || {},
        createdAt: response?.createdAt || new Date().toISOString(),
        updatedAt: response?.updatedAt || new Date().toISOString()
      };
      
      console.log('Session créée:', session);
      return session;
    } catch (error) {
      console.error('Erreur détaillée lors du démarrage de la session:', error);
      
      // Création d'une session de secours en cas d'erreur
      const fallbackSession = {
        id: 'temp-session-' + Date.now(),
        status: 'pending' as 'pending' | 'email_verified' | 'completed' | 'cancelled',
        promoter: { email: '' },
        metadata: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      console.log('Utilisation d\'une session de secours:', fallbackSession);
      return fallbackSession;
    }
  },

  /**
   * Récupère une session d'inscription existante
   * @param sessionId - ID de la session d'inscription
   * @returns Promise<RegistrationSession>
   */
  async getRegistrationSession(sessionId: string): Promise<RegistrationSession> {
    try {
      const response = await api.get<RegistrationSession>(`/registration/session/${sessionId}`);
      
      return {
        id: response.id || sessionId,
        status: response.status || 'pending',
        promoter: response.promoter ? {
          email: response.promoter.email,
          firstName: response.promoter.firstName,
          lastName: response.promoter.lastName,
          phone: response.promoter.phone,
          address: response.promoter.address,
          position: response.promoter.position,
          emailVerified: response.status === 'email_verified',
          password: response.promoter.password,
          confirmPassword: response.promoter.confirmPassword
        } : undefined,
        school: response.school,
        subscription: response.subscription,
        payment: response.payment,
        kyc: response.kyc,
        activation: response.activation,
        metadata: response.metadata,
        createdAt: response.createdAt || new Date().toISOString(),
        updatedAt: response.updatedAt || new Date().toISOString()
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de la session:', error);
      throw new Error('Impossible de récupérer la session d\'inscription. Veuillez réessayer.');
    }
  },

  /**
   * Étape 1: Enregistre les informations de l'école et du promoteur
   * @param sessionId - ID de la session d'inscription
   * @param schoolData - Données de l'école
   * @param promoterData - Données du promoteur
   * @returns Promise<RegistrationSession>
   */
  async registerSchoolAndPromoter(
    sessionId: string,
    schoolData: SchoolRegistrationData,
    promoterData: PromoterRegistrationData
  ): Promise<RegistrationSession> {
    const response = await api.post<{ data: RegistrationSession }>(`/registration/session/${sessionId}/step1`, {
      school: schoolData,
      promoter: promoterData
    });
    
    return response.data;
  },

  /**
   * Vérifie si un sous-domaine est disponible
   * @param subdomain - Sous-domaine à vérifier
   * @returns Promise<boolean>
   */
  async checkSubdomainAvailability(subdomain: string): Promise<boolean> {
    try {
      const response = await api.get<{ data: { available: boolean } }>(`/registration/check-subdomain/${subdomain}`);
      return response.data.available;
    } catch (error) {
      console.error('Erreur lors de la vérification du sous-domaine:', error);
      return false;
    }
  },

  /**
   * Vérifie si un email est déjà utilisé
   * @param email - Email à vérifier
   * @returns Promise<boolean>
   */
  async checkEmailAvailability(email: string): Promise<boolean> {
    try {
      const response = await api.get<{ data: { available: boolean } }>(`/registration/check-email/${email}`);
      return response.data.available;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'email:', error);
      return false;
    }
  },

  /**
   * Étape 2: Sélectionne un plan d'abonnement
   * @param sessionId - ID de la session d'inscription
   * @param planId - ID du plan sélectionné
   * @returns Promise<RegistrationSession>
   */
  async selectPlan(sessionId: string, planId: string): Promise<RegistrationSession> {
    const response = await api.post<{ data: RegistrationSession }>(`/registration/session/${sessionId}/step2`, {
      plan_id: planId
    });
    
    return response.data;
  },

  /**
   * Liste tous les plans disponibles pour l'inscription
   * @returns Promise<Plan[]>
   */
  async listAvailablePlans(): Promise<Plan[]> {
    return Plan.findAllActive();
  },

  /**
   * Étape 3: Initie le processus de paiement
   * @param sessionId - ID de la session d'inscription
   * @returns Promise<{ payment_url: string, transaction_id: string }>
   */
  async initiatePayment(sessionId: string): Promise<{ payment_url: string, transaction_id: string }> {
    const response = await api.post<{ 
      data: { payment_url: string, transaction_id: string } 
    }>(`/registration/session/${sessionId}/step3`, {});
    
    return response.data;
  },

  /**
   * Vérifie le statut d'une transaction de paiement
   * @param sessionId - ID de la session d'inscription
   * @param transactionId - ID de la transaction FedaPay
   * @returns Promise<{ status: PaymentStatus, message: string }>
   */
  async checkPaymentStatus(
    sessionId: string, 
    transactionId: string
  ): Promise<{ status: PaymentStatus, message: string }> {
    const response = await api.get<{ 
      data: { status: PaymentStatus, message: string } 
    }>(`/registration/session/${sessionId}/payment-status/${transactionId}`);
    
    return response.data;
  },

  /**
   * Étape 4: Soumet les documents KYC
   * @param sessionId - ID de la session d'inscription
   * @param documents - Documents KYC
   * @returns Promise<RegistrationSession>
   */
  async submitKycDocuments(sessionId: string, documents: KycDocumentData[]): Promise<RegistrationSession> {
    // Créer un FormData pour l'upload des fichiers
    const formData = new FormData();
    
    // Ajouter les métadonnées des documents
    documents.forEach((doc, index) => {
      formData.append(`documents[${index}][document_type]`, doc.document_type);
      formData.append(`documents[${index}][document_number]`, doc.document_number);
      
      if (doc.expiry_date) {
        formData.append(`documents[${index}][expiry_date]`, doc.expiry_date);
      }
      
      formData.append(`documents[${index}][file]`, doc.file);
    });
    
    const response = await api.post<{ data: RegistrationSession }>(
      `/registration/session/${sessionId}/step4`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    return response.data;
  },

  /**
   * Finalise le processus d'inscription
   * @param sessionId - ID de la session d'inscription
   * @returns Promise<{ school: School, user: User, subscription: Subscription }>
   */
  async finalizeRegistration(
    sessionId: string
  ): Promise<{ school: School, user: User, subscription: Subscription }> {
    const response = await api.post<{ 
      data: { 
        school: School, 
        user: User, 
        subscription: Subscription 
      } 
    }>(`/registration/session/${sessionId}/finalize`);
    
    return {
      school: new School(response.data.school),
      user: new User(response.data.user),
      subscription: new Subscription(response.data.subscription)
    };
  },

  /**
   * Annule une session d'inscription
   * @param sessionId - ID de la session d'inscription
   * @returns Promise<boolean>
   */
  async cancelRegistration(sessionId: string): Promise<boolean> {
    return api.delete<{ success: boolean }>(`/registration/sessions/${sessionId}`)
      .then((response) => response.success)
      .catch((error: Error) => {
        console.error('Error cancelling registration:', error);
        return false;
      });
  },
  
  /**
   * Envoie un code de vérification par email
   * @param sessionId - ID de la session d'inscription
   * @param email - Email du destinataire
   * @returns Promise<{ success: boolean, message?: string }>
   */
  async sendVerificationCode(sessionId: string, email: string): Promise<{ success: boolean, message?: string }> {
    return api.post<{ message: string }>(
      '/registration/verification/send-code', 
      { sessionId, email }
    )
      .then((response) => ({
        success: true,
        message: response.message
      }))
      .catch((error: Error) => {
        console.error('Error sending verification code:', error);
        return {
          success: false,
          message: error.message || 'Failed to send verification code'
        };
      });
  },
  
  /**
   * Vérifie un code de vérification d'email
   * @param sessionId - ID de la session d'inscription
   * @param code - Code de vérification à 6 chiffres
   * @returns Promise<{ verified: boolean, message?: string }>
   */
  async verifyEmailCode(sessionId: string, code: string): Promise<{ verified: boolean, message?: string }> {
    return api.post<{ verified: boolean, message: string }>(
      '/registration/verification/verify-code', 
      { sessionId, code }
    )
      .then((response) => ({
        verified: response.verified,
        message: response.message
      }))
      .catch((error: Error) => {
        console.error('Error verifying email code:', error);
        return {
          verified: false,
          message: error.message || 'Failed to verify email code'
        };
      });
  }
};

