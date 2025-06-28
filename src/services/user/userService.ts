/**
 * Service pour la gestion des utilisateurs
 * @module services/user/userService
 */

import { api } from '../api/client';
import { User, UserCreateData } from '../../types/user';

/**
 * Interface pour les réponses API des utilisateurs
 */
interface UserResponse {
  data: User;
  message: string;
}

/**
 * Interface pour les réponses API de liste d'utilisateurs
 */
interface UserListResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  message: string;
}

/**
 * Service pour la gestion des utilisateurs
 */
export const userService = {
  /**
   * Récupère un utilisateur par son ID
   * @param id - ID de l'utilisateur
   * @returns Promesse avec les données de l'utilisateur
   */
  async getUserById(id: string): Promise<User> {
    const response = await api.get<UserResponse>(`/users/${id}`);
    return response.data;
  },

  /**
   * Récupère un utilisateur par son email
   * @param email - Email de l'utilisateur
   * @returns Promesse avec les données de l'utilisateur
   */
  async getUserByEmail(email: string): Promise<User> {
    const response = await api.get<UserResponse>(`/users/email/${email}`);
    return response.data;
  },

  /**
   * Crée un nouvel utilisateur
   * @param userData - Données de l'utilisateur à créer
   * @returns Promesse avec les données de l'utilisateur créé
   */
  async createUser(userData: UserCreateData): Promise<User> {
    const response = await api.post<UserResponse>('/users', userData);
    return response.data;
  },

  /**
   * Met à jour un utilisateur
   * @param id - ID de l'utilisateur
   * @param userData - Données de l'utilisateur à mettre à jour
   * @returns Promesse avec les données de l'utilisateur mis à jour
   */
  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await api.put<UserResponse>(`/users/${id}`, userData);
    return response.data;
  },

  /**
   * Change le statut d'un utilisateur
   * @param id - ID de l'utilisateur
   * @param status - Nouveau statut
   * @returns Promesse avec les données de l'utilisateur mis à jour
   */
  async updateUserStatus(id: string, status: User['status']): Promise<User> {
    const response = await api.put<UserResponse>(`/users/${id}/status`, { status });
    return response.data;
  },

  /**
   * Met à jour le statut de vérification KYC d'un utilisateur
   * @param id - ID de l'utilisateur
   * @param kycVerified - Nouveau statut de vérification KYC
   * @returns Promesse avec les données de l'utilisateur mis à jour
   */
  async updateKycStatus(id: string, kycVerified: boolean): Promise<User> {
    const response = await api.put<UserResponse>(`/users/${id}/kyc-status`, { kyc_verified: kycVerified });
    return response.data;
  },

  /**
   * Liste les utilisateurs d'un tenant spécifique
   * @param tenantId - ID du tenant (école)
   * @param page - Numéro de page
   * @param limit - Limite par page
   * @param role - Filtre optionnel par rôle
   * @returns Promesse avec la liste des utilisateurs
   */
  async listUsersByTenant(tenantId: string, page = 1, limit = 10, role?: string): Promise<UserListResponse> {
    const params: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
    };
    
    if (role) {
      params.role = role;
    }
    
    return api.get<UserListResponse>(`/tenants/${tenantId}/users`, { params });
  },

  /**
   * Supprime un utilisateur (désactivation logique)
   * @param id - ID de l'utilisateur
   * @returns Promesse avec message de confirmation
   */
  async deleteUser(id: string): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/users/${id}`);
  },

  /**
   * Vérifie si le mot de passe fourni correspond à celui de l'utilisateur
   * @param id - ID de l'utilisateur
   * @param password - Mot de passe à vérifier
   * @returns Promesse avec un booléen indiquant si le mot de passe est valide
   */
  async verifyUserPassword(id: string, password: string): Promise<boolean> {
    try {
      const response = await api.post<{ valid: boolean }>('/auth/verify-password', { id, password });
      return response.valid;
    } catch (error) {
      console.error('Erreur lors de la vérification du mot de passe:', error);
      return false;
    }
  },

  /**
   * Met à jour le mot de passe d'un utilisateur
   * @param id - ID de l'utilisateur
   * @param newPassword - Nouveau mot de passe
   * @returns Promesse avec les données de l'utilisateur mis à jour
   */
  async updateUserPassword(id: string, newPassword: string): Promise<User> {
    const response = await api.put<UserResponse>(`/users/${id}/password`, { password: newPassword });
    return response.data;
  },

  /**
   * Récupère les permissions d'un utilisateur
   * @param userId - ID de l'utilisateur
   * @returns Promesse avec la liste des permissions
   */
  async getUserPermissions(userId: string): Promise<string[]> {
    try {
      const response = await api.get<{ data: string[] }>(`/users/${userId}/permissions`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des permissions:', error);
      return [];
    }
  },
};
