/**
 * Tests unitaires pour le service d'inscription multi-étapes
 * @module __tests__/services/registration/registrationService
 */

import { registrationService } from '../../../services/registration/registrationService';
import { api } from '../../../services/api/client';
import { School } from '../../../models/School';
import { User } from '../../../models/User';
import { Subscription } from '../../../models/Subscription';
import { Plan } from '../../../models/Plan';
import { SchoolStatus, UserRole, KycStatus, PaymentStatus } from '../../../types/common';

// Mock du client API
jest.mock('../../../services/api/client', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }
}));

describe('Registration Service', () => {
  // Données de test
  const mockRegistrationSession = {
    id: 'session-123',
    step: 'promoter_info',
    data: {
      promoter: {
        email: 'promoter@example.com',
        first_name: 'John',
        last_name: 'Doe',
        phone: '+22997123456'
      },
      school: {
        name: 'École Test',
        subdomain: 'ecole-test',
        type: 'primary'
      }
    },
    expires_at: '2023-01-02T00:00:00Z',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  };

  const mockPlanData = {
    id: 'plan-123',
    name: 'Plan Premium',
    description: 'Plan premium avec toutes les fonctionnalités',
    price: 10000,
    billing_cycle: 'monthly',
    features: ['feature1', 'feature2', 'feature3'],
    is_active: true
  };

  const mockPaymentUrlData = {
    transaction_id: 'transaction-123',
    payment_url: 'https://fedapay.com/pay/transaction-123'
  };

  const mockSchoolData = {
    id: 'school-123',
    name: 'École Test',
    subdomain: 'ecole-test',
    status: SchoolStatus.PENDING_PAYMENT
  };

  const mockUserData = {
    id: 'user-123',
    tenant_id: 'school-123',
    email: 'promoter@example.com',
    first_name: 'John',
    last_name: 'Doe',
    role: UserRole.PROMOTER
  };

  const mockSubscriptionData = {
    id: 'subscription-123',
    tenant_id: 'school-123',
    plan_id: 'plan-123',
    status: 'pending'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('startRegistration', () => {
    it('should start a new registration session', async () => {
      (api.post as jest.Mock).mockResolvedValue({
        data: { data: mockRegistrationSession }
      });

      const session = await registrationService.startRegistration();
      
      expect(api.post).toHaveBeenCalledWith('/register/start');
      expect(session).toEqual(mockRegistrationSession);
      expect(localStorage.getItem('registration_session_id')).toBe('session-123');
    });
  });

  describe('getRegistrationSession', () => {
    it('should get an existing registration session', async () => {
      localStorage.setItem('registration_session_id', 'session-123');
      
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: mockRegistrationSession }
      });

      const session = await registrationService.getRegistrationSession();
      
      expect(api.get).toHaveBeenCalledWith('/register/session/session-123');
      expect(session).toEqual(mockRegistrationSession);
    });

    it('should return null if no session ID is stored', async () => {
      localStorage.removeItem('registration_session_id');
      
      const session = await registrationService.getRegistrationSession();
      
      expect(api.get).not.toHaveBeenCalled();
      expect(session).toBeNull();
    });
  });

  describe('submitPromoterInfo', () => {
    it('should submit promoter information', async () => {
      localStorage.setItem('registration_session_id', 'session-123');
      
      const promoterInfo = {
        email: 'promoter@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        phone: '+22997123456'
      };
      
      const updatedSession = {
        ...mockRegistrationSession,
        step: 'school_info',
        data: {
          ...mockRegistrationSession.data,
          promoter: promoterInfo
        }
      };
      
      (api.post as jest.Mock).mockResolvedValue({
        data: { data: updatedSession }
      });

      const result = await registrationService.submitPromoterInfo(promoterInfo);
      
      expect(api.post).toHaveBeenCalledWith('/register/session/session-123/promoter', promoterInfo);
      expect(result).toEqual(updatedSession);
    });
  });

  describe('checkSubdomainAvailability', () => {
    it('should check if a subdomain is available', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: { available: true } }
      });

      const result = await registrationService.checkSubdomainAvailability('ecole-test');
      
      expect(api.get).toHaveBeenCalledWith('/register/check-subdomain/ecole-test');
      expect(result).toBe(true);
    });
  });

  describe('checkEmailAvailability', () => {
    it('should check if an email is available', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: { available: true } }
      });

      const result = await registrationService.checkEmailAvailability('promoter@example.com');
      
      expect(api.get).toHaveBeenCalledWith('/register/check-email/promoter@example.com');
      expect(result).toBe(true);
    });
  });

  describe('submitSchoolInfo', () => {
    it('should submit school information', async () => {
      localStorage.setItem('registration_session_id', 'session-123');
      
      const schoolInfo = {
        name: 'École Test',
        subdomain: 'ecole-test',
        type: 'primary',
        address: '123 Main St',
        city: 'Cotonou',
        country: 'Benin'
      };
      
      const updatedSession = {
        ...mockRegistrationSession,
        step: 'plan_selection',
        data: {
          ...mockRegistrationSession.data,
          school: schoolInfo
        }
      };
      
      (api.post as jest.Mock).mockResolvedValue({
        data: { data: updatedSession }
      });

      const result = await registrationService.submitSchoolInfo(schoolInfo);
      
      expect(api.post).toHaveBeenCalledWith('/register/session/session-123/school', schoolInfo);
      expect(result).toEqual(updatedSession);
    });
  });

  describe('getAvailablePlans', () => {
    it('should get available subscription plans', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: [mockPlanData] }
      });

      const plans = await registrationService.getAvailablePlans();
      
      expect(api.get).toHaveBeenCalledWith('/plans/active');
      expect(plans).toHaveLength(1);
      expect(plans[0]).toEqual(mockPlanData);
    });
  });

  describe('selectPlan', () => {
    it('should select a subscription plan', async () => {
      localStorage.setItem('registration_session_id', 'session-123');
      
      const updatedSession = {
        ...mockRegistrationSession,
        step: 'payment',
        data: {
          ...mockRegistrationSession.data,
          plan: {
            id: 'plan-123'
          }
        }
      };
      
      (api.post as jest.Mock).mockResolvedValue({
        data: { data: updatedSession }
      });

      const result = await registrationService.selectPlan('plan-123');
      
      expect(api.post).toHaveBeenCalledWith('/register/session/session-123/plan', { plan_id: 'plan-123' });
      expect(result).toEqual(updatedSession);
    });
  });

  describe('getPaymentUrl', () => {
    it('should get payment URL for FedaPay', async () => {
      localStorage.setItem('registration_session_id', 'session-123');
      
      (api.post as jest.Mock).mockResolvedValue({
        data: { data: mockPaymentUrlData }
      });

      const result = await registrationService.getPaymentUrl();
      
      expect(api.post).toHaveBeenCalledWith('/register/session/session-123/payment-url');
      expect(result).toEqual(mockPaymentUrlData);
    });
  });

  describe('checkPaymentStatus', () => {
    it('should check payment status', async () => {
      localStorage.setItem('registration_session_id', 'session-123');
      
      const paymentStatus = {
        status: PaymentStatus.COMPLETED,
        transaction_id: 'transaction-123'
      };
      
      const updatedSession = {
        ...mockRegistrationSession,
        step: 'kyc',
        data: {
          ...mockRegistrationSession.data,
          payment: paymentStatus
        }
      };
      
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: updatedSession }
      });

      const result = await registrationService.checkPaymentStatus();
      
      expect(api.get).toHaveBeenCalledWith('/register/session/session-123/payment-status');
      expect(result).toEqual(updatedSession);
    });
  });

  describe('submitKycDocuments', () => {
    it('should submit KYC documents', async () => {
      localStorage.setItem('registration_session_id', 'session-123');
      
      const formData = new FormData();
      const mockFile = new File(['dummy content'], 'id_card.jpg', { type: 'image/jpeg' });
      formData.append('id_card', mockFile);
      
      const updatedSession = {
        ...mockRegistrationSession,
        step: 'finalize',
        data: {
          ...mockRegistrationSession.data,
          kyc: {
            status: KycStatus.PENDING
          }
        }
      };
      
      (api.post as jest.Mock).mockResolvedValue({
        data: { data: updatedSession }
      });

      const result = await registrationService.submitKycDocuments(formData);
      
      expect(api.post).toHaveBeenCalledWith('/register/session/session-123/kyc', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      expect(result).toEqual(updatedSession);
    });
  });

  describe('finalizeRegistration', () => {
    it('should finalize registration and create school, user, and subscription', async () => {
      localStorage.setItem('registration_session_id', 'session-123');
      
      const finalResult = {
        school: mockSchoolData,
        user: mockUserData,
        subscription: mockSubscriptionData
      };
      
      (api.post as jest.Mock).mockResolvedValue({
        data: { data: finalResult }
      });

      const result = await registrationService.finalizeRegistration();
      
      expect(api.post).toHaveBeenCalledWith('/register/session/session-123/finalize');
      expect(result.school).toEqual(mockSchoolData);
      expect(result.user).toEqual(mockUserData);
      expect(result.subscription).toEqual(mockSubscriptionData);
      expect(localStorage.getItem('registration_session_id')).toBeNull();
    });
  });

  describe('cancelRegistration', () => {
    it('should cancel registration session', async () => {
      localStorage.setItem('registration_session_id', 'session-123');
      
      (api.delete as jest.Mock).mockResolvedValue({
        data: { success: true }
      });

      const result = await registrationService.cancelRegistration();
      
      expect(api.delete).toHaveBeenCalledWith('/register/session/session-123');
      expect(result).toBe(true);
      expect(localStorage.getItem('registration_session_id')).toBeNull();
    });
  });
});
