/**
 * Modèle School - Représente une école (tenant) dans le système
 * @module models/School
 */

import { SchoolStatus, KycStatus, PaymentStatus } from '../types/common';
import { School as SchoolType, SchoolSettings } from '../types/school';
import { User } from './User';
import { Subscription } from './Subscription';
import { api } from '../services/api/client';

/**
 * Classe modèle pour les écoles (tenants)
 * Implémente la logique métier et les relations
 */
export class School implements SchoolType {
  id: string;
  name: string;
  subdomain: string;
  status: SchoolStatus;
  subscription_plan_id: string | null;
  payment_status: PaymentStatus;
  kyc_status: KycStatus;
  settings: SchoolSettings | null;
  created_at: string;
  updated_at: string;

  // Cache pour les relations
  private _users?: User[];
  private _activeSubscription?: Subscription;

  /**
   * Constructeur du modèle School
   * @param data - Données de l'école
   */
  constructor(data: SchoolType) {
    this.id = data.id;
    this.name = data.name;
    this.subdomain = data.subdomain;
    this.status = data.status;
    this.subscription_plan_id = data.subscription_plan_id;
    this.payment_status = data.payment_status;
    this.kyc_status = data.kyc_status;
    this.settings = data.settings;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  /**
   * Récupère une école par son ID
   * @param id - ID de l'école
   * @returns Promise<School>
   */
  static async findById(id: string): Promise<School | null> {
    try {
      const response = await api.get(`/schools/${id}`);
      return new School(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'école:', error);
      return null;
    }
  }

  /**
   * Récupère une école par son sous-domaine
   * @param subdomain - Sous-domaine de l'école
   * @returns Promise<School>
   */
  static async findBySubdomain(subdomain: string): Promise<School | null> {
    try {
      const response = await api.get(`/schools/subdomain/${subdomain}`);
      return new School(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'école par sous-domaine:', error);
      return null;
    }
  }

  /**
   * Récupère toutes les écoles
   * @param page - Numéro de page
   * @param limit - Limite par page
   * @returns Promise<{ schools: School[], total: number, page: number, limit: number }>
   */
  static async findAll(page = 1, limit = 10): Promise<{ 
    schools: School[], 
    total: number, 
    page: number, 
    limit: number 
  }> {
    try {
      const response = await api.get('/schools', {
        params: { page, limit }
      });
      
      const schools = response.data.data.map((school: SchoolType) => new School(school));
      
      return {
        schools,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des écoles:', error);
      return { schools: [], total: 0, page, limit };
    }
  }

  /**
   * Scope: Écoles actives
   * @param page - Numéro de page
   * @param limit - Limite par page
   * @returns Promise<{ schools: School[], total: number, page: number, limit: number }>
   */
  static async findActive(page = 1, limit = 10): Promise<{ 
    schools: School[], 
    total: number, 
    page: number, 
    limit: number 
  }> {
    try {
      const response = await api.get('/schools', {
        params: { page, limit, status: SchoolStatus.ACTIVE }
      });
      
      const schools = response.data.data.map((school: SchoolType) => new School(school));
      
      return {
        schools,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des écoles actives:', error);
      return { schools: [], total: 0, page, limit };
    }
  }

  /**
   * Scope: Écoles en attente de KYC
   * @param page - Numéro de page
   * @param limit - Limite par page
   * @returns Promise<{ schools: School[], total: number, page: number, limit: number }>
   */
  static async findPendingKyc(page = 1, limit = 10): Promise<{ 
    schools: School[], 
    total: number, 
    page: number, 
    limit: number 
  }> {
    try {
      const response = await api.get('/schools', {
        params: { page, limit, status: SchoolStatus.PENDING_KYC }
      });
      
      const schools = response.data.data.map((school: SchoolType) => new School(school));
      
      return {
        schools,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des écoles en attente de KYC:', error);
      return { schools: [], total: 0, page, limit };
    }
  }

  /**
   * Scope: Écoles en attente de paiement
   * @param page - Numéro de page
   * @param limit - Limite par page
   * @returns Promise<{ schools: School[], total: number, page: number, limit: number }>
   */
  static async findPendingPayment(page = 1, limit = 10): Promise<{ 
    schools: School[], 
    total: number, 
    page: number, 
    limit: number 
  }> {
    try {
      const response = await api.get('/schools', {
        params: { page, limit, status: SchoolStatus.PENDING_PAYMENT }
      });
      
      const schools = response.data.data.map((school: SchoolType) => new School(school));
      
      return {
        schools,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des écoles en attente de paiement:', error);
      return { schools: [], total: 0, page, limit };
    }
  }

  /**
   * Crée une nouvelle école
   * @param data - Données de l'école à créer
   * @returns Promise<School>
   */
  static async create(data: Omit<SchoolType, 'id' | 'created_at' | 'updated_at'>): Promise<School | null> {
    try {
      const response = await api.post('/schools', data);
      return new School(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la création de l\'école:', error);
      return null;
    }
  }

  /**
   * Met à jour l'école
   * @param data - Données à mettre à jour
   * @returns Promise<School>
   */
  async update(data: Partial<SchoolType>): Promise<School | null> {
    try {
      const response = await api.put(`/schools/${this.id}`, data);
      Object.assign(this, response.data.data);
      return this;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'école:', error);
      return null;
    }
  }

  /**
   * Met à jour le statut de l'école
   * @param status - Nouveau statut
   * @returns Promise<School>
   */
  async updateStatus(status: SchoolStatus): Promise<School | null> {
    try {
      const response = await api.put(`/schools/${this.id}/status`, { status });
      this.status = status;
      this.updated_at = response.data.data.updated_at;
      return this;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de l\'école:', error);
      return null;
    }
  }

  /**
   * Met à jour le statut KYC de l'école
   * @param kycStatus - Nouveau statut KYC
   * @returns Promise<School>
   */
  async updateKycStatus(kycStatus: KycStatus): Promise<School | null> {
    try {
      const response = await api.put(`/schools/${this.id}/kyc-status`, { kyc_status: kycStatus });
      this.kyc_status = kycStatus;
      this.updated_at = response.data.data.updated_at;
      
      // Si KYC est vérifié et l'école est en attente de KYC, mettre à jour le statut
      if (kycStatus === KycStatus.VERIFIED && this.status === SchoolStatus.PENDING_KYC) {
        await this.updateStatus(SchoolStatus.ACTIVE);
      }
      
      return this;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut KYC de l\'école:', error);
      return null;
    }
  }

  /**
   * Met à jour le statut de paiement de l'école
   * @param paymentStatus - Nouveau statut de paiement
   * @returns Promise<School>
   */
  async updatePaymentStatus(paymentStatus: PaymentStatus): Promise<School | null> {
    try {
      const response = await api.put(`/schools/${this.id}/payment-status`, { payment_status: paymentStatus });
      this.payment_status = paymentStatus;
      this.updated_at = response.data.data.updated_at;
      
      // Si le paiement est complété et l'école est en attente de paiement, mettre à jour le statut
      if (paymentStatus === PaymentStatus.COMPLETED && this.status === SchoolStatus.PENDING_PAYMENT) {
        await this.updateStatus(SchoolStatus.PENDING_KYC);
      }
      
      return this;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de paiement de l\'école:', error);
      return null;
    }
  }

  /**
   * Vérifie si l'école est active
   * @returns boolean
   */
  isActive(): boolean {
    return this.status === SchoolStatus.ACTIVE;
  }

  /**
   * Vérifie si l'école a passé la vérification KYC
   * @returns boolean
   */
  isKycVerified(): boolean {
    return this.kyc_status === KycStatus.VERIFIED;
  }

  /**
   * Vérifie si l'école a un paiement valide
   * @returns boolean
   */
  hasValidPayment(): boolean {
    return this.payment_status === PaymentStatus.COMPLETED;
  }

  /**
   * Récupère les utilisateurs de l'école
   * @param force - Force la récupération depuis l'API
   * @returns Promise<User[]>
   */
  async getUsers(force = false): Promise<User[]> {
    if (this._users && !force) {
      return this._users;
    }

    try {
      const { default: User } = await import('./User');
      this._users = await User.findByTenantId(this.id);
      return this._users;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs de l\'école:', error);
      return [];
    }
  }

  /**
   * Récupère l'abonnement actif de l'école
   * @param force - Force la récupération depuis l'API
   * @returns Promise<Subscription | null>
   */
  async getActiveSubscription(force = false): Promise<Subscription | null> {
    if (this._activeSubscription && !force) {
      return this._activeSubscription;
    }

    try {
      const { default: Subscription } = await import('./Subscription');
      this._activeSubscription = await Subscription.findActiveByTenantId(this.id);
      return this._activeSubscription;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'abonnement actif de l\'école:', error);
      return null;
    }
  }

  /**
   * Vérifie si l'abonnement de l'école est actif
   * @returns Promise<boolean>
   */
  async hasActiveSubscription(): Promise<boolean> {
    const subscription = await this.getActiveSubscription();
    return subscription !== null;
  }

  /**
   * Récupère le nombre d'utilisateurs par rôle
   * @returns Promise<Record<string, number>>
   */
  async getUserCountByRole(): Promise<Record<string, number>> {
    try {
      const response = await api.get(`/schools/${this.id}/user-stats`);
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques d\'utilisateurs:', error);
      return {};
    }
  }
}

export default School;
