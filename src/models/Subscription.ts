/**
 * Modèle Subscription - Représente un abonnement dans le système
 * @module models/Subscription
 */

import { SubscriptionStatus } from '../types/common';
import { Subscription as SubscriptionType, Plan, PaymentHistory } from '../types/subscription';
import { api } from '../services/api/client';
import { School } from './School';

/**
 * Classe modèle pour les abonnements
 * Implémente la logique métier et les relations
 */
export class Subscription implements SubscriptionType {
  id: string;
  tenant_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  start_date: string | null;
  end_date: string | null;
  trial_ends_at: string | null;
  fedapay_transaction_id: string | null;
  created_at: string;
  updated_at: string;

  // Cache pour les relations
  private _school?: School;
  private _plan?: Plan;
  private _paymentHistory?: PaymentHistory[];

  /**
   * Constructeur du modèle Subscription
   * @param data - Données de l'abonnement
   */
  constructor(data: SubscriptionType) {
    this.id = data.id;
    this.tenant_id = data.tenant_id;
    this.plan_id = data.plan_id;
    this.status = data.status;
    this.start_date = data.start_date;
    this.end_date = data.end_date;
    this.trial_ends_at = data.trial_ends_at;
    this.fedapay_transaction_id = data.fedapay_transaction_id;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  /**
   * Récupère un abonnement par son ID
   * @param id - ID de l'abonnement
   * @returns Promise<Subscription | null>
   */
  static async findById(id: string): Promise<Subscription | null> {
    try {
      const response = await api.get(`/subscriptions/${id}`);
      return new Subscription(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'abonnement:', error);
      return null;
    }
  }

  /**
   * Récupère l'abonnement actif d'un tenant
   * @param tenantId - ID du tenant (école)
   * @returns Promise<Subscription | null>
   */
  static async findActiveByTenantId(tenantId: string): Promise<Subscription | null> {
    try {
      const response = await api.get(`/tenants/${tenantId}/active-subscription`);
      return new Subscription(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'abonnement actif:', error);
      return null;
    }
  }

  /**
   * Récupère tous les abonnements d'un tenant
   * @param tenantId - ID du tenant (école)
   * @param page - Numéro de page
   * @param limit - Limite par page
   * @returns Promise<{ subscriptions: Subscription[], total: number, page: number, limit: number }>
   */
  static async findByTenantId(tenantId: string, page = 1, limit = 10): Promise<{ 
    subscriptions: Subscription[], 
    total: number, 
    page: number, 
    limit: number 
  }> {
    try {
      const response = await api.get(`/tenants/${tenantId}/subscriptions`, {
        params: { page, limit }
      });
      
      const subscriptions = response.data.data.map((sub: SubscriptionType) => new Subscription(sub));
      
      return {
        subscriptions,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des abonnements du tenant:', error);
      return { subscriptions: [], total: 0, page, limit };
    }
  }

  /**
   * Crée un nouvel abonnement
   * @param data - Données de l'abonnement à créer
   * @returns Promise<Subscription | null>
   */
  static async create(data: {
    tenant_id: string;
    plan_id: string;
    fedapay_transaction_id: string;
  }): Promise<Subscription | null> {
    try {
      const response = await api.post('/subscriptions', data);
      return new Subscription(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la création de l\'abonnement:', error);
      return null;
    }
  }

  /**
   * Met à jour l'abonnement
   * @param data - Données à mettre à jour
   * @returns Promise<Subscription | null>
   */
  async update(data: Partial<SubscriptionType>): Promise<Subscription | null> {
    try {
      const response = await api.put(`/subscriptions/${this.id}`, data);
      Object.assign(this, response.data.data);
      return this;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'abonnement:', error);
      return null;
    }
  }

  /**
   * Met à jour le statut de l'abonnement
   * @param status - Nouveau statut
   * @returns Promise<Subscription | null>
   */
  async updateStatus(status: SubscriptionStatus): Promise<Subscription | null> {
    try {
      const response = await api.put(`/subscriptions/${this.id}/status`, { status });
      this.status = status;
      this.updated_at = response.data.data.updated_at;
      return this;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de l\'abonnement:', error);
      return null;
    }
  }

  /**
   * Annule l'abonnement
   * @returns Promise<Subscription | null>
   */
  async cancel(): Promise<Subscription | null> {
    return this.updateStatus(SubscriptionStatus.CANCELLED);
  }

