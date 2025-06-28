/**
 * Modèle Plan - Représente un plan d'abonnement dans le système
 * @module models/Plan
 */

import { Plan as PlanType, PlanFeatures } from '../types/subscription';
import { api } from '../services/api/client';

/**
 * Classe modèle pour les plans d'abonnement
 * Implémente la logique métier et les relations
 */
export class Plan implements PlanType {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billing_cycle: string;
  features: PlanFeatures;
  is_active: boolean;
  created_at: string;
  updated_at: string;

  /**
   * Constructeur du modèle Plan
   * @param data - Données du plan
   */
  constructor(data: PlanType) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.currency = data.currency;
    this.billing_cycle = data.billing_cycle;
    this.features = data.features;
    this.is_active = data.is_active;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  /**
   * Récupère un plan par son ID
   * @param id - ID du plan
   * @returns Promise<Plan | null>
   */
  static async findById(id: string): Promise<Plan | null> {
    try {
      const response = await api.get(`/plans/${id}`);
      return new Plan(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération du plan:', error);
      return null;
    }
  }

  /**
   * Récupère tous les plans actifs
   * @returns Promise<Plan[]>
   */
  static async findAllActive(): Promise<Plan[]> {
    try {
      const response = await api.get('/plans', {
        params: { is_active: true }
      });
      
      return response.data.data.map((plan: PlanType) => new Plan(plan));
    } catch (error) {
      console.error('Erreur lors de la récupération des plans actifs:', error);
      return [];
    }
  }

  /**
   * Récupère tous les plans
   * @param page - Numéro de page
   * @param limit - Limite par page
   * @returns Promise<{ plans: Plan[], total: number }>
   */
  static async findAll(page = 1, limit = 10): Promise<{ 
    plans: Plan[], 
    total: number 
  }> {
    try {
      const response = await api.get('/plans', {
        params: { page, limit }
      });
      
      const plans = response.data.data.map((plan: PlanType) => new Plan(plan));
      
      return {
        plans,
        total: response.data.total
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des plans:', error);
      return { plans: [], total: 0 };
    }
  }

  /**
   * Crée un nouveau plan
   * @param data - Données du plan à créer
   * @returns Promise<Plan | null>
   */
  static async create(data: Omit<PlanType, 'id' | 'created_at' | 'updated_at'>): Promise<Plan | null> {
    try {
      const response = await api.post('/plans', data);
      return new Plan(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la création du plan:', error);
      return null;
    }
  }

  /**
   * Met à jour le plan
   * @param data - Données à mettre à jour
   * @returns Promise<Plan | null>
   */
  async update(data: Partial<PlanType>): Promise<Plan | null> {
    try {
      const response = await api.put(`/plans/${this.id}`, data);
      Object.assign(this, response.data.data);
      return this;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du plan:', error);
      return null;
    }
  }

  /**
   * Active ou désactive le plan
   * @param isActive - Statut d'activation
   * @returns Promise<Plan | null>
   */
  async setActive(isActive: boolean): Promise<Plan | null> {
    try {
      const response = await api.put(`/plans/${this.id}/status`, { is_active: isActive });
      this.is_active = isActive;
      this.updated_at = response.data.data.updated_at;
      return this;
    } catch (error) {
      console.error('Erreur lors de la modification du statut du plan:', error);
      return null;
    }
  }

  /**
   * Vérifie si le plan est actif
   * @returns boolean
   */
  isActive(): boolean {
    return this.is_active;
  }

  /**
   * Obtient le prix formaté du plan
   * @returns string
   */
  getFormattedPrice(): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: this.currency
    }).format(this.price);
  }

  /**
   * Obtient le cycle de facturation formaté
   * @returns string
   */
  getFormattedBillingCycle(): string {
    switch (this.billing_cycle) {
      case 'monthly':
        return 'Mensuel';
      case 'quarterly':
        return 'Trimestriel';
      case 'biannual':
        return 'Semestriel';
      case 'annual':
        return 'Annuel';
      default:
        return this.billing_cycle;
    }
  }

  /**
   * Calcule la durée du cycle de facturation en jours
   * @returns number
   */
  getBillingCycleDays(): number {
    switch (this.billing_cycle) {
      case 'monthly':
        return 30;
      case 'quarterly':
        return 90;
      case 'biannual':
        return 180;
      case 'annual':
        return 365;
      default:
        return 30; // Par défaut mensuel
    }
  }
}

export default Plan;
