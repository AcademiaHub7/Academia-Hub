/**
 * Service pour la gestion de l'authentification multi-tenant
 * @module services/auth/authService
 */

import { api } from '../api/client';
import { User } from '../../models/User';
import { School } from '../../models/School';
import { AuthCredentials } from '../../types/user';
import { UserRole, SchoolStatus } from '../../types/common';
import { TenantAware } from '../../traits/TenantAware';

/**
 * Interface pour la réponse d'authentification
 */
interface AuthResponse {
  user: User;
  token: string;
  school?: School;
  expires_at: string;
}

/**
 * Service pour la gestion de l'authentification multi-tenant
 */
export const authService = {
  /**
   * Authentifie un utilisateur
   * @param credentials - Identifiants de connexion
   * @returns Promise<AuthResponse>
   */
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await api.post<{ data: AuthResponse }>('/auth/login', credentials);
    
    const authData = response.data;
    
    // Stocker le token JWT
    localStorage.setItem('auth_token', authData.token);
    localStorage.setItem('auth_expires_at', authData.expires_at);
    
    // Si nous avons des informations sur l'école, stocker l'ID du tenant
    if (authData.school) {
      TenantAware.setCurrentTenantId(authData.school.id);
    }
    
    return authData;
  },

  /**
   * Authentifie un utilisateur via le sous-domaine de l'école
   * @param email - Email de l'utilisateur
   * @param password - Mot de passe
   * @returns Promise<AuthResponse>
   */
  async loginBySubdomain(email: string, password: string): Promise<AuthResponse> {
    // Récupérer le sous-domaine actuel
    const subdomain = TenantAware.getCurrentSubdomain();
    
    if (!subdomain) {
      throw new Error('Aucun sous-domaine détecté');
    }
    
    return this.login({ email, password, subdomain });
  },

  /**
   * Déconnecte l'utilisateur courant
   * @returns Promise<void>
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyer les données d'authentification locales
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_expires_at');
      TenantAware.clearCurrentTenantId();
    }
  },

  /**
   * Récupère l'utilisateur actuellement authentifié
   * @returns Promise<User | null>
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<{ data: User }>('/auth/me');
      return new User(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur courant:', error);
      return null;
    }
  },

  /**
   * Récupère l'école (tenant) de l'utilisateur actuellement authentifié
   * @returns Promise<School | null>
   */
  async getCurrentSchool(): Promise<School | null> {
    const tenantId = TenantAware.getCurrentTenantId();
    
    if (!tenantId) {
      return null;
    }
    
    try {
      return await School.findById(tenantId);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'école courante:', error);
      return null;
    }
  },

  /**
   * Vérifie si l'utilisateur est authentifié
   * @returns boolean
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    const expiresAt = localStorage.getItem('auth_expires_at');
    
    if (!token || !expiresAt) {
      return false;
    }
    
    // Vérifier si le token n'est pas expiré
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    
    return now < expiryDate;
  },

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   * @param role - Rôle à vérifier
   * @returns Promise<boolean>
   */
  async hasRole(role: UserRole): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user ? user.hasRole(role) : false;
  },

  /**
   * Vérifie si l'école (tenant) actuelle est active
   * @returns Promise<boolean>
   */
  async isSchoolActive(): Promise<boolean> {
    const school = await this.getCurrentSchool();
    return school ? school.isActive() : false;
  },

  /**
   * Vérifie si l'école (tenant) actuelle a un abonnement actif
   * @returns Promise<boolean>
   */
  async hasActiveSubscription(): Promise<boolean> {
    const school = await this.getCurrentSchool();
    return school ? await school.hasActiveSubscription() : false;
  },

  /**
   * Envoie un email de réinitialisation de mot de passe
   * @param email - Email de l'utilisateur
   * @param subdomain - Sous-domaine de l'école (optionnel)
   * @returns Promise<{ message: string }>
   */
  async forgotPassword(email: string, subdomain?: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/forgot-password', {
      email,
      subdomain
    });
    
    return response.data;
  },

  /**
   * Réinitialise le mot de passe d'un utilisateur
   * @param token - Token de réinitialisation
   * @param password - Nouveau mot de passe
   * @returns Promise<{ message: string }>
   */
  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/reset-password', {
      token,
      password
    });
    
    return response.data;
  },

  /**
   * Change le mot de passe de l'utilisateur courant
   * @param currentPassword - Mot de passe actuel
   * @param newPassword - Nouveau mot de passe
   * @returns Promise<{ message: string }>
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword
    });
    
    return response.data;
  }
};

export default authService;
