/**
 * Tests unitaires pour le middleware TenantMiddleware
 * @module __tests__/middlewares/TenantMiddleware
 */

import { Request, Response } from 'express';
import { TenantMiddleware } from '../../middlewares/TenantMiddleware';
import { School } from '../../models/School';
import { SchoolStatus } from '../../types/common';

// Mock de la classe School
jest.mock('../../models/School', () => {
  return {
    School: {
      findBySubdomain: jest.fn()
    }
  };
});

describe('TenantMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      hostname: 'test-school.academiahub.com'
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
    
    process.env.BASE_DOMAIN = 'academiahub.com';
    
    // Réinitialiser les mocks
    jest.clearAllMocks();
  });

  describe('identify', () => {
    it('should identify tenant by subdomain', async () => {
      const req = {
        ...mockRequest,
        hostname: 'test-school.academiahub.com',
        subdomain: undefined,
        tenant: undefined,
        tenantId: undefined
      } as Request;
      
      const mockSchool = {
        id: 'school-123',
        name: 'Test School',
        subdomain: 'test-school',
        status: 'active'
      };
      
      (School.findBySubdomain as jest.Mock).mockResolvedValue(mockSchool);
      
      await TenantMiddleware.identify(req, mockResponse as Response, nextFunction);
      
      expect(School.findBySubdomain).toHaveBeenCalledWith('test-school');
      expect(req.subdomain).toBe('test-school');
      expect(req.tenant).toEqual(mockSchool);
      expect(req.tenantId).toBe('school-123');
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should not set tenant for main domain', async () => {
      const req = {
        ...mockRequest,
        hostname: 'academiahub.com',
        subdomain: undefined,
        tenant: undefined,
        tenantId: undefined
      } as Request;
      
      await TenantMiddleware.identify(req, mockResponse as Response, nextFunction);
      
      expect(School.findBySubdomain).not.toHaveBeenCalled();
      expect(req.subdomain).toBeUndefined();
      expect(req.tenant).toBeUndefined();
      expect(req.tenantId).toBeUndefined();
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should not set tenant for localhost', async () => {
      const req = {
        ...mockRequest,
        hostname: 'localhost',
        subdomain: undefined,
        tenant: undefined,
        tenantId: undefined
      } as Request;
      
      await TenantMiddleware.identify(req, mockResponse as Response, nextFunction);
      
      expect(School.findBySubdomain).not.toHaveBeenCalled();
      expect(req.subdomain).toBeUndefined();
      expect(req.tenant).toBeUndefined();
      expect(req.tenantId).toBeUndefined();
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should set subdomain but not tenant if school not found', async () => {
      const req = {
        ...mockRequest,
        hostname: 'test-school.academiahub.com',
        subdomain: undefined,
        tenant: undefined,
        tenantId: undefined
      } as Request;
      
      (School.findBySubdomain as jest.Mock).mockResolvedValue(null);
      
      await TenantMiddleware.identify(req, mockResponse as Response, nextFunction);
      
      expect(School.findBySubdomain).toHaveBeenCalledWith('test-school');
      expect(req.subdomain).toBe('test-school');
      expect(req.tenant).toBeUndefined();
      expect(req.tenantId).toBeUndefined();
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Database error');
      (School.findBySubdomain as jest.Mock).mockRejectedValue(error);
      
      const req = {
        ...mockRequest,
        hostname: 'test-school.academiahub.com',
        subdomain: undefined,
        tenant: undefined,
        tenantId: undefined
      } as Request;
      
      await TenantMiddleware.identify(req, mockResponse as Response, nextFunction);
      
      expect(School.findBySubdomain).toHaveBeenCalledWith('test-school');
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Erreur lors de la récupération du tenant',
        error: error.message
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 404 if tenant does not exist', async () => {
      const req = {
        ...mockRequest,
        hostname: 'test-school.academiahub.com',
        subdomain: undefined,
        tenant: undefined,
        tenantId: undefined
      } as Request;
      
      await TenantMiddleware.identify(req, mockResponse as Response, nextFunction);
      
      expect(School.findBySubdomain).toHaveBeenCalledWith('test-school');
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'École non trouvée pour le sous-domaine test-school'
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe('require', () => {
    it('should call next if tenant exists', () => {
      const req = {
        ...mockRequest,
        tenant: {
          id: 'school-123',
          name: 'Test School',
          subdomain: 'test-school',
          status: SchoolStatus.ACTIVE
        }
      } as Request;
      
      TenantMiddleware.require(req, mockResponse as Response, nextFunction);
      
      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should return 404 if tenant does not exist', () => {
      mockRequest.tenant = undefined;
      
      TenantMiddleware.require(mockRequest as Request, mockResponse as Response, nextFunction);
      
      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'École non trouvée'
      });
    });
  });

  describe('requireActive', () => {
    it('should call next if tenant is active', () => {
      const req = {
        ...mockRequest,
        tenant: {
          id: 'school-123',
          name: 'Test School',
          status: SchoolStatus.ACTIVE
        }
      } as Request;
      
      TenantMiddleware.requireActive(req, mockResponse as Response, nextFunction);
      
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should return 404 if tenant does not exist', () => {
      mockRequest.tenant = undefined;
      
      TenantMiddleware.requireActive(mockRequest as Request, mockResponse as Response, nextFunction);
      
      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'École non trouvée'
      });
    });

    it('should return 403 if tenant is not active', () => {
      const req = {
        ...mockRequest,
        tenant: {
          id: 'school-123',
          name: 'Test School',
          status: SchoolStatus.PENDING_KYC
        }
      } as Request;
      
      TenantMiddleware.requireActive(req, mockResponse as Response, nextFunction);
      
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Ce compte école n\'est pas actif'
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe('requireKycVerified', () => {
    it('should call next if tenant KYC is verified', () => {
      const tenant = {
        id: 'school-123',
        name: 'Test School',
        subdomain: 'test-school',
        status: SchoolStatus.ACTIVE,
        subscription_plan_id: 'plan-123',
        payment_status: 'active',
        kyc_status: 'verified',
        settings: {},
        features: {},
        created_at: new Date(),
        updated_at: new Date(),
        phone: '+1234567890',
        email: 'test@school.com',
        address: '123 Test St',
        city: 'Test City',
        country: 'Test Country',
        postal_code: '12345',
        logo_url: 'https://example.com/logo.png',
        website: 'https://test-school.com',
        isKycVerified: jest.fn().mockReturnValue(true),
        save: jest.fn()
      } as unknown as School;
      
      const req = {
        ...mockRequest,
        tenant
      } as unknown as Request;
      
      TenantMiddleware.requireKycVerified(req, mockResponse as Response, nextFunction);
      
      expect(tenant.isKycVerified).toHaveBeenCalled();
      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should return 404 if tenant does not exist', () => {
      mockRequest.tenant = undefined;
      
      TenantMiddleware.requireKycVerified(mockRequest as Request, mockResponse as Response, nextFunction);
      
      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'École non trouvée'
      });
    });

    it('should return 403 if tenant KYC is not verified', () => {
      const tenant = {
        id: 'school-123',
        name: 'Test School',
        subdomain: 'test-school',
        status: SchoolStatus.PENDING_KYC,
        isKycVerified: jest.fn().mockReturnValue(false),
        kyc_status: 'pending',
        created_at: new Date(),
        updated_at: new Date(),
        save: jest.fn()
      };
      
      mockRequest.tenant = tenant as unknown as School;
      
      TenantMiddleware.requireKycVerified(mockRequest as Request, mockResponse as Response, nextFunction);
      
      expect(mockRequest.tenant?.isKycVerified).toHaveBeenCalled();
      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'La vérification KYC de cette école n\'est pas complète',
        kyc_status: 'pending'
      });
    });
  });
});
