/**
 * Modèle SubscriptionPlan - Représente un plan d'abonnement dans le système
 * @module models/SubscriptionPlan
 */

import { SubscriptionType } from '../services/payment/subscriptionService';
import { api } from '../services/api/client';

/**
 * Interface pour le modèle SubscriptionPlan
 */
export interface SubscriptionPlanType {
  id: string;
  name: string;
  description: string;
  type: SubscriptionType;
  price: number;
  features: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Classe modèle pour les plans d'abonnement
 * Implémente la logique métier
 */
export class SubscriptionPlan implements SubscriptionPlanType {
  id: string;
  name: string;
  description: string;
  type: SubscriptionType;
  price: number;
  features: string[];
  created_at: string;
  updated_at: string;

  /**
   * Constructeur du modèle SubscriptionPlan
   * @param data - Données du plan d'abonnement
   */
  constructor(data: SubscriptionPlanType) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.type = data.type;
    this.price = data.price;
    this.features = data.features;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  /**
   * Récupère un plan d'abonnement par son ID
   * @param id - ID du plan d'abonnement
   * @returns Promise<SubscriptionPlan | null>
   */
  static async findById(id: string): Promise<SubscriptionPlan | null> {
    try {
      const response = await api.get(`/plans/${id}`);
      return new SubscriptionPlan(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération du plan d\'abonnement:', error);
      return null;
    }
  }

  /**
   * Récupère tous les plans d'abonnement
   * @returns Promise<SubscriptionPlan[]>
   */
  static async findAll(): Promise<SubscriptionPlan[]> {
    try {
      const response = await api.get('/plans');
      return response.data.data.map((plan: SubscriptionPlanType) => new SubscriptionPlan(plan));
    } catch (error) {
      console.error('Erreur lors de la récupération des plans d\'abonnement:', error);
      return [];
    }
  }
}

export default SubscriptionPlan;
