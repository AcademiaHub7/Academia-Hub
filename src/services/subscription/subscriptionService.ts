/**
 * Service pour la gestion des abonnements
 * @module services/subscription/subscriptionService
 */

import { api } from '../api/client';
import { Subscription, Plan } from '../../types/subscription';

/**
 * Interface pour les réponses API des abonnements
 */
interface SubscriptionResponse {
  data: Subscription;
  message: string;
}

/**
 * Interface pour les réponses API de liste d'abonnements
 */
interface SubscriptionListResponse {
  data: Subscription[];
  total: number;
  page: number;
  limit: number;
  message: string;
}

/**
 * Interface pour les réponses API des plans
 */
interface PlanResponse {
  data: Plan;
  message: string;
}

/**
 * Interface pour les réponses API de liste de plans
 */
interface PlanListResponse {
  data: Plan[];
  total: number;
  message: string;
}

/**
 * Interface pour la création d'un abonnement
 */
interface CreateSubscriptionData {
  tenant_id: string;
  plan_id: string;
  fedapay_transaction_id: string;
}

/**
 * Service pour la gestion des abonnements
 */
export const subscriptionService = {
  /**
   * Récupère un abonnement par son ID
   * @param id - ID de l'abonnement
   * @returns Promesse avec les données de l'abonnement
   */
  async getSubscriptionById(id: string): Promise<Subscription> {
    const response = await api.get<SubscriptionResponse>(`/subscriptions/${id}`);
    return response.data;
  },

  /**
   * Récupère l'abonnement actif d'un tenant
   * @param tenantId - ID du tenant (école)
   * @returns Promesse avec les données de l'abonnement
   */
  async getActiveSubscription(tenantId: string): Promise<Subscription> {
    const response = await api.get<SubscriptionResponse>(`/tenants/${tenantId}/active-subscription`);
    return response.data;
  },

  /**
   * Crée un nouvel abonnement
   * @param subscriptionData - Données de l'abonnement à créer
   * @returns Promesse avec les données de l'abonnement créé
   */
  async createSubscription(subscriptionData: CreateSubscriptionData): Promise<Subscription> {
    const response = await api.post<SubscriptionResponse>('/subscriptions', subscriptionData);
    return response.data;
  },

  /**
   * Met à jour le statut d'un abonnement
   * @param id - ID de l'abonnement
   * @param status - Nouveau statut
   * @returns Promesse avec les données de l'abonnement mis à jour
   */
  async updateSubscriptionStatus(id: string, status: Subscription['status']): Promise<Subscription> {
    const response = await api.put<SubscriptionResponse>(`/subscriptions/${id}/status`, { status });
    return response.data;
  },

  /**
   * Liste les abonnements d'un tenant
   * @param tenantId - ID du tenant (école)
   * @param page - Numéro de page
   * @param limit - Limite par page
   * @returns Promesse avec la liste des abonnements
   */
  async listSubscriptionsByTenant(tenantId: string, page = 1, limit = 10): Promise<SubscriptionListResponse> {
    return api.get<SubscriptionListResponse>(`/tenants/${tenantId}/subscriptions`, {
      params: {
        page: page.toString(),
        limit: limit.toString(),
      },
    });
  },

  /**
   * Récupère un plan par son ID
   * @param id - ID du plan
   * @returns Promesse avec les données du plan
   */
  async getPlanById(id: string): Promise<Plan> {
    const response = await api.get<PlanResponse>(`/plans/${id}`);
    return response.data;
  },

  /**
   * Liste tous les plans disponibles
   * @returns Promesse avec la liste des plans
   */
  async listPlans(): Promise<Plan[]> {
    const response = await api.get<PlanListResponse>('/plans');
    return response.data;
  },

  /**
   * Crée une transaction FedaPay pour un abonnement
   * @param planId - ID du plan
   * @param tenantId - ID du tenant (école)
   * @returns Promesse avec les données de la transaction
   */
  async createFedaPayTransaction(planId: string, tenantId: string): Promise<{ transaction_id: string; payment_url: string }> {
    const response = await api.post<{ data: { transaction_id: string; payment_url: string }; message: string }>(
      '/payments/create-transaction',
      { plan_id: planId, tenant_id: tenantId }
    );
    return response.data;
  },

  /**
   * Vérifie le statut d'une transaction FedaPay
   * @param transactionId - ID de la transaction FedaPay
   * @returns Promesse avec le statut de la transaction
   */
  async checkTransactionStatus(transactionId: string): Promise<{ status: string; message: string }> {
    const response = await api.get<{ data: { status: string }; message: string }>(
      `/payments/check-transaction/${transactionId}`
    );
    return { status: response.data.status, message: response.message };
  },
};
