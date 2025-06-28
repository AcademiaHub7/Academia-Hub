/**
 * Modèle PaymentHistory - Représente l'historique des paiements dans le système
 * @module models/PaymentHistory
 */

import { PaymentStatus } from '../types/common';
import { PaymentHistory as PaymentHistoryType } from '../types/subscription';
import { api } from '../services/api/client';
import { Subscription } from './Subscription';

/**
 * Classe modèle pour l'historique des paiements
 * Implémente la logique métier et les relations
 */
export class PaymentHistory implements PaymentHistoryType {
  id: string;
  subscription_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  transaction_id: string;
  status: PaymentStatus;
  payment_date: string | null;
  created_at: string;
  updated_at: string;

  // Cache pour les relations
  private _subscription?: Subscription;

  /**
   * Constructeur du modèle PaymentHistory
   * @param data - Données de l'historique de paiement
   */
  constructor(data: PaymentHistoryType) {
    this.id = data.id;
    this.subscription_id = data.subscription_id;
    this.amount = data.amount;
    this.currency = data.currency;
    this.payment_method = data.payment_method;
    this.transaction_id = data.transaction_id;
    this.status = data.status;
    this.payment_date = data.payment_date;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  /**
   * Récupère un historique de paiement par son ID
   * @param id - ID de l'historique de paiement
   * @returns Promise<PaymentHistory | null>
   */
  static async findById(id: string): Promise<PaymentHistory | null> {
    try {
      const response = await api.get(`/payment-history/${id}`);
      return new PaymentHistory(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique de paiement:', error);
      return null;
    }
  }

  /**
   * Récupère l'historique des paiements d'un abonnement
   * @param subscriptionId - ID de l'abonnement
   * @returns Promise<PaymentHistory[]>
   */
  static async findBySubscriptionId(subscriptionId: string): Promise<PaymentHistory[]> {
    try {
      const response = await api.get(`/subscriptions/${subscriptionId}/payment-history`);
      return response.data.data.map((payment: PaymentHistoryType) => new PaymentHistory(payment));
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique des paiements de l\'abonnement:', error);
      return [];
    }
  }

  /**
   * Récupère l'historique des paiements d'un tenant
   * @param tenantId - ID du tenant (école)
   * @returns Promise<PaymentHistory[]>
   */
  static async findByTenantId(tenantId: string): Promise<PaymentHistory[]> {
    try {
      const response = await api.get(`/tenants/${tenantId}/payment-history`);
      return response.data.data.map((payment: PaymentHistoryType) => new PaymentHistory(payment));
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique des paiements du tenant:', error);
      return [];
    }
  }

  /**
   * Crée un nouvel historique de paiement
   * @param data - Données de l'historique de paiement à créer
   * @returns Promise<PaymentHistory | null>
   */
  static async create(data: Omit<PaymentHistoryType, 'id' | 'created_at' | 'updated_at'>): Promise<PaymentHistory | null> {
    try {
      const response = await api.post('/payment-history', data);
      return new PaymentHistory(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la création de l\'historique de paiement:', error);
      return null;
    }
  }

  /**
   * Met à jour l'historique de paiement
   * @param data - Données à mettre à jour
   * @returns Promise<PaymentHistory | null>
   */
  async update(data: Partial<PaymentHistoryType>): Promise<PaymentHistory | null> {
    try {
      const response = await api.put(`/payment-history/${this.id}`, data);
      Object.assign(this, response.data.data);
      return this;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'historique de paiement:', error);
      return null;
    }
  }

  /**
   * Met à jour le statut de paiement
   * @param status - Nouveau statut
   * @returns Promise<PaymentHistory | null>
   */
  async updateStatus(status: PaymentStatus): Promise<PaymentHistory | null> {
    try {
      const response = await api.put(`/payment-history/${this.id}/status`, { status });
      this.status = status;
      
      // Si le paiement est complété, mettre à jour la date de paiement
      if (status === PaymentStatus.COMPLETED && !this.payment_date) {
        this.payment_date = new Date().toISOString();
      }
      
      this.updated_at = response.data.data.updated_at;
      return this;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de paiement:', error);
      return null;
    }
  }

  /**
   * Récupère l'abonnement associé au paiement
   * @param force - Force la récupération depuis l'API
   * @returns Promise<Subscription | null>
   */
  async getSubscription(force = false): Promise<Subscription | null> {
    if (this._subscription && !force) {
      return this._subscription;
    }

    try {
      const { default: Subscription } = await import('./Subscription');
      this._subscription = await Subscription.findById(this.subscription_id);
      return this._subscription;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'abonnement associé au paiement:', error);
      return null;
    }
  }

  /**
   * Vérifie si le paiement est complété
   * @returns boolean
   */
  isCompleted(): boolean {
    return this.status === PaymentStatus.COMPLETED;
  }

  /**
   * Vérifie si le paiement est en attente
   * @returns boolean
   */
  isPending(): boolean {
    return this.status === PaymentStatus.PENDING;
  }

  /**
   * Vérifie si le paiement a échoué
   * @returns boolean
   */
  isFailed(): boolean {
    return this.status === PaymentStatus.FAILED;
  }

  /**
   * Obtient le montant formaté
   * @returns string
   */
  getFormattedAmount(): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: this.currency
    }).format(this.amount);
  }

  /**
   * Obtient la date de paiement formatée
   * @returns string
   */
  getFormattedPaymentDate(): string {
    if (!this.payment_date) {
      return 'Non payé';
    }
    
    return new Date(this.payment_date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

export default PaymentHistory;