  /**
   * Renouvelle l'abonnement
   * @param transactionId - ID de la transaction FedaPay
   * @returns Promise<Subscription | null>
   */
  async renew(transactionId: string): Promise<Subscription | null> {
    try {
      const response = await api.post(`/subscriptions/${this.id}/renew`, {
        fedapay_transaction_id: transactionId
      });
      
      Object.assign(this, response.data.data);
      return this;
    } catch (error) {
      console.error('Erreur lors du renouvellement de l\'abonnement:', error);
      return null;
    }
  }

  /**
   * Récupère l'école (tenant) de l'abonnement
   * @param force - Force la récupération depuis l'API
   * @returns Promise<School | null>
   */
  async getSchool(force = false): Promise<School | null> {
    if (this._school && !force) {
      return this._school;
    }

    try {
      const { default: School } = await import('./School');
      this._school = await School.findById(this.tenant_id);
      return this._school;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'école de l\'abonnement:', error);
      return null;
    }
  }

  /**
   * Récupère le plan de l'abonnement
   * @param force - Force la récupération depuis l'API
   * @returns Promise<Plan | null>
   */
  async getPlan(force = false): Promise<Plan | null> {
    if (this._plan && !force) {
      return this._plan;
    }

    try {
      const response = await api.get(`/plans/${this.plan_id}`);
      this._plan = response.data.data;
      return this._plan;
    } catch (error) {
      console.error('Erreur lors de la récupération du plan de l\'abonnement:', error);
      return null;
    }
  }

  /**
   * Récupère l'historique des paiements de l'abonnement
   * @param force - Force la récupération depuis l'API
   * @returns Promise<PaymentHistory[]>
   */
  async getPaymentHistory(force = false): Promise<PaymentHistory[]> {
    if (this._paymentHistory && !force) {
      return this._paymentHistory;
    }

    try {
      const response = await api.get(`/subscriptions/${this.id}/payment-history`);
      this._paymentHistory = response.data.data;
      return this._paymentHistory;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique des paiements:', error);
      return [];
    }
  }

  /**
   * Vérifie si l'abonnement est actif
   * @returns boolean
   */
  isActive(): boolean {
    return this.status === SubscriptionStatus.ACTIVE;
  }

  /**
   * Vérifie si l'abonnement est en période d'essai
   * @returns boolean
   */
  isInTrial(): boolean {
    if (!this.trial_ends_at) {
      return false;
    }
    
    const now = new Date();
    const trialEnd = new Date(this.trial_ends_at);
    return this.isActive() && now < trialEnd;
  }

  /**
   * Vérifie si l'abonnement est expiré
   * @returns boolean
   */
  isExpired(): boolean {
    if (!this.end_date) {
      return false;
    }
    
    const now = new Date();
    const endDate = new Date(this.end_date);
    return now > endDate;
  }

  /**
   * Calcule le nombre de jours restants avant expiration
   * @returns number | null
   */
  getDaysRemaining(): number | null {
    if (!this.end_date) {
      return null;
    }
    
    const now = new Date();
    const endDate = new Date(this.end_date);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  }

  /**
   * Crée une transaction FedaPay pour un plan et un tenant spécifiques
   * @param planId - ID du plan
   * @param tenantId - ID du tenant (école)
   * @returns Promise<{ transaction_id: string; payment_url: string } | null>
   */
  static async createFedaPayTransaction(
    planId: string, 
    tenantId: string
  ): Promise<{ transaction_id: string; payment_url: string } | null> {
    try {
      const response = await api.post('/payments/create-transaction', {
        plan_id: planId,
        tenant_id: tenantId
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la création de la transaction FedaPay:', error);
      return null;
    }
  }

  /**
   * Vérifie le statut d'une transaction FedaPay
   * @param transactionId - ID de la transaction FedaPay
   * @returns Promise<{ status: string; message: string } | null>
   */
  static async checkTransactionStatus(
    transactionId: string
  ): Promise<{ status: string; message: string } | null> {
    try {
      const response = await api.get(`/payments/check-transaction/${transactionId}`);
      return {
        status: response.data.data.status,
        message: response.data.message
      };
    } catch (error) {
      console.error('Erreur lors de la vérification du statut de la transaction:', error);
      return null;
    }
  }
}

export default Subscription;
