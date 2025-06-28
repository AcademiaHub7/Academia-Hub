/**
 * Types liés aux abonnements
 * @module types/subscription
 */

import { SubscriptionStatus, PaymentStatus } from './common';

/**
 * Interface représentant un abonnement
 */
export interface Subscription {
  /**
   * Identifiant unique de l'abonnement
   */
  id: string;
  
  /**
   * Identifiant du tenant (école) associé à cet abonnement
   */
  tenant_id: string;
  
  /**
   * Identifiant du plan d'abonnement
   */
  plan_id: string;
  
  /**
   * Identifiant de la transaction FedaPay
   */
  fedapay_transaction_id: string | null;
  
  /**
   * Statut actuel de l'abonnement
   */
  status: SubscriptionStatus;
  
  /**
   * Date de début de l'abonnement
   */
  start_date: string | null;
  
  /**
   * Date de fin de l'abonnement
   */
  end_date: string | null;
  
  /**
   * Renouvellement automatique
   */
  auto_renew: boolean;
  
  /**
   * Date de création
   */
  created_at: string;
  
  /**
   * Date de dernière mise à jour
   */
  updated_at: string;
}

/**
 * Interface représentant un plan d'abonnement
 */
export interface SubscriptionPlan {
  /**
   * Identifiant unique du plan
   */
  id: string;
  
  /**
   * Nom du plan
   */
  name: string;
  
  /**
   * Description du plan
   */
  description: string;
  
  /**
   * Prix du plan
   */
  price: number;
  
  /**
   * Devise du prix
   */
  currency: string;
  
  /**
   * Durée de l'abonnement en jours
   */
  duration_days: number;
  
  /**
   * Fonctionnalités incluses dans le plan
   */
  features: PlanFeatures;
  
  /**
   * Indique si le plan est actif
   */
  is_active: boolean;
  
  /**
   * Date de création
   */
  created_at: string;
  
  /**
   * Date de dernière mise à jour
   */
  updated_at: string;
}

/**
 * Interface représentant les fonctionnalités d'un plan
 */
export interface PlanFeatures {
  /**
   * Nombre maximum d'élèves autorisés
   */
  max_students: number;
  
  /**
   * Nombre maximum d'enseignants autorisés
   */
  max_teachers: number;
  
  /**
   * Espace de stockage vidéo en Go
   */
  video_storage_gb: number;
  
  /**
   * Domaine personnalisé autorisé
   */
  custom_domain: boolean;
  
  /**
   * Analytiques avancées
   */
  advanced_analytics: boolean;
  
  /**
   * Modules disponibles dans ce plan
   */
  modules?: string[];
  
  /**
   * Niveau de support technique
   */
  support_level?: 'basic' | 'standard' | 'premium';
}

/**
 * Interface représentant l'historique des paiements
 */
export interface PaymentHistory {
  /**
   * Identifiant unique du paiement
   */
  id: string;
  
  /**
   * Identifiant de l'abonnement associé
   */
  subscription_id: string;
  
  /**
   * Identifiant du tenant (école)
   */
  tenant_id: string;
  
  /**
   * Montant du paiement
   */
  amount: number;
  
  /**
   * Devise du paiement
   */
  currency: string;
  
  /**
   * Méthode de paiement utilisée
   */
  payment_method: string;
  
  /**
   * Identifiant de la transaction
   */
  transaction_id: string | null;
  
  /**
   * Statut du paiement
   */
  status: PaymentStatus;
  
  /**
   * Date du paiement
   */
  payment_date: string | null;
  
  /**
   * Date de création
   */
  created_at: string;
  
  /**
   * Date de dernière mise à jour
   */
  updated_at: string;
}
