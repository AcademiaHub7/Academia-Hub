/**
 * Tests unitaires pour le contrôleur de paiement
 * @module __tests__/controllers/PaymentController
 */

import type { Request, Response } from 'express';
import { UserRole, SchoolStatus } from '../../types/common';
import { User } from '../../models/User';
import { School } from '../../models/School';
import { PaymentController } from '../../controllers/PaymentController';
import { fedapayService } from '../../services/payment/fedapayService';
import { Subscription } from '../../models/Subscription';
import { registrationService } from '../../services/registration/registrationService';
import { emailService } from '../../services/email/emailService';

// Mock des services et modèles
jest.mock('../../services/payment/fedapayService');
jest.mock('../../services/registration/registrationService');
jest.mock('../../services/email/emailService');
jest.mock('../../models/School');
jest.mock('../../models/Subscription');

describe('PaymentController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
    
    // Configurer les mocks pour req et res
    mockRequest = {
      body: {},
      params: {},
      query: {},
      headers: {},
      user: {
        id: 'user_123',
        tenant_id: 'school_123',
        role: UserRole.PROMOTER,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        status: 'active',
        kyc_verified: false,
        created_at: new Date(),
        updated_at: new Date(),
        password: 'hashed_password',
        phone: '+1234567890',
        last_login: new Date(),
        login_attempts: 0,
        reset_password_token: null,
        reset_password_expires: null,
        email_verified: true,
        email_verification_token: null,
        email_verification_expires: null,
        two_factor_secret: null,
        two_factor_enabled: false,
        preferences: {},
        kyc_status: 'not_submitted',
        kyc_documents: [],
        kyc_verified_at: null,
        kyc_rejected_reason: null
      } as unknown as User,
      tenant: {
        id: 'school_123',
        name: 'École Test',
        subdomain: 'test-school',
        status: SchoolStatus.ACTIVE,
        type: 'primary',
        subscription_plan_id: 'plan_basic',
        subscription_status: 'active',
        payment_status: 'active',
        trial_ends_at: null,
        created_at: new Date(),
        updated_at: new Date(),
        phone: '+1234567890',
        email: 'contact@test-school.com',
        address: '123 Test Street',
        city: 'Test City',
        country: 'Test Country',
        postal_code: '12345',
        logo_url: 'https://example.com/logo.png',
        website: 'https://test-school.com',
        settings: {},
        features: {},
        kyc_status: 'verified',
        kyc_documents: [],
        kyc_verified_at: new Date(),
        kyc_rejected_reason: null,
        kyc_submitted_at: new Date(),
        kyc_verified_by: null,
        kyc_review_notes: null,
        kyc_reviewed_at: null,
        kyc_reviewed_by: null
      } as unknown as School
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('generatePaymentUrl', () => {
    it('should generate a payment URL for subscription', async () => {
      // Configurer les données de requête
      mockRequest.body = {
        plan_id: 'plan_basic',
        customer: {
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe'
        }
      };
      
      // Mock de la recherche d'école
      (School.findById as jest.Mock).mockResolvedValue({
        id: 'school_123',
        name: 'École Test',
        status: 'ACTIVE'
      });
      
      // Mock du service FedaPay
      (fedapayService.createTransaction as jest.Mock).mockResolvedValue({
        id: 'txn_123456',
        status: 'pending',
        amount: 50000,
        description: 'Abonnement Plan Basic - École Test'
      });
      
      (fedapayService.generatePaymentUrl as jest.Mock).mockResolvedValue('https://checkout.fedapay.com/txn_123456');
      
      // Appeler la méthode à tester
      await PaymentController.generatePaymentUrl(mockRequest as Request, mockResponse as Response);
      
      // Vérifier la réponse
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        transaction_id: 'txn_123456',
        payment_url: 'https://checkout.fedapay.com/txn_123456'
      });
      
      // Vérifier que les services ont été appelés correctement
      expect(fedapayService.createTransaction).toHaveBeenCalledWith(expect.objectContaining({
        amount: expect.any(Number),
        description: expect.stringContaining('Abonnement Plan Basic'),
        customer: {
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe'
        }
      }));
      
      expect(fedapayService.generatePaymentUrl).toHaveBeenCalledWith('txn_123456');
    });

    it('should generate a payment URL for registration', async () => {
      // Configurer les données de requête
      mockRequest.body = {
        session_id: 'session_123456',
        plan_id: 'plan_basic',
        customer: {
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe'
        }
      };
      
      // Mock du service d'enregistrement
      (registrationService.getRegistrationSession as jest.Mock).mockResolvedValue({
        promoter_info: {
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe'
        },
        school_info: {
          name: 'Nouvelle École'
        }
      });
      
      // Mock du service FedaPay
      (fedapayService.createTransaction as jest.Mock).mockResolvedValue({
        id: 'txn_123456',
        status: 'pending',
        amount: 50000,
        description: 'Abonnement Plan Basic - Nouvelle École'
      });
      
      (fedapayService.generatePaymentUrl as jest.Mock).mockResolvedValue('https://checkout.fedapay.com/txn_123456');
      
      // Appeler la méthode à tester
      await PaymentController.generatePaymentUrl(mockRequest as Request, mockResponse as Response);
      
      // Vérifier la réponse
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        transaction_id: 'txn_123456',
        payment_url: 'https://checkout.fedapay.com/txn_123456'
      });
      
      // Vérifier que les services ont été appelés correctement
      expect(registrationService.getRegistrationSession).toHaveBeenCalledWith('session_123456');
      expect(fedapayService.createTransaction).toHaveBeenCalled();
      expect(fedapayService.generatePaymentUrl).toHaveBeenCalledWith('txn_123456');
    });

    it('should handle errors when generating payment URL', async () => {
      // Configurer les données de requête
      mockRequest.body = {
        plan_id: 'plan_basic',
        customer: {
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe'
        }
      };
      
      // Mock de la recherche d'école pour rejeter
      (School.findById as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      // Appeler la méthode à tester
      await PaymentController.generatePaymentUrl(mockRequest as Request, mockResponse as Response);
      
      // Vérifier la réponse d'erreur
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: expect.stringContaining('Erreur lors de la génération de l\'URL de paiement')
      });
    });
  });

  describe('handleWebhook', () => {
    it('should process a valid payment webhook', async () => {
      // Configurer les données de requête
      mockRequest.body = {
        event: 'transaction.updated',
        data: {
          transaction: {
            id: 'txn_123456',
            status: 'approved'
          }
        }
      };
      
      mockRequest.headers = {
        'fedapay-signature': 'valid_signature'
      };
      
      // Mock du service FedaPay
      (fedapayService.processWebhook as jest.Mock).mockReturnValue({
        id: 'txn_123456',
        status: 'approved',
        amount: 50000,
        metadata: {
          subscription_id: 'sub_123456',
          tenant_id: 'school_123'
        }
      });
      
      // Mock de la recherche d'abonnement
      (Subscription.findById as jest.Mock).mockResolvedValue({
        id: 'sub_123456',
        tenant_id: 'school_123',
        updatePaymentStatus: jest.fn().mockResolvedValue(true)
      });
      
      // Appeler la méthode à tester
      await PaymentController.handlePaymentCallback(mockRequest as Request, mockResponse as Response);
      
      // Vérifier la réponse
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Webhook traité avec succès'
      });
      
      // Vérifier que les services ont été appelés correctement
      expect(fedapayService.processWebhook).toHaveBeenCalledWith(
        mockRequest.body,
        'valid_signature'
      );
      
      expect(Subscription.findById).toHaveBeenCalledWith('sub_123456');
      
      // Vérifier que le service d'email a été appelé
      expect(emailService.sendPaymentConfirmation).toHaveBeenCalled();
    });

    it('should handle invalid webhook signature', async () => {
      // Configurer les données de requête
      mockRequest.body = {
        event: 'transaction.updated',
        data: {
          transaction: {
            id: 'txn_123456',
            status: 'approved'
          }
        }
      };
      
      mockRequest.headers = {
        'fedapay-signature': 'invalid_signature'
      };
      
      // Mock du service FedaPay pour retourner null (signature invalide)
      (fedapayService.processWebhook as jest.Mock).mockReturnValue(null);
      
      // Appeler la méthode à tester
      await PaymentController.handlePaymentCallback(mockRequest as Request, mockResponse as Response);
      
      // Vérifier la réponse
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Signature de webhook invalide'
      });
      
      // Vérifier que le service d'abonnement n'a pas été appelé
      expect(Subscription.findById).not.toHaveBeenCalled();
    });
  });

  describe('getTransactionStatus', () => {
    it('should return transaction status', async () => {
      // Configurer les paramètres de requête
      mockRequest.params = {
        id: 'txn_123456'
      };
      
      // Mock du service FedaPay
      (fedapayService.getTransaction as jest.Mock).mockResolvedValue({
        id: 'txn_123456',
        status: 'approved',
        amount: 50000,
        description: 'Abonnement Plan Basic - École Test'
      });
      
      // Appeler la méthode à tester
      await PaymentController.checkPaymentStatus(mockRequest as Request, mockResponse as Response);
      
      // Vérifier la réponse
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        transaction: {
          id: 'txn_123456',
          status: 'approved',
          amount: 50000,
          description: 'Abonnement Plan Basic - École Test'
        }
      });
      
      // Vérifier que le service a été appelé correctement
      expect(fedapayService.getTransaction).toHaveBeenCalledWith('txn_123456');
    });

    it('should handle transaction not found', async () => {
      // Configurer les paramètres de requête
      mockRequest.params = {
        id: 'nonexistent_txn'
      };
      
      // Mock du service FedaPay pour rejeter
      (fedapayService.getTransaction as jest.Mock).mockRejectedValue({
        response: {
          status: 404,
          data: {
            error: {
              message: 'Transaction not found'
            }
          }
        }
      });
      
      // Appeler la méthode à tester
      await PaymentController.checkPaymentStatus(mockRequest as Request, mockResponse as Response);
      
      // Vérifier la réponse
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Transaction non trouvée'
      });
    });
  });

  describe('getInvoice', () => {
    it('should generate and return invoice data', async () => {
      // Configurer les paramètres de requête
      mockRequest.params = {
        id: 'sub_123456'
      };
      
      // Mock de la recherche d'abonnement
      (Subscription.findById as jest.Mock).mockResolvedValue({
        id: 'sub_123456',
        tenant_id: 'school_123',
        plan_id: 'plan_basic',
        plan_name: 'Plan Basic',
        amount: 50000,
        currency: 'XOF',
        start_date: new Date('2023-01-01'),
        end_date: new Date('2023-02-01'),
        fedapay_transaction_id: 'txn_123456',
        payment_status: 'completed',
        generateInvoiceData: jest.fn().mockResolvedValue({
          invoice_number: 'INV-2023-001',
          date: '2023-01-01',
          due_date: '2023-01-01',
          items: [
            {
              description: 'Abonnement Plan Basic',
              quantity: 1,
              unit_price: 50000,
              total: 50000
            }
          ],
          subtotal: 50000,
          tax: 0,
          total: 50000
        })
      });
      
      // Mock de la recherche d'école
      (School.findById as jest.Mock).mockResolvedValue({
        id: 'school_123',
        name: 'École Test',
        address: '123 Rue Test',
        city: 'Ville Test',
        country: 'Pays Test'
      });
      
      // Appeler la méthode à tester
      await PaymentController.generateInvoice(mockRequest as Request, mockResponse as Response);
      
      // Vérifier la réponse
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        invoice: expect.objectContaining({
          invoice_number: 'INV-2023-001',
          school: expect.objectContaining({
            name: 'École Test'
          }),
          items: expect.arrayContaining([
            expect.objectContaining({
              description: 'Abonnement Plan Basic'
            })
          ])
        })
      });
    });

    it('should handle subscription not found', async () => {
      // Configurer les paramètres de requête
      mockRequest.params = {
        id: 'nonexistent_sub'
      };
      
      // Mock de la recherche d'abonnement pour retourner null
      (Subscription.findById as jest.Mock).mockResolvedValue(null);
      
      // Appeler la méthode à tester
      await PaymentController.generateInvoice(mockRequest as Request, mockResponse as Response);
      
      // Vérifier la réponse
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Abonnement non trouvé'
      });
    });
  });
});
