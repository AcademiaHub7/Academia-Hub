/**
 * Tests unitaires pour le service d'authentification multi-tenant
 * @module __tests__/services/auth/authService
 */

import { authService } from '../../../services/auth/authService';
import { api } from '../../../services/api/client';
import { User } from '../../../models/User';
import { School } from '../../../models/School';
import { UserRole, UserStatus, SchoolStatus } from '../../../types/common';
import { TenantAware } from '../../../traits/TenantAware';

// Mock du client API
jest.mock('../../../services/api/client', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }
}));

// Mock du localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock du TenantAware
jest.mock('../../../traits/TenantAware', () => ({
  TenantAware: {
    setCurrentTenantId: jest.fn(),
    getCurrentTenantId: jest.fn(),
    clearCurrentTenantId: jest.fn(),
    getCurrentSubdomain: jest.fn()
  }
}));

describe('Auth Service', () => {
  // Données de test
  const mockUserData = {
    id: 'user-123',
    tenant_id: 'school-123',
    email: 'user@example.com',
    first_name: 'John',
    last_name: 'Doe',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE
  };

  const mockSchoolData = {
    id: 'school-123',
    name: 'École Test',
    subdomain: 'ecole-test',
    status: SchoolStatus.ACTIVE
  };

  const mockAuthResponse = {
    user: mockUserData,
    token: 'jwt-token-123',
    school: mockSchoolData,
    expires_at: '2023-02-01T00:00:00Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  describe('login', () => {
    it('should authenticate user and store token', async () => {
      const credentials = {
        email: 'user@example.com',
        password: 'password123'
      };
      
      (api.post as jest.Mock).mockResolvedValue({
        data: mockAuthResponse
      });

      const result = await authService.login(credentials);
      
      expect(api.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual(mockAuthResponse);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_token', 'jwt-token-123');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_expires_at', '2023-02-01T00:00:00Z');
      expect(TenantAware.setCurrentTenantId).toHaveBeenCalledWith('school-123');
    });
  });

  describe('loginBySubdomain', () => {
    it('should authenticate user using subdomain', async () => {
      (TenantAware.getCurrentSubdomain as jest.Mock).mockReturnValue('ecole-test');
      
      (api.post as jest.Mock).mockResolvedValue({
        data: mockAuthResponse
      });

      const result = await authService.loginBySubdomain('user@example.com', 'password123');
      
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'user@example.com',
        password: 'password123',
        subdomain: 'ecole-test'
      });
      expect(result).toEqual(mockAuthResponse);
    });

    it('should throw error if no subdomain is detected', async () => {
      (TenantAware.getCurrentSubdomain as jest.Mock).mockReturnValue(null);
      
      await expect(authService.loginBySubdomain('user@example.com', 'password123'))
        .rejects.toThrow('Aucun sous-domaine détecté');
      
      expect(api.post).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should logout user and clear storage', async () => {
      (api.post as jest.Mock).mockResolvedValue({});

      await authService.logout();
      
      expect(api.post).toHaveBeenCalledWith('/auth/logout');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_expires_at');
      expect(TenantAware.clearCurrentTenantId).toHaveBeenCalled();
    });

    it('should clear storage even if API call fails', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('Network error'));

      await authService.logout();
      
      expect(api.post).toHaveBeenCalledWith('/auth/logout');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_expires_at');
      expect(TenantAware.clearCurrentTenantId).toHaveBeenCalled();
    });
  });

  describe('getCurrentUser', () => {
    it('should get current authenticated user', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: mockUserData }
      });

      const user = await authService.getCurrentUser();
      
      expect(api.get).toHaveBeenCalledWith('/auth/me');
      expect(user).toBeInstanceOf(User);
      expect(user?.id).toBe('user-123');
    });

    it('should return null if API call fails', async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error('Unauthorized'));

      const user = await authService.getCurrentUser();
      
      expect(api.get).toHaveBeenCalledWith('/auth/me');
      expect(user).toBeNull();
    });
  });

  describe('getCurrentSchool', () => {
    it('should get current school (tenant)', async () => {
      (TenantAware.getCurrentTenantId as jest.Mock).mockReturnValue('school-123');
      
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: mockSchoolData }
      });

      const school = await authService.getCurrentSchool();
      
      expect(TenantAware.getCurrentTenantId).toHaveBeenCalled();
      expect(api.get).toHaveBeenCalledWith('/schools/school-123');
      expect(school).toBeInstanceOf(School);
      expect(school?.id).toBe('school-123');
    });

    it('should return null if no tenant ID is set', async () => {
      (TenantAware.getCurrentTenantId as jest.Mock).mockReturnValue(null);
      
      const school = await authService.getCurrentSchool();
      
      expect(TenantAware.getCurrentTenantId).toHaveBeenCalled();
      expect(api.get).not.toHaveBeenCalled();
      expect(school).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if token exists and not expired', () => {
      // Date dans le futur
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      
      localStorageMock.setItem('auth_token', 'jwt-token-123');
      localStorageMock.setItem('auth_expires_at', futureDate.toISOString());
      
      const result = authService.isAuthenticated();
      
      expect(result).toBe(true);
    });

    it('should return false if token is expired', () => {
      // Date dans le passé
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      
      localStorageMock.setItem('auth_token', 'jwt-token-123');
      localStorageMock.setItem('auth_expires_at', pastDate.toISOString());
      
      const result = authService.isAuthenticated();
      
      expect(result).toBe(false);
    });

    it('should return false if token does not exist', () => {
      localStorageMock.removeItem('auth_token');
      localStorageMock.setItem('auth_expires_at', '2023-02-01T00:00:00Z');
      
      const result = authService.isAuthenticated();
      
      expect(result).toBe(false);
    });
  });

  describe('hasRole', () => {
    it('should check if current user has specific role', async () => {
      const mockUser = new User(mockUserData);
      jest.spyOn(authService, 'getCurrentUser').mockResolvedValue(mockUser);
      
      const result = await authService.hasRole(UserRole.ADMIN);
      
      expect(authService.getCurrentUser).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if user does not have role', async () => {
      const mockUser = new User(mockUserData);
      jest.spyOn(authService, 'getCurrentUser').mockResolvedValue(mockUser);
      
      const result = await authService.hasRole(UserRole.TEACHER);
      
      expect(authService.getCurrentUser).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should return false if no current user', async () => {
      jest.spyOn(authService, 'getCurrentUser').mockResolvedValue(null);
      
      const result = await authService.hasRole(UserRole.ADMIN);
      
      expect(authService.getCurrentUser).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('isSchoolActive', () => {
    it('should check if current school is active', async () => {
      const mockSchool = new School(mockSchoolData);
      jest.spyOn(authService, 'getCurrentSchool').mockResolvedValue(mockSchool);
      
      const result = await authService.isSchoolActive();
      
      expect(authService.getCurrentSchool).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if school is not active', async () => {
      const inactiveSchool = new School({
        ...mockSchoolData,
        status: SchoolStatus.INACTIVE
      });
      jest.spyOn(authService, 'getCurrentSchool').mockResolvedValue(inactiveSchool);
      
      const result = await authService.isSchoolActive();
      
      expect(authService.getCurrentSchool).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should return false if no current school', async () => {
      jest.spyOn(authService, 'getCurrentSchool').mockResolvedValue(null);
      
      const result = await authService.isSchoolActive();
      
      expect(authService.getCurrentSchool).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('hasActiveSubscription', () => {
    it('should check if current school has active subscription', async () => {
      const mockSchool = new School(mockSchoolData);
      jest.spyOn(authService, 'getCurrentSchool').mockResolvedValue(mockSchool);
      jest.spyOn(mockSchool, 'hasActiveSubscription').mockResolvedValue(true);
      
      const result = await authService.hasActiveSubscription();
      
      expect(authService.getCurrentSchool).toHaveBeenCalled();
      expect(mockSchool.hasActiveSubscription).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if no current school', async () => {
      jest.spyOn(authService, 'getCurrentSchool').mockResolvedValue(null);
      
      const result = await authService.hasActiveSubscription();
      
      expect(authService.getCurrentSchool).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('forgotPassword', () => {
    it('should send forgot password request', async () => {
      const responseMessage = { message: 'Email de réinitialisation envoyé' };
      
      (api.post as jest.Mock).mockResolvedValue({
        data: responseMessage
      });

      const result = await authService.forgotPassword('user@example.com');
      
      expect(api.post).toHaveBeenCalledWith('/auth/forgot-password', {
        email: 'user@example.com',
        subdomain: undefined
      });
      expect(result).toEqual(responseMessage);
    });

    it('should include subdomain if provided', async () => {
      const responseMessage = { message: 'Email de réinitialisation envoyé' };
      
      (api.post as jest.Mock).mockResolvedValue({
        data: responseMessage
      });

      const result = await authService.forgotPassword('user@example.com', 'ecole-test');
      
      expect(api.post).toHaveBeenCalledWith('/auth/forgot-password', {
        email: 'user@example.com',
        subdomain: 'ecole-test'
      });
      expect(result).toEqual(responseMessage);
    });
  });

  describe('resetPassword', () => {
    it('should reset password with token', async () => {
      const responseMessage = { message: 'Mot de passe réinitialisé avec succès' };
      
      (api.post as jest.Mock).mockResolvedValue({
        data: responseMessage
      });

      const result = await authService.resetPassword('reset-token-123', 'newpassword123');
      
      expect(api.post).toHaveBeenCalledWith('/auth/reset-password', {
        token: 'reset-token-123',
        password: 'newpassword123'
      });
      expect(result).toEqual(responseMessage);
    });
  });

  describe('changePassword', () => {
    it('should change password for current user', async () => {
      const responseMessage = { message: 'Mot de passe changé avec succès' };
      
      (api.post as jest.Mock).mockResolvedValue({
        data: responseMessage
      });

      const result = await authService.changePassword('currentpassword', 'newpassword123');
      
      expect(api.post).toHaveBeenCalledWith('/auth/change-password', {
        current_password: 'currentpassword',
        new_password: 'newpassword123'
      });
      expect(result).toEqual(responseMessage);
    });
  });
});
