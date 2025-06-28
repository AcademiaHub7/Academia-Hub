/**
 * Tests d'intégration pour le processus d'inscription complet
 * @module __tests__/integration/registrationFlow
 */

import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../server';
import { School } from '../../models/School';
import { User } from '../../models/User';
import { Subscription } from '../../models/Subscription';
import { registrationService } from '../../services/registration/registrationService';
import { fedaPayService } from '../../services/payment/fedapayService';
import { SchoolStatus, UserRole, KYCStatus } from '../../types/common';

// Mock des services externes
jest.mock('../../services/payment/fedapayService');
jest.mock('../../services/email/emailService');

describe('Registration Flow Integration Tests', () => {
  let sessionId: string;
  let transactionId: string;
  
  // Données de test
  const testSchool = {
    name: 'École de Test',
    subdomain: 'ecole-test-' + Date.now(),
    address: '123 Rue de Test',
    city: 'Ville Test',
    country: 'Pays Test',
    phone: '+22912345678',
    email: 'contact@ecole-test.com',
    website: 'https://ecole-test.com'
  };
  
  const testPromoter = {
    email: `promoter-${Date.now()}@test.com`,
    first_name: 'John',
    last_name: 'Doe',
    phone: '+22987654321'
  };
  
  const testPlan = {
    id: 'plan_basic',
    name: 'Plan Basic',
    price: 50000,
    currency: 'XOF',
    duration: 30, // jours
    features: ['Feature 1', 'Feature 2']
  };

  beforeAll(async () => {
    // Connexion à la base de données de test
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/academiahub_test');
    
    // Nettoyer la base de données avant les tests
    await School.deleteMany({});
    await User.deleteMany({});
    await Subscription.deleteMany({});
  });

  afterAll(async () => {
    // Fermer la connexion à la base de données
    await mongoose.connection.close();
  });

  describe('Step 1: Start Registration Session', () => {
    it('should start a new registration session', async () => {
      const response = await request(app)
        .post('/api/register/school/start')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.session_id).toBeDefined();
      
      // Sauvegarder l'ID de session pour les tests suivants
      sessionId = response.body.session_id;
    });
  });

  describe('Step 2: Check Subdomain and Email Availability', () => {
    it('should confirm subdomain is available', async () => {
      const response = await request(app)
        .post('/api/register/school/check-subdomain')
        .send({ subdomain: testSchool.subdomain })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.is_available).toBe(true);
    });

    it('should confirm email is available', async () => {
      const response = await request(app)
        .post('/api/register/school/check-email')
        .send({ email: testPromoter.email })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.is_available).toBe(true);
    });
  });

  describe('Step 3: Submit Promoter and School Info', () => {
    it('should submit promoter and school information', async () => {
      const response = await request(app)
        .post('/api/register/school')
        .send({
          session_id: sessionId,
          promoter_info: testPromoter,
          school_info: testSchool
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Informations enregistrées');
    });
  });

  describe('Step 4: Select Subscription Plan', () => {
    it('should select a subscription plan', async () => {
      const response = await request(app)
        .post('/api/register/school/plan')
        .send({
          session_id: sessionId,
          plan_id: testPlan.id
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Plan sélectionné');
    });
  });

  describe('Step 5: Generate Payment URL', () => {
    it('should generate a payment URL', async () => {
      // Mock du service FedaPay pour générer une URL de paiement
      (fedaPayService.createTransaction as jest.Mock).mockResolvedValue({
        id: 'txn_test_123456',
        status: 'pending',
        amount: testPlan.price,
        description: `Abonnement ${testPlan.name} - ${testSchool.name}`,
        metadata: { session_id: sessionId }
      });
      
      (fedaPayService.generatePaymentUrl as jest.Mock).mockResolvedValue('https://checkout.fedapay.com/txn_test_123456');
      
      const response = await request(app)
        .post('/api/payment/transactions')
        .send({
          session_id: sessionId,
          plan_id: testPlan.id,
          customer: {
            email: testPromoter.email,
            firstName: testPromoter.first_name,
            lastName: testPromoter.last_name
          }
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.payment_url).toBe('https://checkout.fedapay.com/txn_test_123456');
      expect(response.body.transaction_id).toBeDefined();
      
      // Sauvegarder l'ID de transaction pour les tests suivants
      transactionId = response.body.transaction_id;
    });
  });

  describe('Step 6: Handle Payment Callback', () => {
    it('should process a successful payment callback', async () => {
      // Mock du service FedaPay pour vérifier la transaction
      (fedaPayService.processWebhook as jest.Mock).mockReturnValue({
        id: transactionId,
        status: 'approved',
        amount: testPlan.price,
        metadata: { session_id: sessionId }
      });
      
      const response = await request(app)
        .post('/api/payment/callback')
        .send({
          event: 'transaction.updated',
          data: {
            transaction: {
              id: transactionId,
              status: 'approved'
            }
          }
        })
        .set('FedaPay-Signature', 'valid_signature')
        .expect(200);
      
      expect(response.body.success).toBe(true);
    });
  });

  describe('Step 7: Check Payment Status', () => {
    it('should confirm payment is completed', async () => {
      // Mock du service FedaPay pour vérifier le statut de la transaction
      (fedaPayService.getTransaction as jest.Mock).mockResolvedValue({
        id: transactionId,
        status: 'approved',
        amount: testPlan.price,
        metadata: { session_id: sessionId }
      });
      
      const response = await request(app)
        .get(`/api/register/school/${sessionId}/payment-status`)
        .query({ transaction_id: transactionId })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.status).toBe('completed');
    });
  });

  describe('Step 8: Create School After Payment', () => {
    it('should create school and promoter account after payment', async () => {
      // Mock du service d'enregistrement pour récupérer les données de session
      jest.spyOn(registrationService, 'getSession').mockResolvedValue({
        promoter_info: testPromoter,
        school_info: testSchool,
        plan_id: testPlan.id
      });
      
      // Mock du service d'enregistrement pour vérifier le statut du paiement
      jest.spyOn(registrationService, 'checkPaymentStatus').mockResolvedValue('completed');
      
      const response = await request(app)
        .post('/api/register/school/finalize')
        .send({
          session_id: sessionId,
          transaction_id: transactionId
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.school_id).toBeDefined();
      expect(response.body.promoter_id).toBeDefined();
      expect(response.body.next_step).toBe('kyc_verification');
      
      // Vérifier que l'école a été créée avec le statut correct
      const school = await School.findById(response.body.school_id);
      expect(school).toBeDefined();
      expect(school?.name).toBe(testSchool.name);
      expect(school?.subdomain).toBe(testSchool.subdomain);
      expect(school?.status).toBe(SchoolStatus.PENDING_KYC);
      
      // Vérifier que le promoteur a été créé avec le rôle correct
      const promoter = await User.findById(response.body.promoter_id);
      expect(promoter).toBeDefined();
      expect(promoter?.email).toBe(testPromoter.email);
      expect(promoter?.role).toBe(UserRole.PROMOTER);
      expect(promoter?.tenant_id).toBe(response.body.school_id);
      
      // Vérifier que l'abonnement a été créé
      const subscription = await Subscription.findOne({ tenant_id: response.body.school_id });
      expect(subscription).toBeDefined();
      expect(subscription?.plan_id).toBe(testPlan.id);
      expect(subscription?.fedapay_transaction_id).toBe(transactionId);
    });
  });
});
