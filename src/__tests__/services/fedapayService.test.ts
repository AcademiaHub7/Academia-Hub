/**
 * Tests unitaires pour le service FedaPay
 * @module __tests__/services/fedapayService
 */

import axios from 'axios';
import crypto from 'crypto';
import { FedaPayService, FedaPayEnvironment, TransactionStatus } from '../../services/payment/fedapayService';

// Mock d'axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('FedaPayService', () => {
  let fedaPayService: FedaPayService;
  
  // Configuration de l'environnement de test
  beforeEach(() => {
    // Configurer les variables d'environnement pour les tests
    process.env.FEDAPAY_PUBLIC_KEY = 'pk_sandbox_wqOUAg2XKEdY1wScET0R4TCv';
    process.env.FEDAPAY_SECRET_KEY = 'sk_sandbox_N6wqvEGOd_-qoGsdPSOt6K9Z';
    process.env.FEDAPAY_ENVIRONMENT = 'sandbox';
    process.env.FEDAPAY_WEBHOOK_SECRET = 'wh_sandbox_mcm2z7wajK07YIxMfSRGA_Cc';
    
    // Créer une nouvelle instance du service pour chaque test
    fedaPayService = new FedaPayService();
    
    // Réinitialiser les mocks
    jest.clearAllMocks();
  });
  
  describe('createTransaction', () => {
    it('should create a transaction successfully', async () => {
      // Configurer la réponse mock d'axios
      const mockResponse = {
        data: {
          transaction: {
            id: 'txn_123456',
            status: 'pending',
            amount: 5000,
            description: 'Test transaction',
            created_at: '2025-06-27T12:00:00Z',
            updated_at: '2025-06-27T12:00:00Z',
            metadata: { test: 'value' }
          }
        }
      };
      
      mockedAxios.post.mockResolvedValue(mockResponse);
      
      // Données de transaction pour le test
      const transactionData = {
        amount: 5000,
        description: 'Test transaction',
        currency: 'XOF',
        customer: {
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe'
        },
        metadata: { test: 'value' }
      };
      
      // Appeler la méthode à tester
      const result = await fedaPayService.createTransaction(transactionData);
      
      // Vérifier que la méthode axios.post a été appelée correctement
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://sandbox-api.fedapay.com/v1/transactions',
        {
          transaction: {
            amount: 5000,
            description: 'Test transaction',
            currency: { iso: 'XOF' },
            callback_url: undefined,
            customer: {
              email: 'test@example.com',
              firstname: 'John',
              lastname: 'Doe'
            },
            metadata: { test: 'value' }
          }
        },
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer sk_test_123456',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          })
        })
      );
      
      // Vérifier le résultat
      expect(result).toEqual({
        id: 'txn_123456',
        status: 'pending',
        amount: 5000,
        description: 'Test transaction',
        createdAt: '2025-06-27T12:00:00Z',
        updatedAt: '2025-06-27T12:00:00Z',
        metadata: { test: 'value' }
      });
    });
    
    it('should handle API errors when creating a transaction', async () => {
      // Configurer l'erreur mock d'axios
      const mockError = {
        response: {
          status: 400,
          data: {
            error: {
              message: 'Invalid amount'
            }
          },
          statusText: 'Bad Request',
          headers: {}
        }
      };
      
      mockedAxios.post.mockRejectedValue(mockError);
      
      // Données de transaction pour le test
      const transactionData = {
        amount: -100, // Montant invalide
        description: 'Test transaction',
        currency: 'XOF'
      };
      
      // Appeler la méthode à tester et vérifier qu'elle rejette avec l'erreur
      await expect(fedaPayService.createTransaction(transactionData)).rejects.toEqual(mockError);
    });
  });
  
  describe('generatePaymentUrl', () => {
    it('should generate a payment URL successfully', async () => {
      // Configurer la réponse mock d'axios
      const mockResponse = {
        data: {
          payment_url: 'https://sandbox-checkout.fedapay.com/txn_123456'
        }
      };
      
      mockedAxios.post.mockResolvedValue(mockResponse);
      
      // Appeler la méthode à tester
      const result = await fedaPayService.generatePaymentUrl('txn_123456');
      
      // Vérifier que la méthode axios.post a été appelée correctement
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://sandbox-api.fedapay.com/v1/transactions/txn_123456/generate-payment-url',
        {},
        expect.objectContaining({
          headers: expect.any(Object)
        })
      );
      
      // Vérifier le résultat
      expect(result).toBe('https://sandbox-checkout.fedapay.com/txn_123456');
    });
  });
  
  describe('getTransaction', () => {
    it('should retrieve transaction details successfully', async () => {
      // Configurer la réponse mock d'axios
      const mockResponse = {
        data: {
          transaction: {
            id: 'txn_123456',
            status: 'approved',
            amount: 5000,
            description: 'Test transaction',
            created_at: '2025-06-27T12:00:00Z',
            updated_at: '2025-06-27T12:05:00Z',
            metadata: { test: 'value' }
          }
        }
      };
      
      mockedAxios.get.mockResolvedValue(mockResponse);
      
      // Appeler la méthode à tester
      const result = await fedaPayService.getTransaction('txn_123456');
      
      // Vérifier que la méthode axios.get a été appelée correctement
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://sandbox-api.fedapay.com/v1/transactions/txn_123456',
        expect.objectContaining({
          headers: expect.any(Object)
        })
      );
      
      // Vérifier le résultat
      expect(result).toEqual({
        id: 'txn_123456',
        status: 'approved',
        amount: 5000,
        description: 'Test transaction',
        createdAt: '2025-06-27T12:00:00Z',
        updatedAt: '2025-06-27T12:05:00Z',
        metadata: { test: 'value' }
      });
    });
  });
  
  describe('verifyWebhookSignature', () => {
    it('should verify a valid webhook signature', () => {
      // Données de test
      const payload = { event: 'transaction.updated', data: { transaction: { id: 'txn_123456' } } };
      const secret = 'whsec_123456';
      
      // Générer une signature valide
      const signature = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(payload))
        .digest('hex');
      
      // Appeler la méthode à tester
      const result = fedaPayService.verifyWebhookSignature(payload, signature);
      
      // Vérifier le résultat
      expect(result).toBe(true);
    });
    
    it('should reject an invalid webhook signature', () => {
      // Données de test
      const payload = { event: 'transaction.updated', data: { transaction: { id: 'txn_123456' } } };
      const invalidSignature = 'invalid_signature';
      
      // Appeler la méthode à tester
      const result = fedaPayService.verifyWebhookSignature(payload, invalidSignature);
      
      // Vérifier le résultat
      expect(result).toBe(false);
    });
  });
  
  describe('processWebhook', () => {
    it('should process a valid webhook and return transaction data', () => {
      // Données de test
      const webhookData = {
        event: 'transaction.updated',
        data: {
          transaction: {
            id: 'txn_123456',
            status: 'approved',
            amount: 5000,
            description: 'Test transaction',
            created_at: '2025-06-27T12:00:00Z',
            updated_at: '2025-06-27T12:05:00Z',
            metadata: { subscription_id: 'sub_123456' }
          }
        }
      };
      
      // Espionner la méthode verifyWebhookSignature
      const spyVerify = jest.spyOn(fedaPayService, 'verifyWebhookSignature').mockReturnValue(true);
      
      // Appeler la méthode à tester
      const result = fedaPayService.processWebhook(webhookData, 'valid_signature');
      
      // Vérifier que la méthode verifyWebhookSignature a été appelée
      expect(spyVerify).toHaveBeenCalledWith(webhookData, 'valid_signature');
      
      // Vérifier le résultat
      expect(result).toEqual({
        id: 'txn_123456',
        status: 'approved',
        amount: 5000,
        description: 'Test transaction',
        createdAt: '2025-06-27T12:00:00Z',
        updatedAt: '2025-06-27T12:05:00Z',
        metadata: { subscription_id: 'sub_123456' }
      });
      
      // Restaurer l'espion
      spyVerify.mockRestore();
    });
    
    it('should return null for invalid signature', () => {
      // Données de test
      const webhookData = {
        event: 'transaction.updated',
        data: {
          transaction: {
            id: 'txn_123456',
            status: 'approved'
          }
        }
      };
      
      // Espionner la méthode verifyWebhookSignature
      const spyVerify = jest.spyOn(fedaPayService, 'verifyWebhookSignature').mockReturnValue(false);
      
      // Appeler la méthode à tester
      const result = fedaPayService.processWebhook(webhookData, 'invalid_signature');
      
      // Vérifier que la méthode verifyWebhookSignature a été appelée
      expect(spyVerify).toHaveBeenCalledWith(webhookData, 'invalid_signature');
      
      // Vérifier le résultat
      expect(result).toBeNull();
      
      // Restaurer l'espion
      spyVerify.mockRestore();
    });
    
    it('should return null for non-transaction events', () => {
      // Données de test
      const webhookData = {
        event: 'other.event',
        data: {}
      };
      
      // Espionner la méthode verifyWebhookSignature
      const spyVerify = jest.spyOn(fedaPayService, 'verifyWebhookSignature').mockReturnValue(true);
      
      // Appeler la méthode à tester
      const result = fedaPayService.processWebhook(webhookData, 'valid_signature');
      
      // Vérifier le résultat
      expect(result).toBeNull();
      
      // Restaurer l'espion
      spyVerify.mockRestore();
    });
  });
});
