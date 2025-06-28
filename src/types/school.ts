/**
 * Types liés aux écoles (tenants)
 * @module types/school
 */

import { SchoolStatus, KycStatus, PaymentStatus } from './common';

/**
 * Interface représentant une école (tenant)
 */
export interface School {
  /**
   * Identifiant unique de l'école
   */
  id: string;
  
  /**
   * Nom de l'école
   */
  name: string;
  
  /**
   * Sous-domaine unique pour accéder à l'école
   */
  subdomain: string;
  
  /**
   * Statut actuel de l'école
   */
  status: SchoolStatus;
  
  /**
   * Identifiant du plan d'abonnement
   */
  subscription_plan_id: string | null;
  
  /**
   * Statut du paiement
   */
  payment_status: PaymentStatus;
  
  /**
   * Statut de la vérification KYC
   */
  kyc_status: KycStatus;
  
  /**
   * Paramètres de l'école
   */
  settings: SchoolSettings | null;
  
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
 * Interface pour les paramètres de l'école
 */
export interface SchoolSettings {
  /**
   * URL du logo de l'école
   */
  logo?: string;
  
  /**
   * Thème de l'interface utilisateur
   */
  theme?: string;
  
  /**
   * Langue par défaut
   */
  language?: string;
  
  /**
   * Fuseau horaire
   */
  timezone?: string;
  
  /**
   * Format de date
   */
  date_format?: string;
  
  /**
   * Devise utilisée
   */
  currency?: string;
  
  /**
   * Informations de contact
   */
  contact_info?: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

/**
 * Interface pour la création d'une école
 */
export interface SchoolCreateData {
  /**
   * Nom de l'école
   */
  name: string;
  
  /**
   * Sous-domaine souhaité
   */
  subdomain: string;
  
  /**
   * Type d'établissement
   */
  type: string;
  
  /**
   * Adresse de l'école
   */
  address: string;
}
