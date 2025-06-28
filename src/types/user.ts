/**
 * Types liés aux utilisateurs
 * @module types/user
 */

import { UserRole, UserStatus } from './common';

/**
 * Interface représentant un utilisateur
 */
export interface User {
  /**
   * Identifiant unique de l'utilisateur
   */
  id: string;
  
  /**
   * Identifiant du tenant (école) auquel l'utilisateur appartient
   */
  tenant_id: string;
  
  /**
   * Adresse email de l'utilisateur (identifiant unique)
   */
  email: string;
  
  /**
   * Mot de passe haché (ne doit jamais être exposé au client)
   */
  password?: string;
  
  /**
   * Prénom de l'utilisateur
   */
  first_name: string;
  
  /**
   * Nom de famille de l'utilisateur
   */
  last_name: string;
  
  /**
   * Numéro de téléphone
   */
  phone?: string;
  
  /**
   * Rôle de l'utilisateur dans le système
   */
  role: UserRole;
  
  /**
   * Statut actuel de l'utilisateur
   */
  status: UserStatus;
  
  /**
   * Indique si l'utilisateur a passé la vérification KYC
   */
  kyc_verified: boolean;
  
  /**
   * Date de dernière connexion
   */
  last_login?: string;
  
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
 * Interface pour la création d'un utilisateur
 */
export interface UserCreateData {
  /**
   * Prénom de l'utilisateur
   */
  first_name: string;
  
  /**
   * Nom de famille de l'utilisateur
   */
  last_name: string;
  
  /**
   * Adresse email de l'utilisateur
   */
  email: string;
  
  /**
   * Mot de passe en clair (sera haché côté serveur)
   */
  password: string;
  
  /**
   * Numéro de téléphone
   */
  phone?: string;
  
  /**
   * Rôle de l'utilisateur
   */
  role?: UserRole;
  
  /**
   * Identifiant du tenant (école)
   */
  tenant_id?: string;
}

/**
 * Interface pour l'authentification
 */
export interface AuthCredentials {
  /**
   * Email de l'utilisateur
   */
  email: string;
  
  /**
   * Mot de passe
   */
  password: string;
  
  /**
   * Sous-domaine de l'école (optionnel)
   */
  subdomain?: string;
}
