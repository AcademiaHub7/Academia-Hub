/**
 * Modèle User - Représente un utilisateur dans le système
 * @module models/User
 */

import { UserRole, UserStatus } from '../types/common';
import { User as UserType } from '../types/user';
import { api } from '../services/api/client';
import { School } from './School';

/**
 * Classe modèle pour les utilisateurs
 * Implémente la logique métier et les relations
 */
export class User implements UserType {
  id: string;
  tenant_id: string;
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  kyc_verified: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;

  // Cache pour les relations
  private _school?: School;

  /**
   * Constructeur du modèle User
   * @param data - Données de l'utilisateur
   */
  constructor(data: UserType) {
    this.id = data.id;
    this.tenant_id = data.tenant_id;
    this.email = data.email;
    this.password = data.password;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.phone = data.phone;
    this.role = data.role;
    this.status = data.status;
    this.kyc_verified = data.kyc_verified;
    this.last_login = data.last_login;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  /**
   * Récupère un utilisateur par son ID
   * @param id - ID de l'utilisateur
   * @returns Promise<User | null>
   */
  static async findById(id: string): Promise<User | null> {
    try {
      const response = await api.get(`/users/${id}`);
      return new User(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  }

  /**
   * Récupère un utilisateur par son email
   * @param email - Email de l'utilisateur
   * @returns Promise<User | null>
   */
  static async findByEmail(email: string): Promise<User | null> {
    try {
      const response = await api.get(`/users/email/${email}`);
      return new User(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur par email:', error);
      return null;
    }
  }

  /**
   * Récupère les utilisateurs d'un tenant spécifique
   * @param tenantId - ID du tenant (école)
   * @param page - Numéro de page
   * @param limit - Limite par page
   * @returns Promise<User[]>
   */
  static async findByTenantId(tenantId: string, page = 1, limit = 100): Promise<User[]> {
    try {
      const response = await api.get(`/tenants/${tenantId}/users`, {
        params: { page, limit }
      });
      
      return response.data.data.map((user: UserType) => new User(user));
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs du tenant:', error);
      return [];
    }
  }

  /**
   * Scope: Utilisateurs par rôle dans un tenant spécifique
   * @param tenantId - ID du tenant (école)
   * @param role - Rôle des utilisateurs à récupérer
   * @param page - Numéro de page
   * @param limit - Limite par page
   * @returns Promise<User[]>
   */
  static async findByTenantIdAndRole(tenantId: string, role: UserRole, page = 1, limit = 100): Promise<User[]> {
    try {
      const response = await api.get(`/tenants/${tenantId}/users`, {
        params: { page, limit, role }
      });
      
      return response.data.data.map((user: UserType) => new User(user));
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs par rôle:', error);
      return [];
    }
  }

  /**
   * Scope: Utilisateurs actifs dans un tenant spécifique
   * @param tenantId - ID du tenant (école)
   * @param page - Numéro de page
   * @param limit - Limite par page
   * @returns Promise<User[]>
   */
  static async findActiveByTenantId(tenantId: string, page = 1, limit = 100): Promise<User[]> {
    try {
      const response = await api.get(`/tenants/${tenantId}/users`, {
        params: { page, limit, status: UserStatus.ACTIVE }
      });
      
      return response.data.data.map((user: UserType) => new User(user));
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs actifs:', error);
      return [];
    }
  }

  /**
   * Crée un nouvel utilisateur
   * @param data - Données de l'utilisateur à créer
   * @returns Promise<User | null>
   */
  static async create(data: Omit<UserType, 'id' | 'created_at' | 'updated_at'>): Promise<User | null> {
    try {
      const response = await api.post('/users', data);
      return new User(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      return null;
    }
  }

  /**
   * Crée un utilisateur promoteur avec une nouvelle école
   * @param userData - Données de l'utilisateur
   * @param schoolData - Données de l'école
   * @returns Promise<{ user: User, school: School } | null>
   */
  static async createPromoterWithSchool(
    userData: Omit<UserType, 'id' | 'role' | 'created_at' | 'updated_at'>, 
    schoolData: { name: string, subdomain: string, type: string, address: string }
  ): Promise<{ user: User, school: School } | null> {
    try {
      const response = await api.post('/register/school', {
        user: { ...userData, role: UserRole.PROMOTER },
        school: schoolData
      });
      
      return {
        user: new User(response.data.data.user),
        school: new School(response.data.data.school)
      };
    } catch (error) {
      console.error('Erreur lors de la création du promoteur et de l\'école:', error);
      return null;
    }
  }

  /**
   * Met à jour l'utilisateur
   * @param data - Données à mettre à jour
   * @returns Promise<User | null>
   */
  async update(data: Partial<UserType>): Promise<User | null> {
    try {
      const response = await api.put(`/users/${this.id}`, data);
      Object.assign(this, response.data.data);
      return this;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      return null;
    }
  }

  /**
   * Met à jour le statut de l'utilisateur
   * @param status - Nouveau statut
   * @returns Promise<User | null>
   */
  async updateStatus(status: UserStatus): Promise<User | null> {
    try {
      const response = await api.put(`/users/${this.id}/status`, { status });
      this.status = status;
      this.updated_at = response.data.data.updated_at;
      return this;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de l\'utilisateur:', error);
      return null;
    }
  }

  /**
   * Met à jour le statut KYC de l'utilisateur
   * @param kycVerified - Nouveau statut KYC
   * @returns Promise<User | null>
   */
  async updateKycStatus(kycVerified: boolean): Promise<User | null> {
    try {
      const response = await api.put(`/users/${this.id}/kyc-status`, { kyc_verified: kycVerified });
      this.kyc_verified = kycVerified;
      this.updated_at = response.data.data.updated_at;
      return this;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut KYC de l\'utilisateur:', error);
      return null;
    }
  }

  /**
   * Supprime l'utilisateur (désactivation logique)
   * @returns Promise<boolean>
   */
  async delete(): Promise<boolean> {
    try {
      await api.delete(`/users/${this.id}`);
      this.status = UserStatus.INACTIVE;
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      return false;
    }
  }

  /**
   * Récupère l'école (tenant) de l'utilisateur
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
      console.error('Erreur lors de la récupération de l\'école de l\'utilisateur:', error);
      return null;
    }
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   * @param role - Rôle à vérifier
   * @returns boolean
   */
  hasRole(role: UserRole): boolean {
    return this.role === role;
  }

  /**
   * Vérifie si l'utilisateur est un promoteur
   * @returns boolean
   */
  isPromoter(): boolean {
    return this.role === UserRole.PROMOTER;
  }

  /**
   * Vérifie si l'utilisateur est un administrateur
   * @returns boolean
   */
  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  /**
   * Vérifie si l'utilisateur est un enseignant
   * @returns boolean
   */
  isTeacher(): boolean {
    return this.role === UserRole.TEACHER;
  }

  /**
   * Vérifie si l'utilisateur est un élève
   * @returns boolean
   */
  isStudent(): boolean {
    return this.role === UserRole.STUDENT;
  }

  /**
   * Vérifie si l'utilisateur est un parent
   * @returns boolean
   */
  isParent(): boolean {
    return this.role === UserRole.PARENT;
  }

  /**
   * Vérifie si l'utilisateur est du personnel
   * @returns boolean
   */
  isStaff(): boolean {
    return this.role === UserRole.STAFF;
  }

  /**
   * Vérifie si l'utilisateur est actif
   * @returns boolean
   */
  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  /**
   * Vérifie si l'utilisateur a passé la vérification KYC
   * @returns boolean
   */
  isKycVerified(): boolean {
    return this.kyc_verified;
  }

  /**
   * Obtient le nom complet de l'utilisateur
   * @returns string
   */
  getFullName(): string {
    return `${this.first_name} ${this.last_name}`;
  }
}

export default User;
