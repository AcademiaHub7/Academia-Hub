/**
 * Tests unitaires pour le service de permissions
 * @module __tests__/services/auth/permissionService
 */

import { permissionService, Permission } from '../../../services/auth/permissionService';
import { authService } from '../../../services/auth/authService';
import { User } from '../../../models/User';
import { UserRole } from '../../../types/common';

// Mock du service d'authentification
jest.mock('../../../services/auth/authService', () => ({
  authService: {
    getCurrentUser: jest.fn(),
    hasRole: jest.fn()
  }
}));

describe('Permission Service', () => {
  // Données de test
  const mockUserAdmin = {
    id: 'user-123',
    tenant_id: 'school-123',
    email: 'admin@example.com',
    first_name: 'Admin',
    last_name: 'User',
    role: UserRole.ADMIN
  };

  const mockUserTeacher = {
    id: 'user-456',
    tenant_id: 'school-123',
    email: 'teacher@example.com',
    first_name: 'Teacher',
    last_name: 'User',
    role: UserRole.TEACHER
  };

  const mockUserStudent = {
    id: 'user-789',
    tenant_id: 'school-123',
    email: 'student@example.com',
    first_name: 'Student',
    last_name: 'User',
    role: UserRole.STUDENT
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('roleHasPermission', () => {
    it('should check if admin role has specific permission', () => {
      expect(permissionService.roleHasPermission(UserRole.ADMIN, 'users:view')).toBe(true);
      expect(permissionService.roleHasPermission(UserRole.ADMIN, 'users:create')).toBe(true);
      expect(permissionService.roleHasPermission(UserRole.ADMIN, 'subscriptions:manage')).toBe(false);
    });

    it('should check if teacher role has specific permission', () => {
      expect(permissionService.roleHasPermission(UserRole.TEACHER, 'courses:view')).toBe(true);
      expect(permissionService.roleHasPermission(UserRole.TEACHER, 'courses:create')).toBe(true);
      expect(permissionService.roleHasPermission(UserRole.TEACHER, 'users:create')).toBe(false);
    });

    it('should check if student role has specific permission', () => {
      expect(permissionService.roleHasPermission(UserRole.STUDENT, 'courses:view')).toBe(true);
      expect(permissionService.roleHasPermission(UserRole.STUDENT, 'grades:view')).toBe(true);
      expect(permissionService.roleHasPermission(UserRole.STUDENT, 'grades:create')).toBe(false);
    });

    it('should return false for invalid role', () => {
      expect(permissionService.roleHasPermission('invalid-role' as UserRole, 'users:view')).toBe(false);
    });
  });

  describe('hasPermission', () => {
    it('should check if current user has specific permission', async () => {
      (authService.getCurrentUser as jest.Mock).mockResolvedValue(new User(mockUserAdmin));
      
      const result = await permissionService.hasPermission('users:create');
      
      expect(authService.getCurrentUser).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if user does not have permission', async () => {
      (authService.getCurrentUser as jest.Mock).mockResolvedValue(new User(mockUserTeacher));
      
      const result = await permissionService.hasPermission('users:create');
      
      expect(authService.getCurrentUser).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should return false if no current user', async () => {
      (authService.getCurrentUser as jest.Mock).mockResolvedValue(null);
      
      const result = await permissionService.hasPermission('users:create');
      
      expect(authService.getCurrentUser).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('hasAllPermissions', () => {
    it('should check if current user has all specified permissions', async () => {
      (authService.getCurrentUser as jest.Mock).mockResolvedValue(new User(mockUserAdmin));
      
      const result = await permissionService.hasAllPermissions(['dashboard:view', 'users:view']);
      
      expect(authService.getCurrentUser).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if user does not have all permissions', async () => {
      (authService.getCurrentUser as jest.Mock).mockResolvedValue(new User(mockUserTeacher));
      
      const result = await permissionService.hasAllPermissions(['dashboard:view', 'users:create']);
      
      expect(authService.getCurrentUser).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should return false if no current user', async () => {
      (authService.getCurrentUser as jest.Mock).mockResolvedValue(null);
      
      const result = await permissionService.hasAllPermissions(['dashboard:view', 'users:view']);
      
      expect(authService.getCurrentUser).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('hasAnyPermission', () => {
    it('should check if current user has any of specified permissions', async () => {
      (authService.getCurrentUser as jest.Mock).mockResolvedValue(new User(mockUserStudent));
      
      const result = await permissionService.hasAnyPermission(['users:create', 'courses:view']);
      
      expect(authService.getCurrentUser).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if user does not have any of the permissions', async () => {
      (authService.getCurrentUser as jest.Mock).mockResolvedValue(new User(mockUserStudent));
      
      const result = await permissionService.hasAnyPermission(['users:create', 'users:edit']);
      
      expect(authService.getCurrentUser).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should return false if no current user', async () => {
      (authService.getCurrentUser as jest.Mock).mockResolvedValue(null);
      
      const result = await permissionService.hasAnyPermission(['dashboard:view', 'users:view']);
      
      expect(authService.getCurrentUser).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('getPermissionsForRole', () => {
    it('should get all permissions for admin role', () => {
      const permissions = permissionService.getPermissionsForRole(UserRole.ADMIN);
      
      expect(permissions).toContain('dashboard:view');
      expect(permissions).toContain('users:create');
      expect(permissions).toContain('reports:generate');
      expect(permissions).not.toContain('subscriptions:manage');
    });

    it('should get all permissions for teacher role', () => {
      const permissions = permissionService.getPermissionsForRole(UserRole.TEACHER);
      
      expect(permissions).toContain('dashboard:view');
      expect(permissions).toContain('courses:create');
      expect(permissions).toContain('grades:edit');
      expect(permissions).not.toContain('users:create');
    });

    it('should return empty array for invalid role', () => {
      const permissions = permissionService.getPermissionsForRole('invalid-role' as UserRole);
      
      expect(permissions).toEqual([]);
    });
  });

  describe('getCurrentUserPermissions', () => {
    it('should get permissions for current user', async () => {
      (authService.getCurrentUser as jest.Mock).mockResolvedValue(new User(mockUserAdmin));
      
      const permissions = await permissionService.getCurrentUserPermissions();
      
      expect(authService.getCurrentUser).toHaveBeenCalled();
      expect(permissions).toContain('dashboard:view');
      expect(permissions).toContain('users:create');
      expect(permissions).not.toContain('subscriptions:manage');
    });

    it('should return empty array if no current user', async () => {
      (authService.getCurrentUser as jest.Mock).mockResolvedValue(null);
      
      const permissions = await permissionService.getCurrentUserPermissions();
      
      expect(authService.getCurrentUser).toHaveBeenCalled();
      expect(permissions).toEqual([]);
    });
  });

  describe('Role-specific checks', () => {
    it('should check if current user is promoter', async () => {
      (authService.hasRole as jest.Mock).mockResolvedValue(true);
      
      const result = await permissionService.isPromoter();
      
      expect(authService.hasRole).toHaveBeenCalledWith(UserRole.PROMOTER);
      expect(result).toBe(true);
    });

    it('should check if current user is admin', async () => {
      (authService.hasRole as jest.Mock).mockResolvedValue(true);
      
      const result = await permissionService.isAdmin();
      
      expect(authService.hasRole).toHaveBeenCalledWith(UserRole.ADMIN);
      expect(result).toBe(true);
    });

    it('should check if current user is teacher', async () => {
      (authService.hasRole as jest.Mock).mockResolvedValue(true);
      
      const result = await permissionService.isTeacher();
      
      expect(authService.hasRole).toHaveBeenCalledWith(UserRole.TEACHER);
      expect(result).toBe(true);
    });

    it('should check if current user is staff', async () => {
      (authService.hasRole as jest.Mock).mockResolvedValue(false);
      
      const result = await permissionService.isStaff();
      
      expect(authService.hasRole).toHaveBeenCalledWith(UserRole.STAFF);
      expect(result).toBe(false);
    });

    it('should check if current user is student', async () => {
      (authService.hasRole as jest.Mock).mockResolvedValue(true);
      
      const result = await permissionService.isStudent();
      
      expect(authService.hasRole).toHaveBeenCalledWith(UserRole.STUDENT);
      expect(result).toBe(true);
    });

    it('should check if current user is parent', async () => {
      (authService.hasRole as jest.Mock).mockResolvedValue(false);
      
      const result = await permissionService.isParent();
      
      expect(authService.hasRole).toHaveBeenCalledWith(UserRole.PARENT);
      expect(result).toBe(false);
    });
  });
});
