/**
 * Tests pour les modèles de données
 * @jest
 */

import { 
  SchoolStatus, 
  UserRole
} from '../../types/common';
import { School, SchoolSettings } from '../../types/school';
import { User } from '../../types/user';
import { Subscription, Plan } from '../../types/subscription';

describe('Types et modèles de données', () => {
  // Tests pour les types communs
  describe('Types communs', () => {
    test('SchoolStatus contient les bonnes valeurs', () => {
      const statuses: SchoolStatus[] = ['pending_payment', 'pending_kyc', 'active', 'suspended', 'expired'];
      expect(statuses).toContain('active');
      expect(statuses).toContain('suspended');
    });

    test('UserRole contient les bonnes valeurs', () => {
      const roles: UserRole[] = ['promoter', 'admin', 'teacher', 'student', 'parent', 'staff'];
      expect(roles).toContain('promoter');
      expect(roles).toContain('teacher');
    });
  });

  // Tests pour le modèle School
  describe('Modèle School', () => {
    test('Une école peut être créée avec les propriétés requises', () => {
      const school: School = {
        id: '1',
        name: 'École Test',
        subdomain: 'ecole-test',
        status: 'active',
        subscription_plan_id: 'plan-1',
        payment_status: 'completed',
        kyc_status: 'verified',
        settings: {
          logo: 'logo.png',
          theme: 'light',
          language: 'fr'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      expect(school).toBeDefined();
      expect(school.id).toBe('1');
      expect(school.name).toBe('École Test');
      expect(school.subdomain).toBe('ecole-test');
      expect(school.status).toBe('active');
    });

    test('Les paramètres de l\'école sont optionnels', () => {
      const settings: SchoolSettings = {};
      expect(settings).toBeDefined();
      
      const settingsWithLogo: SchoolSettings = { logo: 'logo.png' };
      expect(settingsWithLogo.logo).toBe('logo.png');
      expect(settingsWithLogo.theme).toBeUndefined();
    });
  });

  // Tests pour le modèle User
  describe('Modèle User', () => {
    test('Un utilisateur peut être créé avec les propriétés requises', () => {
      const user: User = {
        id: '1',
        tenant_id: 'school-1',
        email: 'user@example.com',
        first_name: 'John',
        last_name: 'Doe',
        role: 'teacher',
        status: 'active',
        kyc_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      expect(user).toBeDefined();
      expect(user.id).toBe('1');
      expect(user.email).toBe('user@example.com');
      expect(user.role).toBe('teacher');
      expect(user.kyc_verified).toBe(false);
    });
  });

  // Tests pour le modèle Subscription
  describe('Modèle Subscription', () => {
    test('Un abonnement peut être créé avec les propriétés requises', () => {
      const subscription: Subscription = {
        id: '1',
        tenant_id: 'school-1',
        plan_id: 'plan-1',
        fedapay_transaction_id: 'transaction-1',
        status: 'active',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      expect(subscription).toBeDefined();
      expect(subscription.id).toBe('1');
      expect(subscription.tenant_id).toBe('school-1');
      expect(subscription.status).toBe('active');
    });

    test('Un plan peut être créé avec les propriétés requises', () => {
      const plan: Plan = {
        id: '1',
        name: 'Plan Standard',
        description: 'Plan standard pour les écoles',
        price: 50000,
        currency: 'XOF',
        duration_days: 365,
        features: {
          max_students: 500,
          max_teachers: 50,
          modules: ['attendance', 'grades', 'finance'],
          support_level: 'standard',
          storage_gb: 10
        },
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      expect(plan).toBeDefined();
      expect(plan.id).toBe('1');
      expect(plan.name).toBe('Plan Standard');
      expect(plan.price).toBe(50000);
      expect(plan.features.max_students).toBe(500);
      expect(plan.features.modules).toContain('grades');
    });
  });
});
