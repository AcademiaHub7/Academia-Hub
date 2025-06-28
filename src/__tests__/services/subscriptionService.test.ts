/**
 * Tests unitaires pour le service de gestion des abonnements
 * @module __tests__/services/subscriptionService
 */

import { subscriptionService, SubscriptionStatus, SubscriptionType } from '../../services/payment/subscriptionService';
import { fedapayService, TransactionStatus } from '../../services/payment/fedapayService';
import { Subscription } from '../../models/Subscription';
import { SubscriptionPlan } from '../../models/SubscriptionPlan';
import { School } from '../../models/School';
import { Transaction } from '../../models/Transaction';
import { sendEmail } from '../../services/email/emailService';

// Mocks
jest.mock('../../services/payment/fedapayService');
jest.mock('../../models/Subscription');
jest.mock('../../models/SubscriptionPlan');
jest.mock('../../models/School');
jest.mock('../../models/Transaction');
jest.mock('../../services/email/emailService');

describe('SubscriptionService', () => {
  beforeEach(() => {
    // Réinitialiser tous les mocks avant chaque test
    jest.clearAllMocks();
  });

  describe('createSubscription', () => {
    it('should create a new subscription successfully', async () => {
      // Données de test
      const schoolId = 'school-123';
      const planId = 'plan-123';
      const transactionId = 'txn-123';

      // Mock des modèles
      const mockSchool = {
        id: schoolId,
        name: 'Test School',
        email: 'school@example.com',
        contact_first_name: 'John',
        contact_last_name: 'Doe'
      };

      const mockPlan = {
        id: planId,
        name: 'Premium Plan',
        price: 50000,
        type: SubscriptionType.MONTHLY
      };

      const mockSubscription = {
        id: 'sub-123',
        school_id: schoolId,
        plan_id: planId,
        status: SubscriptionStatus.ACTIVE,
        start_date: new Date(),
        end_date: new Date(),
        price: 50000,
        auto_renew: true,
        fedapay_subscription_id: null,
        last_transaction_id: transactionId
      };

      // Configurer les mocks
      (School.findById as jest.Mock).mockResolvedValue(mockSchool);
      (SubscriptionPlan.findById as jest.Mock).mockResolvedValue(mockPlan);
      (Subscription.create as jest.Mock).mockResolvedValue(mockSubscription);
      (Transaction.create as jest.Mock).mockResolvedValue({});
      (sendEmail as jest.Mock).mockResolvedValue(undefined);

      // Appeler la méthode à tester
      const result = await subscriptionService.createSubscription({
        schoolId,
        planId,
        transactionId
      });

      // Vérifier les appels aux mocks
      expect(School.findById).toHaveBeenCalledWith(schoolId);
      expect(SubscriptionPlan.findById).toHaveBeenCalledWith(planId);
      expect(Subscription.create).toHaveBeenCalledWith(expect.objectContaining({
        school_id: schoolId,
        plan_id: planId,
        status: SubscriptionStatus.ACTIVE,
        price: mockPlan.price,
        auto_renew: true,
        last_transaction_id: transactionId
      }));
      expect(Transaction.create).toHaveBeenCalledWith(expect.objectContaining({
        subscription_id: mockSubscription.id,
        fedapay_transaction_id: transactionId,
        amount: mockPlan.price,
        status: TransactionStatus.APPROVED,
        type: 'subscription'
      }));
      expect(sendEmail).toHaveBeenCalled();

      // Vérifier le résultat
      expect(result).toEqual(mockSubscription);
    });

    it('should create a trial subscription when trialDays is provided', async () => {
      // Données de test
      const schoolId = 'school-123';
      const planId = 'plan-123';
      const trialDays = 14;

      // Mock des modèles
      const mockSchool = {
        id: schoolId,
        name: 'Test School',
        email: 'school@example.com'
      };

      const mockPlan = {
        id: planId,
        name: 'Premium Plan',
        price: 50000,
        type: SubscriptionType.MONTHLY
      };

      const mockSubscription = {
        id: 'sub-123',
        school_id: schoolId,
        plan_id: planId,
        status: SubscriptionStatus.TRIAL,
        start_date: new Date(),
        end_date: new Date(),
        price: 50000,
        auto_renew: true
      };

      // Configurer les mocks
      (School.findById as jest.Mock).mockResolvedValue(mockSchool);
      (SubscriptionPlan.findById as jest.Mock).mockResolvedValue(mockPlan);
      (Subscription.create as jest.Mock).mockResolvedValue(mockSubscription);
      (sendEmail as jest.Mock).mockResolvedValue(undefined);

      // Appeler la méthode à tester
      const result = await subscriptionService.createSubscription({
        schoolId,
        planId,
        trialDays
      });

      // Vérifier les appels aux mocks
      expect(School.findById).toHaveBeenCalledWith(schoolId);
      expect(SubscriptionPlan.findById).toHaveBeenCalledWith(planId);
      expect(Subscription.create).toHaveBeenCalledWith(expect.objectContaining({
        school_id: schoolId,
        plan_id: planId,
        status: SubscriptionStatus.TRIAL,
        price: mockPlan.price,
        auto_renew: true
      }));
      expect(Transaction.create).not.toHaveBeenCalled();
      expect(sendEmail).toHaveBeenCalled();

      // Vérifier le résultat
      expect(result).toEqual(mockSubscription);
    });

    it('should throw an error if school is not found', async () => {
      // Configurer les mocks
      (School.findById as jest.Mock).mockResolvedValue(null);

      // Appeler la méthode à tester et vérifier qu'elle rejette avec l'erreur
      await expect(subscriptionService.createSubscription({
        schoolId: 'invalid-school',
        planId: 'plan-123'
      })).rejects.toThrow('École non trouvée');

      // Vérifier que les autres méthodes n'ont pas été appelées
      expect(SubscriptionPlan.findById).not.toHaveBeenCalled();
      expect(Subscription.create).not.toHaveBeenCalled();
    });

    it('should throw an error if plan is not found', async () => {
      // Configurer les mocks
      (School.findById as jest.Mock).mockResolvedValue({ id: 'school-123' });
      (SubscriptionPlan.findById as jest.Mock).mockResolvedValue(null);

      // Appeler la méthode à tester et vérifier qu'elle rejette avec l'erreur
      await expect(subscriptionService.createSubscription({
        schoolId: 'school-123',
        planId: 'invalid-plan'
      })).rejects.toThrow('Plan d\'abonnement non trouvé');

      // Vérifier que les autres méthodes n'ont pas été appelées
      expect(Subscription.create).not.toHaveBeenCalled();
    });
  });

  describe('renewSubscription', () => {
    it('should renew a subscription successfully', async () => {
      // Données de test
      const subscriptionId = 'sub-123';
      const schoolId = 'school-123';
      const planId = 'plan-123';

      // Mock des modèles
      const mockSubscription = {
        id: subscriptionId,
        school_id: schoolId,
        plan_id: planId,
        status: SubscriptionStatus.ACTIVE,
        save: jest.fn().mockResolvedValue(true)
      };

      const mockSchool = {
        id: schoolId,
        name: 'Test School',
        email: 'school@example.com',
        contact_first_name: 'John',
        contact_last_name: 'Doe'
      };

      const mockPlan = {
        id: planId,
        name: 'Premium Plan',
        price: 50000,
        type: SubscriptionType.MONTHLY
      };

      const mockTransaction = {
        id: 'txn-123',
        status: TransactionStatus.PENDING,
        paymentUrl: 'https://checkout.fedapay.com/txn-123'
      };

      // Configurer les mocks
      (Subscription.findById as jest.Mock).mockResolvedValue(mockSubscription);
      (School.findById as jest.Mock).mockResolvedValue(mockSchool);
      (SubscriptionPlan.findById as jest.Mock).mockResolvedValue(mockPlan);
      (fedapayService.createTransaction as jest.Mock).mockResolvedValue(mockTransaction);
      (fedapayService.generatePaymentUrl as jest.Mock).mockResolvedValue('https://checkout.fedapay.com/txn-123');
      (Transaction.create as jest.Mock).mockResolvedValue({});
      (sendEmail as jest.Mock).mockResolvedValue(undefined);

      // Appeler la méthode à tester
      const result = await subscriptionService.renewSubscription({
        subscriptionId
      });

      // Vérifier les appels aux mocks
      expect(Subscription.findById).toHaveBeenCalledWith(subscriptionId);
      expect(School.findById).toHaveBeenCalledWith(schoolId);
      expect(SubscriptionPlan.findById).toHaveBeenCalledWith(planId);
      expect(fedapayService.createTransaction).toHaveBeenCalledWith(expect.objectContaining({
        amount: mockPlan.price,
        description: expect.stringContaining(mockPlan.name),
        currency: 'XOF',
        customer: expect.objectContaining({
          email: mockSchool.email
        }),
        metadata: expect.objectContaining({
          school_id: schoolId,
          subscription_id: subscriptionId,
          plan_id: planId,
          type: 'renewal'
        })
      }));
      expect(fedapayService.generatePaymentUrl).toHaveBeenCalledWith(mockTransaction.id);
      expect(mockSubscription.save).toHaveBeenCalled();
      expect(Transaction.create).toHaveBeenCalled();
      expect(sendEmail).toHaveBeenCalled();

      // Vérifier le résultat
      expect(result).toEqual(mockSubscription);
    });

    it('should throw an error if subscription is not found', async () => {
      // Configurer les mocks
      (Subscription.findById as jest.Mock).mockResolvedValue(null);

      // Appeler la méthode à tester et vérifier qu'elle rejette avec l'erreur
      await expect(subscriptionService.renewSubscription({
        subscriptionId: 'invalid-subscription'
      })).rejects.toThrow('Abonnement non trouvé');

      // Vérifier que les autres méthodes n'ont pas été appelées
      expect(School.findById).not.toHaveBeenCalled();
      expect(SubscriptionPlan.findById).not.toHaveBeenCalled();
      expect(fedapayService.createTransaction).not.toHaveBeenCalled();
    });
  });
});
