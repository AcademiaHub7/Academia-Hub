/**
 * Tests unitaires pour le contrôleur SchoolRegistrationController
 * @module __tests__/controllers/SchoolRegistrationController
 */

import type { Request, Response } from 'express';
import { SchoolRegistrationController } from '../../controllers/SchoolRegistrationController';
import { registrationService } from '../../services/registration/registrationService';
import { School } from '../../models/School';
import { User } from '../../models/User';
import { SchoolStatus } from '../../types/common';

// Mocks
jest.mock('../../services/registration/registrationService');
jest.mock('../../models/School');
jest.mock('../../models/User');
jest.mock('../../services/email/emailService');

describe('SchoolRegistrationController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Réinitialiser les mocks
    jest.clearAllMocks();
  });

  describe('startRegistration', () => {
    it('should start a registration session', async () => {
      const sessionId = 'session-123';
      (registrationService.startRegistrationSession as jest.Mock).mockResolvedValue({
        id: sessionId,
        step: 'school_info',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 3600 * 1000).toISOString()
      });

      await SchoolRegistrationController.startRegistration(mockRequest as Request, mockResponse as Response);

      expect(registrationService.startRegistrationSession).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Session d\'inscription démarrée',
        session_id: sessionId
      });
    });

    it('should handle errors', async () => {
      (registrationService.startRegistrationSession as jest.Mock).mockRejectedValue(new Error('Service error'));

      await SchoolRegistrationController.startRegistration(mockRequest as Request, mockResponse as Response);

      expect(registrationService.startRegistrationSession).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Erreur lors du démarrage de la session d\'inscription'
      });
    });
  });

  describe('checkSubdomainAvailability', () => {
    it('should check if subdomain is available', async () => {
      mockRequest.body = { subdomain: 'test-school' };
      (registrationService.checkSubdomainAvailability as jest.Mock).mockResolvedValue(true);

      await SchoolRegistrationController.checkSubdomainAvailability(mockRequest as Request, mockResponse as Response);

      expect(registrationService.checkSubdomainAvailability).toHaveBeenCalledWith('test-school');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        is_available: true
      });
    });

    it('should return error if subdomain is missing', async () => {
      mockRequest.body = {};

      await SchoolRegistrationController.checkSubdomainAvailability(mockRequest as Request, mockResponse as Response);

      expect(registrationService.checkSubdomainAvailability).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Le sous-domaine est requis'
      });
    });
  });

  describe('checkEmailAvailability', () => {
    it('should check if email is available', async () => {
      mockRequest.body = { email: 'test@example.com' };
      (registrationService.checkEmailAvailability as jest.Mock).mockResolvedValue(true);

      await SchoolRegistrationController.checkEmailAvailability(mockRequest as Request, mockResponse as Response);

      expect(registrationService.checkEmailAvailability).toHaveBeenCalledWith('test@example.com');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        is_available: true
      });
    });

    it('should return error if email is missing', async () => {
      mockRequest.body = {};

      await SchoolRegistrationController.checkEmailAvailability(mockRequest as Request, mockResponse as Response);

      expect(registrationService.checkEmailAvailability).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'L\'adresse email est requise'
      });
    });
  });

  describe('submitPromoterAndSchoolInfo', () => {
    it('should submit promoter and school info', async () => {
      mockRequest.body = {
        session_id: 'session-123',
        promoter_info: {
          email: 'promoter@example.com',
          first_name: 'John',
          last_name: 'Doe'
        },
        school_info: {
          name: 'Test School',
          subdomain: 'test-school'
        }
      };

      (registrationService.checkSubdomainAvailability as jest.Mock).mockResolvedValue(true);
      (registrationService.checkEmailAvailability as jest.Mock).mockResolvedValue(true);
      (registrationService.registerSchoolAndPromoter as jest.Mock).mockResolvedValue({
        id: 'session-123',
        step: 'plan_selection',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 3600 * 1000).toISOString()
      });

      await SchoolRegistrationController.submitPromoterAndSchoolInfo(mockRequest as Request, mockResponse as Response);

      expect(registrationService.checkSubdomainAvailability).toHaveBeenCalledWith('test-school');
      expect(registrationService.checkEmailAvailability).toHaveBeenCalledWith('promoter@example.com');
      expect(registrationService.registerSchoolAndPromoter).toHaveBeenCalledWith(
        'session-123',
        mockRequest.body.school_info,
        mockRequest.body.promoter_info
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Informations enregistrées avec succès',
        next_step: 'subscription_plan'
      });
    });

    it('should return error if subdomain is already taken', async () => {
      mockRequest.body = {
        session_id: 'session-123',
        promoter_info: {
          email: 'promoter@example.com',
          first_name: 'John',
          last_name: 'Doe'
        },
        school_info: {
          name: 'Test School',
          subdomain: 'test-school'
        }
      };

      (registrationService.checkSubdomainAvailability as jest.Mock).mockResolvedValue(false);

      await SchoolRegistrationController.submitPromoterAndSchoolInfo(mockRequest as Request, mockResponse as Response);

      expect(registrationService.checkSubdomainAvailability).toHaveBeenCalledWith('test-school');
      expect(registrationService.registerSchoolAndPromoter).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Ce sous-domaine est déjà utilisé'
      });
    });
  });

  describe('selectSubscriptionPlan', () => {
    it('should select subscription plan and generate payment URL', async () => {
      mockRequest.body = {
        session_id: 'session-123',
        plan_id: 'plan-123'
      };

      (registrationService.selectPlan as jest.Mock).mockResolvedValue({
        id: 'session-123',
        step: 'payment',
        plan_id: 'plan-123',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 3600 * 1000).toISOString()
      });
      (registrationService.initiatePayment as jest.Mock).mockResolvedValue({
        payment_url: 'https://payment.example.com/123',
        transaction_id: 'txn-123'
      });

      await SchoolRegistrationController.selectSubscriptionPlan(mockRequest as Request, mockResponse as Response);

      expect(registrationService.selectPlan).toHaveBeenCalledWith('session-123', 'plan-123');
      expect(registrationService.initiatePayment).toHaveBeenCalledWith('session-123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Plan d\'abonnement sélectionné',
        payment_url: 'https://payment.example.com/123',
        next_step: 'payment'
      });
    });

    it('should return error if session_id or plan_id is missing', async () => {
      mockRequest.body = { session_id: 'session-123' };

      await SchoolRegistrationController.selectSubscriptionPlan(mockRequest as Request, mockResponse as Response);

      expect(registrationService.selectPlan).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Informations incomplètes'
      });
    });
  });

  describe('checkPaymentStatus', () => {
    it('should check payment status and return completed', async () => {
      mockRequest.body = {
        session_id: 'session-123',
        transaction_id: 'txn-123'
      };

      (registrationService.checkPaymentStatus as jest.Mock).mockResolvedValue({ status: 'completed' });

      await SchoolRegistrationController.checkPaymentStatus(mockRequest as Request, mockResponse as Response);

      expect(registrationService.checkPaymentStatus).toHaveBeenCalledWith('session-123', 'txn-123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Paiement confirmé',
        status: 'completed',
        next_step: 'create_school'
      });
    });

    it('should check payment status and return pending', async () => {
      mockRequest.body = {
        session_id: 'session-123',
        transaction_id: 'txn-123'
      };

      (registrationService.checkPaymentStatus as jest.Mock).mockResolvedValue({ status: 'pending' });

      await SchoolRegistrationController.checkPaymentStatus(mockRequest as Request, mockResponse as Response);

      expect(registrationService.checkPaymentStatus).toHaveBeenCalledWith('session-123', 'txn-123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Paiement en cours de traitement',
        status: 'pending'
      });
    });
  });

  describe('createSchoolAfterPayment', () => {
    it('should create school and promoter after payment', async () => {
      mockRequest.body = {
        session_id: 'session-123',
        transaction_id: 'txn-123'
      };

      const sessionData = {
        promoter_info: {
          email: 'promoter@example.com',
          first_name: 'John',
          last_name: 'Doe'
        },
        school_info: {
          name: 'Test School',
          subdomain: 'test-school'
        },
        plan_id: 'plan-123'
      };

      const mockSchool = {
        id: 'school-123',
        name: 'Test School',
        subdomain: 'test-school',
        status: SchoolStatus.PENDING_KYC
      };

      const mockPromoter = {
        id: 'user-123',
        email: 'promoter@example.com',
        first_name: 'John',
        last_name: 'Doe'
      };

      (registrationService.checkPaymentStatus as jest.Mock).mockResolvedValue({ status: 'completed' });
      (registrationService.getRegistrationSession as jest.Mock).mockResolvedValue(sessionData);
      (School.create as jest.Mock).mockResolvedValue(mockSchool);
      (User.create as jest.Mock).mockResolvedValue(mockPromoter);
      (registrationService.finalizeRegistration as jest.Mock).mockResolvedValue({
        school: mockSchool,
        user: mockPromoter,
        subscription: { id: 'sub-123' }
      });

      await SchoolRegistrationController.createSchoolAfterPayment(mockRequest as Request, mockResponse as Response);

      expect(registrationService.checkPaymentStatus).toHaveBeenCalledWith('session-123', 'txn-123');
      expect(registrationService.getRegistrationSession).toHaveBeenCalledWith('session-123');
      expect(registrationService.finalizeRegistration).toHaveBeenCalledWith('session-123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'École et compte promoteur créés avec succès',
        school_id: 'school-123',
        promoter_id: 'user-123',
        next_step: 'kyc_verification'
      });
    });

    it('should return error if payment is not completed', async () => {
      mockRequest.body = {
        session_id: 'session-123',
        transaction_id: 'txn-123'
      };

      (registrationService.checkPaymentStatus as jest.Mock).mockResolvedValue({ status: 'pending' });

      await SchoolRegistrationController.createSchoolAfterPayment(mockRequest as Request, mockResponse as Response);

      expect(registrationService.checkPaymentStatus).toHaveBeenCalledWith('session-123', 'txn-123');
      expect(School.create).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Le paiement n\'est pas encore confirmé',
        status: 'pending'
      });
    });
  });

  describe('cancelRegistration', () => {
    it('should cancel registration session', async () => {
      mockRequest.body = { session_id: 'session-123' };
      (registrationService.cancelRegistration as jest.Mock).mockResolvedValue(true);

      await SchoolRegistrationController.cancelRegistration(mockRequest as Request, mockResponse as Response);

      expect(registrationService.cancelRegistration).toHaveBeenCalledWith('session-123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Inscription annulée avec succès'
      });
    });

    it('should return error if session_id is missing', async () => {
      mockRequest.body = {};

      await SchoolRegistrationController.cancelRegistration(mockRequest as Request, mockResponse as Response);

      expect(registrationService.cancelRegistration).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'ID de session requis'
      });
    });
  });
});
