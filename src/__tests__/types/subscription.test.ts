import { SubscriptionStatus, PaymentStatus } from '../../types/common';
import { SubscriptionPlan, Subscription, PaymentHistory } from '../../types/subscription';

describe('Subscription Models', () => {
  describe('SubscriptionPlan', () => {
    test('peut créer un plan d\'abonnement valide', () => {
      const plan: SubscriptionPlan = {
        id: '1',
        name: 'Plan Premium',
        description: 'Plan d\'abonnement premium avec toutes les fonctionnalités',
        price: 100000,
        currency: 'XOF',
        duration_days: 365,
        features: {
          max_students: 1000,
          max_teachers: 50,
          video_storage_gb: 100,
          custom_domain: true,
          advanced_analytics: true
        },
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      expect(plan).toBeDefined();
      expect(plan.id).toBe('1');
      expect(plan.name).toBe('Plan Premium');
      expect(plan.price).toBe(100000);
      expect(plan.duration_days).toBe(365);
      expect(plan.features.max_students).toBe(1000);
      expect(plan.features.custom_domain).toBe(true);
    });
    
    test('peut créer un plan inactif', () => {
      const plan: SubscriptionPlan = {
        id: '2',
        name: 'Plan Basic',
        description: 'Plan d\'abonnement de base',
        price: 50000,
        currency: 'XOF',
        duration_days: 365,
        features: {
          max_students: 200,
          max_teachers: 10,
          video_storage_gb: 20,
          custom_domain: false,
          advanced_analytics: false
        },
        is_active: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      expect(plan).toBeDefined();
      expect(plan.is_active).toBe(false);
    });
  });
  
  describe('Subscription', () => {
    test('peut créer un abonnement actif', () => {
      const now = new Date();
      const endDate = new Date(now);
      endDate.setFullYear(now.getFullYear() + 1);
      
      const subscription: Subscription = {
        id: '1',
        tenant_id: '1',
        plan_id: '1',
        fedapay_transaction_id: 'fpay_123456',
        status: SubscriptionStatus.ACTIVE,
        start_date: now.toISOString(),
        end_date: endDate.toISOString(),
        auto_renew: true,
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      };
      
      expect(subscription).toBeDefined();
      expect(subscription.id).toBe('1');
      expect(subscription.tenant_id).toBe('1');
      expect(subscription.status).toBe(SubscriptionStatus.ACTIVE);
      expect(subscription.auto_renew).toBe(true);
      // Vérifier que les dates sont valides et que end_date est après start_date
      expect(subscription.end_date).not.toBeNull();
      expect(subscription.start_date).not.toBeNull();
      if (subscription.end_date && subscription.start_date) {
        expect(new Date(subscription.end_date).getTime()).toBeGreaterThan(new Date(subscription.start_date).getTime());
      }
    });
    
    test('peut créer un abonnement en attente', () => {
      const subscription: Subscription = {
        id: '2',
        tenant_id: '2',
        plan_id: '1',
        fedapay_transaction_id: null,
        status: SubscriptionStatus.PENDING,
        start_date: null,
        end_date: null,
        auto_renew: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      expect(subscription).toBeDefined();
      expect(subscription.status).toBe(SubscriptionStatus.PENDING);
      expect(subscription.start_date).toBeNull();
      expect(subscription.end_date).toBeNull();
    });
  });
  
  describe('PaymentHistory', () => {
    test('peut créer un historique de paiement complet', () => {
      const payment: PaymentHistory = {
        id: '1',
        subscription_id: '1',
        tenant_id: '1',
        amount: 100000,
        currency: 'XOF',
        payment_method: 'fedapay',
        transaction_id: 'fpay_123456',
        status: PaymentStatus.COMPLETED,
        payment_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      expect(payment).toBeDefined();
      expect(payment.id).toBe('1');
      expect(payment.subscription_id).toBe('1');
      expect(payment.amount).toBe(100000);
      expect(payment.status).toBe(PaymentStatus.COMPLETED);
    });
    
    test('peut créer un historique de paiement en attente', () => {
      const payment: PaymentHistory = {
        id: '2',
        subscription_id: '2',
        tenant_id: '2',
        amount: 50000,
        currency: 'XOF',
        payment_method: 'fedapay',
        transaction_id: 'fpay_654321',
        status: PaymentStatus.PENDING,
        payment_date: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      expect(payment).toBeDefined();
      expect(payment.status).toBe(PaymentStatus.PENDING);
      expect(payment.payment_date).toBeNull();
    });
  });
});
