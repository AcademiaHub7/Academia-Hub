/**
 * Tests unitaires pour le modèle School
 * @module __tests__/models/School
 */

import { School } from '../../models/School';
import { User } from '../../models/User';
import { Subscription } from '../../models/Subscription';
import { SchoolStatus, KycStatus, PaymentStatus, UserRole } from '../../types/common';
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

describe('School Model', () => {
  // Données de test
  const mockSchoolData = {
    id: 'school-123',
    name: 'École Test',
    subdomain: 'ecole-test',
    status: SchoolStatus.ACTIVE,
    subscription_plan_id: 'plan-123',
    payment_status: PaymentStatus.COMPLETED,
    kyc_status: KycStatus.VERIFIED,
    settings: {
      logo_url: 'https://example.com/logo.png',
      theme_color: '#00FF00',
      contact_email: 'contact@ecole-test.com',
      enable_online_payment: true
    },
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-02T00:00:00Z'
  };

  const mockUserData = {
    id: 'user-123',
    tenant_id: 'school-123',
    email: 'admin@ecole-test.com',
    first_name: 'Admin',
    last_name: 'Test',
    role: UserRole.ADMIN,
    status: 'active',
    kyc_verified: true,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  };

  const mockSubscriptionData = {
    id: 'subscription-123',
    tenant_id: 'school-123',
    plan_id: 'plan-123',
    status: 'active',
    start_date: '2023-01-01T00:00:00Z',
    end_date: '2024-01-01T00:00:00Z',
    trial_ends_at: null,
    fedapay_transaction_id: 'transaction-123',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create a School instance with correct properties', () => {
      const school = new School(mockSchoolData);
      
      expect(school.id).toBe(mockSchoolData.id);
      expect(school.name).toBe(mockSchoolData.name);
      expect(school.subdomain).toBe(mockSchoolData.subdomain);
      expect(school.status).toBe(mockSchoolData.status);
      expect(school.subscription_plan_id).toBe(mockSchoolData.subscription_plan_id);
      expect(school.payment_status).toBe(mockSchoolData.payment_status);
      expect(school.kyc_status).toBe(mockSchoolData.kyc_status);
      expect(school.settings).toEqual(mockSchoolData.settings);
      expect(school.created_at).toBe(mockSchoolData.created_at);
      expect(school.updated_at).toBe(mockSchoolData.updated_at);
    });
  });

  describe('Static Methods', () => {
    it('should find a school by ID', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: mockSchoolData }
      });

      const school = await School.findById('school-123');
      
      expect(api.get).toHaveBeenCalledWith('/schools/school-123');
      expect(school).toBeInstanceOf(School);
      expect(school?.id).toBe('school-123');
    });

    it('should return null when school not found by ID', async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error('Not found'));

      const school = await School.findById('non-existent');
      
      expect(api.get).toHaveBeenCalledWith('/schools/non-existent');
      expect(school).toBeNull();
    });

    it('should find a school by subdomain', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: mockSchoolData }
      });

      const school = await School.findBySubdomain('ecole-test');
      
      expect(api.get).toHaveBeenCalledWith('/schools/subdomain/ecole-test');
      expect(school).toBeInstanceOf(School);
      expect(school?.subdomain).toBe('ecole-test');
    });

    it('should find all schools with pagination', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: {
          data: [mockSchoolData],
          total: 1,
          page: 1,
          limit: 10
        }
      });

      const result = await School.findAll(1, 10);
      
      expect(api.get).toHaveBeenCalledWith('/schools', {
        params: { page: 1, limit: 10 }
      });
      expect(result.schools).toHaveLength(1);
      expect(result.schools[0]).toBeInstanceOf(School);
      expect(result.total).toBe(1);
    });

    it('should find active schools', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: {
          data: [mockSchoolData],
          total: 1,
          page: 1,
          limit: 10
        }
      });

      const result = await School.findActive();
      
      expect(api.get).toHaveBeenCalledWith('/schools', {
        params: { page: 1, limit: 10, status: SchoolStatus.ACTIVE }
      });
      expect(result.schools).toHaveLength(1);
    });

    it('should create a new school', async () => {
      const newSchoolData = {
        name: 'Nouvelle École',
        subdomain: 'nouvelle-ecole',
        status: SchoolStatus.PENDING_PAYMENT,
        subscription_plan_id: 'plan-123',
        payment_status: PaymentStatus.PENDING,
        kyc_status: KycStatus.PENDING,
        settings: null
      };

      (api.post as jest.Mock).mockResolvedValue({
        data: { 
          data: { 
            ...newSchoolData, 
            id: 'new-school-123',
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z'
          } 
        }
      });

      const school = await School.create(newSchoolData);
      
      expect(api.post).toHaveBeenCalledWith('/schools', newSchoolData);
      expect(school).toBeInstanceOf(School);
      expect(school?.id).toBe('new-school-123');
      expect(school?.name).toBe('Nouvelle École');
    });
  });

  describe('Instance Methods', () => {
    let school: School;

    beforeEach(() => {
      school = new School(mockSchoolData);
    });

    it('should update school properties', async () => {
      const updateData = {
        name: 'École Mise à Jour',
        settings: {
          ...mockSchoolData.settings,
          theme_color: '#FF0000'
        }
      };

      (api.put as jest.Mock).mockResolvedValue({
        data: { 
          data: { 
            ...mockSchoolData, 
            ...updateData,
            updated_at: '2023-01-03T00:00:00Z'
          } 
        }
      });

      const updatedSchool = await school.update(updateData);
      
      expect(api.put).toHaveBeenCalledWith('/schools/school-123', updateData);
      expect(updatedSchool).toBe(school); // Même instance
      expect(updatedSchool?.name).toBe('École Mise à Jour');
      expect(updatedSchool?.settings?.theme_color).toBe('#FF0000');
      expect(updatedSchool?.updated_at).toBe('2023-01-03T00:00:00Z');
    });

    it('should update school status', async () => {
      (api.put as jest.Mock).mockResolvedValue({
        data: { 
          data: { 
            ...mockSchoolData, 
            status: SchoolStatus.INACTIVE,
            updated_at: '2023-01-03T00:00:00Z'
          } 
        }
      });

      const updatedSchool = await school.updateStatus(SchoolStatus.INACTIVE);
      
      expect(api.put).toHaveBeenCalledWith('/schools/school-123/status', { status: SchoolStatus.INACTIVE });
      expect(updatedSchool?.status).toBe(SchoolStatus.INACTIVE);
    });

    it('should update KYC status', async () => {
      (api.put as jest.Mock).mockResolvedValue({
        data: { 
          data: { 
            ...mockSchoolData, 
            kyc_status: KycStatus.REJECTED,
            updated_at: '2023-01-03T00:00:00Z'
          } 
        }
      });

      const updatedSchool = await school.updateKycStatus(KycStatus.REJECTED);
      
      expect(api.put).toHaveBeenCalledWith('/schools/school-123/kyc-status', { kyc_status: KycStatus.REJECTED });
      expect(updatedSchool?.kyc_status).toBe(KycStatus.REJECTED);
    });

    it('should check if school is active', () => {
      expect(school.isActive()).toBe(true);
      
      school.status = SchoolStatus.INACTIVE;
      expect(school.isActive()).toBe(false);
    });

    it('should check if school is KYC verified', () => {
      expect(school.isKycVerified()).toBe(true);
      
      school.kyc_status = KycStatus.PENDING;
      expect(school.isKycVerified()).toBe(false);
    });

    it('should check if school has valid payment', () => {
      expect(school.hasValidPayment()).toBe(true);
      
      school.payment_status = PaymentStatus.FAILED;
      expect(school.hasValidPayment()).toBe(false);
    });
  });

  describe('Relations', () => {
    let school: School;

    beforeEach(() => {
      school = new School(mockSchoolData);
      
      // Mock des imports dynamiques
      jest.mock('../../models/User', () => ({
        __esModule: true,
        default: {
          findByTenantId: jest.fn().mockResolvedValue([mockUserData].map(data => new User(data)))
        }
      }));
      
      jest.mock('../../models/Subscription', () => ({
        __esModule: true,
        default: {
          findActiveByTenantId: jest.fn().mockResolvedValue(new Subscription(mockSubscriptionData))
        }
      }));
    });

    it('should get users of the school', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: [mockUserData] }
      });

      const users = await school.getUsers();
      
      expect(api.get).toHaveBeenCalledWith('/tenants/school-123/users', {
        params: { page: 1, limit: 100 }
      });
      expect(users).toHaveLength(1);
      expect(users[0].tenant_id).toBe('school-123');
    });

    it('should get active subscription', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: mockSubscriptionData }
      });

      const subscription = await school.getActiveSubscription();
      
      expect(api.get).toHaveBeenCalledWith('/tenants/school-123/active-subscription');
      expect(subscription?.tenant_id).toBe('school-123');
    });

    it('should check if school has active subscription', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: mockSubscriptionData }
      });

      const hasActiveSubscription = await school.hasActiveSubscription();
      
      expect(hasActiveSubscription).toBe(true);
    });

    it('should get user count by role', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { 
          data: {
            [UserRole.ADMIN]: 2,
            [UserRole.TEACHER]: 10,
            [UserRole.STUDENT]: 50
          }
        }
      });

      const userCounts = await school.getUserCountByRole();
      
      expect(api.get).toHaveBeenCalledWith('/schools/school-123/user-stats');
      expect(userCounts[UserRole.ADMIN]).toBe(2);
      expect(userCounts[UserRole.TEACHER]).toBe(10);
      expect(userCounts[UserRole.STUDENT]).toBe(50);
    });
  });
});
