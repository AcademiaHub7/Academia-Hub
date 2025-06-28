/**
 * Tests unitaires pour le modèle User
 * @module __tests__/models/User
 */

import { User } from '../../models/User';
import { School } from '../../models/School';
import { UserRole, UserStatus, SchoolStatus, KycStatus, PaymentStatus } from '../../types/common';
import { api } from '../../services/api/client';

// Mock du client API
jest.mock('../../services/api/client', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }
}));

describe('User Model', () => {
  // Données de test
  const mockUserData = {
    id: 'user-123',
    tenant_id: 'school-123',
    email: 'user@example.com',
    password: 'hashed_password',
    first_name: 'John',
    last_name: 'Doe',
    phone: '+22997123456',
    role: UserRole.TEACHER,
    status: UserStatus.ACTIVE,
    kyc_verified: true,
    last_login: '2023-01-01T12:00:00Z',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  };

  const mockSchoolData = {
    id: 'school-123',
    name: 'École Test',
    subdomain: 'ecole-test',
    status: SchoolStatus.ACTIVE,
    subscription_plan_id: 'plan-123',
    payment_status: PaymentStatus.COMPLETED,
    kyc_status: KycStatus.VERIFIED,
    settings: null,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create a User instance with correct properties', () => {
      const user = new User(mockUserData);
      
      expect(user.id).toBe(mockUserData.id);
      expect(user.tenant_id).toBe(mockUserData.tenant_id);
      expect(user.email).toBe(mockUserData.email);
      expect(user.password).toBe(mockUserData.password);
      expect(user.first_name).toBe(mockUserData.first_name);
      expect(user.last_name).toBe(mockUserData.last_name);
      expect(user.phone).toBe(mockUserData.phone);
      expect(user.role).toBe(mockUserData.role);
      expect(user.status).toBe(mockUserData.status);
      expect(user.kyc_verified).toBe(mockUserData.kyc_verified);
      expect(user.last_login).toBe(mockUserData.last_login);
      expect(user.created_at).toBe(mockUserData.created_at);
      expect(user.updated_at).toBe(mockUserData.updated_at);
    });
  });

  describe('Static Methods', () => {
    it('should find a user by ID', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: mockUserData }
      });

      const user = await User.findById('user-123');
      
      expect(api.get).toHaveBeenCalledWith('/users/user-123');
      expect(user).toBeInstanceOf(User);
      expect(user?.id).toBe('user-123');
    });

    it('should return null when user not found by ID', async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error('Not found'));

      const user = await User.findById('non-existent');
      
      expect(api.get).toHaveBeenCalledWith('/users/non-existent');
      expect(user).toBeNull();
    });

    it('should find a user by email', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: mockUserData }
      });

      const user = await User.findByEmail('user@example.com');
      
      expect(api.get).toHaveBeenCalledWith('/users/email/user@example.com');
      expect(user).toBeInstanceOf(User);
      expect(user?.email).toBe('user@example.com');
    });

    it('should find users by tenant ID', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: [mockUserData] }
      });

      const users = await User.findByTenantId('school-123');
      
      expect(api.get).toHaveBeenCalledWith('/tenants/school-123/users', {
        params: { page: 1, limit: 100 }
      });
      expect(users).toHaveLength(1);
      expect(users[0]).toBeInstanceOf(User);
      expect(users[0].tenant_id).toBe('school-123');
    });

    it('should find users by tenant ID and role', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: [mockUserData] }
      });

      const users = await User.findByTenantIdAndRole('school-123', UserRole.TEACHER);
      
      expect(api.get).toHaveBeenCalledWith('/tenants/school-123/users', {
        params: { page: 1, limit: 100, role: UserRole.TEACHER }
      });
      expect(users).toHaveLength(1);
      expect(users[0].role).toBe(UserRole.TEACHER);
    });

    it('should find active users by tenant ID', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: [mockUserData] }
      });

      const users = await User.findActiveByTenantId('school-123');
      
      expect(api.get).toHaveBeenCalledWith('/tenants/school-123/users', {
        params: { page: 1, limit: 100, status: UserStatus.ACTIVE }
      });
      expect(users).toHaveLength(1);
    });

    it('should create a new user', async () => {
      const newUserData = {
        tenant_id: 'school-123',
        email: 'new@example.com',
        password: 'password123',
        first_name: 'Jane',
        last_name: 'Smith',
        role: UserRole.STUDENT,
        status: UserStatus.ACTIVE,
        kyc_verified: false
      };

      (api.post as jest.Mock).mockResolvedValue({
        data: { 
          data: { 
            ...newUserData, 
            id: 'new-user-123',
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z'
          } 
        }
      });

      const user = await User.create(newUserData);
      
      expect(api.post).toHaveBeenCalledWith('/users', newUserData);
      expect(user).toBeInstanceOf(User);
      expect(user?.id).toBe('new-user-123');
      expect(user?.email).toBe('new@example.com');
    });

    it('should create a promoter with a new school', async () => {
      const userData = {
        tenant_id: 'school-123',
        email: 'promoter@example.com',
        password: 'password123',
        first_name: 'Promoter',
        last_name: 'User',
        kyc_verified: false,
        status: UserStatus.ACTIVE
      };

      const schoolData = {
        name: 'Nouvelle École',
        subdomain: 'nouvelle-ecole',
        type: 'primary',
        address: '123 Main St'
      };

      const responseData = {
        user: {
          ...userData,
          id: 'promoter-123',
          role: UserRole.PROMOTER,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        },
        school: {
          ...mockSchoolData,
          name: schoolData.name,
          subdomain: schoolData.subdomain
        }
      };

      (api.post as jest.Mock).mockResolvedValue({
        data: { data: responseData }
      });

      const result = await User.createPromoterWithSchool(userData, schoolData);
      
      expect(api.post).toHaveBeenCalledWith('/register/school', {
        user: { ...userData, role: UserRole.PROMOTER },
        school: schoolData
      });
      expect(result?.user).toBeInstanceOf(User);
      expect(result?.school).toBeInstanceOf(School);
      expect(result?.user.role).toBe(UserRole.PROMOTER);
      expect(result?.school.name).toBe('Nouvelle École');
    });
  });

  describe('Instance Methods', () => {
    let user: User;

    beforeEach(() => {
      user = new User(mockUserData);
    });

    it('should update user properties', async () => {
      const updateData = {
        first_name: 'Johnny',
        phone: '+22998123456'
      };

      (api.put as jest.Mock).mockResolvedValue({
        data: { 
          data: { 
            ...mockUserData, 
            ...updateData,
            updated_at: '2023-01-02T00:00:00Z'
          } 
        }
      });

      const updatedUser = await user.update(updateData);
      
      expect(api.put).toHaveBeenCalledWith('/users/user-123', updateData);
      expect(updatedUser).toBe(user); // Même instance
      expect(updatedUser?.first_name).toBe('Johnny');
      expect(updatedUser?.phone).toBe('+22998123456');
      expect(updatedUser?.updated_at).toBe('2023-01-02T00:00:00Z');
    });

    it('should update user status', async () => {
      (api.put as jest.Mock).mockResolvedValue({
        data: { 
          data: { 
            ...mockUserData, 
            status: UserStatus.INACTIVE,
            updated_at: '2023-01-02T00:00:00Z'
          } 
        }
      });

      const updatedUser = await user.updateStatus(UserStatus.INACTIVE);
      
      expect(api.put).toHaveBeenCalledWith('/users/user-123/status', { status: UserStatus.INACTIVE });
      expect(updatedUser?.status).toBe(UserStatus.INACTIVE);
    });

    it('should update KYC status', async () => {
      (api.put as jest.Mock).mockResolvedValue({
        data: { 
          data: { 
            ...mockUserData, 
            kyc_verified: false,
            updated_at: '2023-01-02T00:00:00Z'
          } 
        }
      });

      const updatedUser = await user.updateKycStatus(false);
      
      expect(api.put).toHaveBeenCalledWith('/users/user-123/kyc-status', { kyc_verified: false });
      expect(updatedUser?.kyc_verified).toBe(false);
    });

    it('should delete a user', async () => {
      (api.delete as jest.Mock).mockResolvedValue({});

      const result = await user.delete();
      
      expect(api.delete).toHaveBeenCalledWith('/users/user-123');
      expect(result).toBe(true);
      expect(user.status).toBe(UserStatus.INACTIVE);
    });

    it('should check if user has a specific role', () => {
      expect(user.hasRole(UserRole.TEACHER)).toBe(true);
      expect(user.hasRole(UserRole.ADMIN)).toBe(false);
    });

    it('should check role-specific methods', () => {
      user.role = UserRole.PROMOTER;
      expect(user.isPromoter()).toBe(true);
      expect(user.isAdmin()).toBe(false);
      
      user.role = UserRole.ADMIN;
      expect(user.isPromoter()).toBe(false);
      expect(user.isAdmin()).toBe(true);
      
      user.role = UserRole.TEACHER;
      expect(user.isTeacher()).toBe(true);
      
      user.role = UserRole.STUDENT;
      expect(user.isStudent()).toBe(true);
      
      user.role = UserRole.PARENT;
      expect(user.isParent()).toBe(true);
      
      user.role = UserRole.STAFF;
      expect(user.isStaff()).toBe(true);
    });

    it('should check if user is active', () => {
      expect(user.isActive()).toBe(true);
      
      user.status = UserStatus.INACTIVE;
      expect(user.isActive()).toBe(false);
    });

    it('should check if user is KYC verified', () => {
      expect(user.isKycVerified()).toBe(true);
      
      user.kyc_verified = false;
      expect(user.isKycVerified()).toBe(false);
    });

    it('should get full name', () => {
      expect(user.getFullName()).toBe('John Doe');
    });
  });

  describe('Relations', () => {
    let user: User;

    beforeEach(() => {
      user = new User(mockUserData);
      
      // Mock des imports dynamiques
      jest.mock('../../models/School', () => ({
        __esModule: true,
        default: {
          findById: jest.fn().mockResolvedValue(new School(mockSchoolData))
        }
      }));
    });

    it('should get the school of the user', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: mockSchoolData }
      });

      const school = await user.getSchool();
      
      expect(api.get).toHaveBeenCalledWith('/schools/school-123');
      expect(school).toBeInstanceOf(School);
      expect(school?.id).toBe('school-123');
    });
  });
});
