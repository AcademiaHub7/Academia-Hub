/**
 * Service pour la gestion des permissions et des rôles
 * @module services/auth/permissionService
 */

import { UserRole } from '../../types/common';
import { User } from '../../models/User';
import { authService } from './authService';

/**
 * Type pour les permissions du système
 */
export type Permission = 
  // Permissions générales
  | 'dashboard:view'
  | 'profile:edit'
  
  // Permissions école
  | 'school:view'
  | 'school:edit'
  | 'school:settings'
  | 'school:kyc'
  
  // Permissions utilisateurs
  | 'users:view'
  | 'users:create'
  | 'users:edit'
  | 'users:delete'
  
  // Permissions abonnements
  | 'subscriptions:view'
  | 'subscriptions:manage'
  | 'payments:view'
  | 'payments:process'
  
  // Permissions académiques
  | 'classes:view'
  | 'classes:create'
  | 'classes:edit'
  | 'classes:delete'
  | 'courses:view'
  | 'courses:create'
  | 'courses:edit'
  | 'courses:delete'
  | 'grades:view'
  | 'grades:create'
  | 'grades:edit'
  
  // Permissions communications
  | 'messages:view'
  | 'messages:send'
  | 'announcements:view'
  | 'announcements:create'
  
  // Permissions rapports
  | 'reports:view'
  | 'reports:generate'
  | 'statistics:view';

/**
 * Définition des permissions par rôle
 */
const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.PROMOTER]: [
    // Accès complet au système
    'dashboard:view', 'profile:edit',
    'school:view', 'school:edit', 'school:settings', 'school:kyc',
    'users:view', 'users:create', 'users:edit', 'users:delete',
    'subscriptions:view', 'subscriptions:manage', 'payments:view', 'payments:process',
    'classes:view', 'classes:create', 'classes:edit', 'classes:delete',
    'courses:view', 'courses:create', 'courses:edit', 'courses:delete',
    'grades:view', 'grades:create', 'grades:edit',
    'messages:view', 'messages:send', 'announcements:view', 'announcements:create',
    'reports:view', 'reports:generate', 'statistics:view'
  ],
  
  [UserRole.ADMIN]: [
    // Accès administratif, sans gestion d'abonnement
    'dashboard:view', 'profile:edit',
    'school:view', 'school:edit', 'school:settings',
    'users:view', 'users:create', 'users:edit', 'users:delete',
    'subscriptions:view', 'payments:view',
    'classes:view', 'classes:create', 'classes:edit', 'classes:delete',
    'courses:view', 'courses:create', 'courses:edit', 'courses:delete',
    'grades:view', 'grades:create', 'grades:edit',
    'messages:view', 'messages:send', 'announcements:view', 'announcements:create',
    'reports:view', 'reports:generate', 'statistics:view'
  ],
  
  [UserRole.TEACHER]: [
    // Accès pédagogique
    'dashboard:view', 'profile:edit',
    'classes:view',
    'courses:view', 'courses:create', 'courses:edit',
    'grades:view', 'grades:create', 'grades:edit',
    'messages:view', 'messages:send', 'announcements:view', 'announcements:create',
    'reports:view'
  ],
  
  [UserRole.STAFF]: [
    // Accès administratif limité
    'dashboard:view', 'profile:edit',
    'school:view',
    'users:view',
    'classes:view',
    'courses:view',
    'grades:view',
    'messages:view', 'messages:send', 'announcements:view',
    'reports:view'
  ],
  
  [UserRole.STUDENT]: [
    // Accès étudiant
    'dashboard:view', 'profile:edit',
    'classes:view',
    'courses:view',
    'grades:view',
    'messages:view', 'messages:send',
    'announcements:view'
  ],
  
  [UserRole.PARENT]: [
    // Accès parent
    'dashboard:view', 'profile:edit',
    'classes:view',
    'courses:view',
    'grades:view',
    'messages:view', 'messages:send',
    'announcements:view'
  ]
};

/**
 * Service pour la gestion des permissions et des rôles
 */
export const permissionService = {
  /**
   * Vérifie si un rôle a une permission spécifique
   * @param role - Rôle à vérifier
   * @param permission - Permission à vérifier
   * @returns boolean
   */
  roleHasPermission(role: UserRole, permission: Permission): boolean {
    return rolePermissions[role]?.includes(permission) || false;
  },

  /**
   * Vérifie si l'utilisateur courant a une permission spécifique
   * @param permission - Permission à vérifier
   * @returns Promise<boolean>
   */
  async hasPermission(permission: Permission): Promise<boolean> {
    const user = await authService.getCurrentUser();
    
    if (!user) {
      return false;
    }
    
    return this.roleHasPermission(user.role, permission);
  },

  /**
   * Vérifie si l'utilisateur courant a toutes les permissions spécifiées
   * @param permissions - Liste de permissions à vérifier
   * @returns Promise<boolean>
   */
  async hasAllPermissions(permissions: Permission[]): Promise<boolean> {
    const user = await authService.getCurrentUser();
    
    if (!user) {
      return false;
    }
    
    return permissions.every(permission => this.roleHasPermission(user.role, permission));
  },

  /**
   * Vérifie si l'utilisateur courant a au moins une des permissions spécifiées
   * @param permissions - Liste de permissions à vérifier
   * @returns Promise<boolean>
   */
  async hasAnyPermission(permissions: Permission[]): Promise<boolean> {
    const user = await authService.getCurrentUser();
    
    if (!user) {
      return false;
    }
    
    return permissions.some(permission => this.roleHasPermission(user.role, permission));
  },

  /**
   * Obtient toutes les permissions d'un rôle spécifique
   * @param role - Rôle
   * @returns Permission[]
   */
  getPermissionsForRole(role: UserRole): Permission[] {
    return rolePermissions[role] || [];
  },

  /**
   * Obtient toutes les permissions de l'utilisateur courant
   * @returns Promise<Permission[]>
   */
  async getCurrentUserPermissions(): Promise<Permission[]> {
    const user = await authService.getCurrentUser();
    
    if (!user) {
      return [];
    }
    
    return this.getPermissionsForRole(user.role);
  },

  /**
   * Vérifie si l'utilisateur courant est un promoteur
   * @returns Promise<boolean>
   */
  async isPromoter(): Promise<boolean> {
    return authService.hasRole(UserRole.PROMOTER);
  },

  /**
   * Vérifie si l'utilisateur courant est un administrateur
   * @returns Promise<boolean>
   */
  async isAdmin(): Promise<boolean> {
    return authService.hasRole(UserRole.ADMIN);
  },

  /**
   * Vérifie si l'utilisateur courant est un enseignant
   * @returns Promise<boolean>
   */
  async isTeacher(): Promise<boolean> {
    return authService.hasRole(UserRole.TEACHER);
  },

  /**
   * Vérifie si l'utilisateur courant est un membre du personnel
   * @returns Promise<boolean>
   */
  async isStaff(): Promise<boolean> {
    return authService.hasRole(UserRole.STAFF);
  },

  /**
   * Vérifie si l'utilisateur courant est un étudiant
   * @returns Promise<boolean>
   */
  async isStudent(): Promise<boolean> {
    return authService.hasRole(UserRole.STUDENT);
  },

  /**
   * Vérifie si l'utilisateur courant est un parent
   * @returns Promise<boolean>
   */
  async isParent(): Promise<boolean> {
    return authService.hasRole(UserRole.PARENT);
  }
};

export default permissionService;
