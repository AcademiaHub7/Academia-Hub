/**
 * Tests unitaires pour le modèle Subscription
 * @module __tests__/models/Subscription
 */

import { Subscription } from '../../models/Subscription';
import { School } from '../../models/School';
import { Plan } from '../../models/Plan';
import { PaymentHistory } from '../../models/PaymentHistory';
import { SubscriptionStatus, BillingCycle, PaymentStatus, SchoolStatus } from '../../types/common';
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

describe('Subscription Model', () => {
  // Données de test
  const mockSubscriptionData = {
    id: 'subscription-123',
    tenant_id: 'school-123',
    plan_id: 'plan-123',
    status: SubscriptionStatus.ACTIVE,
    start_date: '2023-01-01T00:00:00Z',
    end_date: '2024-01-01T00:00:00Z',
    trial_ends_at: null,
    fedapay_transaction_id: 'transaction-123',
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
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  };

  const mockPlanData = {
    id: 'plan-123',
    name: 'Plan Premium',
    description: 'Plan premium avec toutes les fonctionnalités',
    price: 10000,
    billing_cycle: BillingCycle.MONTHLY,
    features: ['feature1', 'feature2', 'feature3'],
    is_active: true,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  };

  const mockPaymentHistoryData = {
    id: 'payment-123',
    subscription_id: 'subscription-123',
    amount: 10000,
    currency: 'XOF',
    payment_method: 'fedapay',
    transaction_id: 'transaction-123',
    status: PaymentStatus.COMPLETED,
    payment_date: '2023-01-01T00:00:00Z',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create a Subscription instance with correct properties', () => {
      const subscription = new Subscription(mockSubscriptionData);
      
      expect(subscription.id).toBe(mockSubscriptionData.id);
      expect(subscription.tenant_id).toBe(mockSubscriptionData.tenant_id);
      expect(subscription.plan_id).toBe(mockSubscriptionData.plan_id);
      expect(subscription.status).toBe(mockSubscriptionData.status);
      expect(subscription.start_date).toBe(mockSubscriptionData.start_date);
      expect(subscription.end_date).toBe(mockSubscriptionData.end_date);
      expect(subscription.trial_ends_at).toBe(mockSubscriptionData.trial_ends_at);
      expect(subscription.fedapay_transaction_id).toBe(mockSubscriptionData.fedapay_transaction_id);
      expect(subscription.created_at).toBe(mockSubscriptionData.created_at);
      expect(subscription.updated_at).toBe(mockSubscriptionData.updated_at);
    });
  });

  describe('Static Methods', () => {
    it('should find a subscription by ID', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: mockSubscriptionData }
      });

      const subscription = await Subscription.findById('subscription-123');
      
      expect(api.get).toHaveBeenCalledWith('/subscriptions/subscription-123');
      expect(subscription).toBeInstanceOf(Subscription);
      expect(subscription?.id).toBe('subscription-123');
    });

    it('should return null when subscription not found by ID', async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error('Not found'));

      const subscription = await Subscription.findById('non-existent');
      
      expect(api.get).toHaveBeenCalledWith('/subscriptions/non-existent');
      expect(subscription).toBeNull();
    });

    it('should find active subscription by tenant ID', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: mockSubscriptionData }
      });

      const subscription = await Subscription.findActiveByTenantId('school-123');
      
      expect(api.get).toHaveBeenCalledWith('/tenants/school-123/active-subscription');
      expect(subscription).toBeInstanceOf(Subscription);
      expect(subscription?.tenant_id).toBe('school-123');
      expect(subscription?.status).toBe(SubscriptionStatus.ACTIVE);
    });

    it('should find all subscriptions by tenant ID', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: [mockSubscriptionData] }
      });

      const subscriptions = await Subscription.findByTenantId('school-123');
      
      expect(api.get).toHaveBeenCalledWith('/tenants/school-123/subscriptions');
      expect(subscriptions).toHaveLength(1);
      expect(subscriptions[0]).toBeInstanceOf(Subscription);
      expect(subscriptions[0].tenant_id).toBe('school-123');
    });

    it('should create a new subscription', async () => {
      const newSubscriptionData = {
        tenant_id: 'school-123',
        plan_id: 'plan-123',
        status: SubscriptionStatus.PENDING,
        start_date: '2023-01-01T00:00:00Z',
        end_date: '2024-01-01T00:00:00Z'
      };

      (api.post as jest.Mock).mockResolvedValue({
        data: { 
          data: { 
            ...newSubscriptionData, 
            id: 'new-subscription-123',
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z'
          } 
        }
      });

      const subscription = await Subscription.create(newSubscriptionData);
      
      expect(api.post).toHaveBeenCalledWith('/subscriptions', newSubscriptionData);
      expect(subscription).toBeInstanceOf(Subscription);
      expect(subscription?.id).toBe('new-subscription-123');
      expect(subscription?.tenant_id).toBe('school-123');
    });
  });

  describe('Instance Methods', () => {
    let subscription: Subscription;

    beforeEach(() => {
      subscription = new Subscription(mockSubscriptionData);
    });

    it('should update subscription properties', async () => {
      const updateData = {
        status: SubscriptionStatus.CANCELED,
        end_date: '2023-06-01T00:00:00Z'
      };

      (api.put as jest.Mock).mockResolvedValue({
        data: { 
          data: { 
            ...mockSubscriptionData, 
            ...updateData,
            updated_at: '2023-01-02T00:00:00Z'
          } 
        }
      });

      const updatedSubscription = await subscription.update(updateData);
      
      expect(api.put).toHaveBeenCalledWith('/subscriptions/subscription-123', updateData);
      expect(updatedSubscription).toBe(subscription); // Même instance
      expect(updatedSubscription?.status).toBe(SubscriptionStatus.CANCELED);
      expect(updatedSubscription?.end_date).toBe('2023-06-01T00:00:00Z');
      expect(updatedSubscription?.updated_at).toBe('2023-01-02T00:00:00Z');
    });

    it('should update subscription status', async () => {
      (api.put as jest.Mock).mockResolvedValue({
        data: { 
          data: { 
            ...mockSubscriptionData, 
            status: SubscriptionStatus.EXPIRED,
            updated_at: '2023-01-02T00:00:00Z'
          } 
        }
      });

      const updatedSubscription = await subscription.updateStatus(SubscriptionStatus.EXPIRED);
      
      expect(api.put).toHaveBeenCalledWith('/subscriptions/subscription-123/status', { status: SubscriptionStatus.EXPIRED });
      expect(updatedSubscription?.status).toBe(SubscriptionStatus.EXPIRED);
    });

    it('should cancel a subscription', async () => {
      const cancelDate = '2023-02-01T00:00:00Z';
      
      (api.put as jest.Mock).mockResolvedValue({
        data: { 
          data: { 
            ...mockSubscriptionData, 
            status: SubscriptionStatus.CANCELED,
            end_date: cancelDate,
            updated_at: '2023-01-02T00:00:00Z'
          } 
        }
      });

      const updatedSubscription = await subscription.cancel(new Date(cancelDate));
      
      expect(api.put).toHaveBeenCalledWith('/subscriptions/subscription-123/cancel', { end_date: cancelDate });
      expect(updatedSubscription?.status).toBe(SubscriptionStatus.CANCELED);
      expect(updatedSubscription?.end_date).toBe(cancelDate);
    });

    it('should renew a subscription', async () => {
      const newEndDate = '2025-01-01T00:00:00Z';
      
      (api.put as jest.Mock).mockResolvedValue({
        data: { 
          data: { 
            ...mockSubscriptionData, 
            end_date: newEndDate,
            updated_at: '2023-01-02T00:00:00Z'
          } 
        }
      });

      const updatedSubscription = await subscription.renew();
      
      expect(api.put).toHaveBeenCalledWith('/subscriptions/subscription-123/renew');
      expect(updatedSubscription?.end_date).toBe(newEndDate);
    });

    it('should check if subscription is active', () => {
      expect(subscription.isActive()).toBe(true);
      
      subscription.status = SubscriptionStatus.CANCELED;
      expect(subscription.isActive()).toBe(false);
    });

    it('should check if subscription is in trial period', () => {
      expect(subscription.isInTrialPeriod()).toBe(false);
      
      subscription.trial_ends_at = '2023-02-01T00:00:00Z';
      expect(subscription.isInTrialPeriod()).toBe(true);
      
      // Cas où la période d'essai est expirée
      subscription.trial_ends_at = '2022-01-01T00:00:00Z';
      expect(subscription.isInTrialPeriod()).toBe(false);
    });

    it('should check if subscription is expired', () => {
      expect(subscription.isExpired()).toBe(false);
      
      subscription.end_date = '2022-01-01T00:00:00Z';
      expect(subscription.isExpired()).toBe(true);
    });

    it('should get remaining days', () => {
      // Mock de Date.now() pour avoir une date fixe
      const mockNow = new Date('2023-06-01T00:00:00Z').getTime();
      jest.spyOn(Date, 'now').mockImplementation(() => mockNow);
      
      subscription.end_date = '2023-07-01T00:00:00Z';
      expect(subscription.getRemainingDays()).toBe(30);
      
      // Cas où l'abonnement est expiré
      subscription.end_date = '2023-05-01T00:00:00Z';
      expect(subscription.getRemainingDays()).toBe(0);
      
      // Restaurer Date.now()
      jest.restoreAllMocks();
    });
  });

  describe('Relations', () => {
    let subscription: Subscription;

    beforeEach(() => {
      subscription = new Subscription(mockSubscriptionData);
      
      // Mock des imports dynamiques
      jest.mock('../../models/School', () => ({
        __esModule: true,
        default: {
          findById: jest.fn().mockResolvedValue(new School(mockSchoolData))
        }
      }));
      
      jest.mock('../../models/Plan', () => ({
        __esModule: true,
        default: {
          findById: jest.fn().mockResolvedValue(new Plan(mockPlanData))
        }
      }));
      
      jest.mock('../../models/PaymentHistory', () => ({
        __esModule: true,
        default: {
          findBySubscriptionId: jest.fn().mockResolvedValue([new PaymentHistory(mockPaymentHistoryData)])
        }
      }));
    });

    it('should get the school of the subscription', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: mockSchoolData }
      });

      const school = await subscription.getSchool();
      
      expect(api.get).toHaveBeenCalledWith('/schools/school-123');
      expect(school).toBeInstanceOf(School);
      expect(school?.id).toBe('school-123');
    });

    it('should get the plan of the subscription', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: mockPlanData }
      });

      const plan = await subscription.getPlan();
      
      expect(api.get).toHaveBeenCalledWith('/plans/plan-123');
      expect(plan).toBeInstanceOf(Plan);
      expect(plan?.id).toBe('plan-123');
    });

    it('should get payment history of the subscription', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: [mockPaymentHistoryData] }
      });

      const payments = await subscription.getPaymentHistory();
      
      expect(api.get).toHaveBeenCalledWith('/subscriptions/subscription-123/payments');
      expect(payments).toHaveLength(1);
      expect(payments[0]).toBeInstanceOf(PaymentHistory);
      expect(payments[0].subscription_id).toBe('subscription-123');
    });

    it('should get latest payment of the subscription', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: mockPaymentHistoryData }
      });

      const payment = await subscription.getLatestPayment();
      
      expect(api.get).toHaveBeenCalledWith('/subscriptions/subscription-123/latest-payment');
      expect(payment).toBeInstanceOf(PaymentHistory);
      expect(payment?.subscription_id).toBe('subscription-123');
    });
  });
});
