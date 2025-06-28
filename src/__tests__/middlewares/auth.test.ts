/**
 * Tests unitaires pour les middlewares d'authentification
 * @module __tests__/middlewares/auth
 */

import { Request, Response, NextFunction } from 'express';
import { authenticateJWT, requireTenant, requireSystemAdmin } from '../../middleware/auth';
import { User } from '../../models/User';
import { School } from '../../models/School';
import { UserRole, SchoolStatus } from '../../types/common';
import jwt from 'jsonwebtoken';

// Mock des modules
jest.mock('jsonwebtoken');
jest.mock('../../models/User');
jest.mock('../../models/School');

describe('Authentication Middleware', () => {
  // Mocks pour les objets Request, Response et NextFunction
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
    
    // Configurer les variables d'environnement
    process.env.JWT_SECRET = 'test_secret';
    
    // Configurer les mocks pour req, res et next
    mockRequest = {
      headers: {},
      user: undefined,
      tenant: undefined
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    nextFunction = jest.fn();
  });

  describe('authenticateJWT', () => {
    it('should pass if valid token is provided', async () => {
      // Configurer le token dans les headers
      mockRequest.headers = {
        authorization: 'Bearer valid_token'
      };
      
      // Mock de la vérification JWT
      const mockDecodedToken = { 
        userId: 'user_123',
        tenantId: 'tenant_123'
      };
      
      (jwt.verify as jest.Mock).mockReturnValue(mockDecodedToken);
      
      // Mock de la recherche utilisateur
      const mockUser = {
        id: 'user_123',
        tenant_id: 'tenant_123',
        role: UserRole.ADMIN,
        isSystemAdmin: jest.fn().mockReturnValue(false)
      };
      
      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      
      // Appeler le middleware
      await authenticateJWT(mockRequest as Request, mockResponse as Response, nextFunction);
      
      // Vérifier que next() a été appelé
      expect(nextFunction).toHaveBeenCalled();
      
      // Vérifier que l'utilisateur a été attaché à la requête
      expect(mockRequest.user).toEqual(mockUser);
    });

    it('should return 401 if no token is provided', async () => {
      // Appeler le middleware sans token
      await authenticateJWT(mockRequest as Request, mockResponse as Response, nextFunction);
      
      // Vérifier que la réponse est 401
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Accès non autorisé. Token manquant.'
      });
      
      // Vérifier que next() n'a pas été appelé
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', async () => {
      // Configurer le token dans les headers
      mockRequest.headers = {
        authorization: 'Bearer invalid_token'
      };
      
      // Mock de la vérification JWT pour rejeter
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });
      
      // Appeler le middleware
      await authenticateJWT(mockRequest as Request, mockResponse as Response, nextFunction);
      
      // Vérifier que la réponse est 401
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token invalide.'
      });
      
      // Vérifier que next() n'a pas été appelé
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 401 if user not found', async () => {
      // Configurer le token dans les headers
      mockRequest.headers = {
        authorization: 'Bearer valid_token'
      };
      
      // Mock de la vérification JWT
      const mockDecodedToken = { 
        userId: 'nonexistent_user',
        tenantId: 'tenant_123'
      };
      
      (jwt.verify as jest.Mock).mockReturnValue(mockDecodedToken);
      
      // Mock de la recherche utilisateur pour retourner null
      (User.findById as jest.Mock).mockResolvedValue(null);
      
      // Appeler le middleware
      await authenticateJWT(mockRequest as Request, mockResponse as Response, nextFunction);
      
      // Vérifier que la réponse est 401
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Utilisateur non trouvé.'
      });
      
      // Vérifier que next() n'a pas été appelé
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe('requireTenant', () => {
    it('should pass if user has valid tenant', async () => {
      // Configurer l'utilisateur dans la requête
      const mockUser = {
        id: 'user_123',
        tenant_id: 'tenant_123',
        role: UserRole.ADMIN
      };
      
      mockRequest.user = mockUser;
      
      // Mock de la recherche école
      const mockSchool = {
        id: 'tenant_123',
        status: SchoolStatus.ACTIVE,
        isActive: jest.fn().mockReturnValue(true)
      };
      
      (School.findById as jest.Mock).mockResolvedValue(mockSchool);
      
      // Appeler le middleware
      await requireTenant(mockRequest as Request, mockResponse as Response, nextFunction);
      
      // Vérifier que next() a été appelé
      expect(nextFunction).toHaveBeenCalled();
      
      // Vérifier que le tenant a été attaché à la requête
      expect(mockRequest.tenant).toEqual(mockSchool);
    });

    it('should return 403 if user has no tenant_id', async () => {
      // Configurer l'utilisateur sans tenant_id
      const mockUser = {
        id: 'user_123',
        tenant_id: null,
        role: UserRole.ADMIN
      };
      
      mockRequest.user = mockUser;
      
      // Appeler le middleware
      await requireTenant(mockRequest as Request, mockResponse as Response, nextFunction);
      
      // Vérifier que la réponse est 403
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Accès refusé. Aucune école associée.'
      });
      
      // Vérifier que next() n'a pas été appelé
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 404 if tenant not found', async () => {
      // Configurer l'utilisateur avec tenant_id
      const mockUser = {
        id: 'user_123',
        tenant_id: 'nonexistent_tenant',
        role: UserRole.ADMIN
      };
      
      mockRequest.user = mockUser;
      
      // Mock de la recherche école pour retourner null
      (School.findById as jest.Mock).mockResolvedValue(null);
      
      // Appeler le middleware
      await requireTenant(mockRequest as Request, mockResponse as Response, nextFunction);
      
      // Vérifier que la réponse est 404
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'École non trouvée.'
      });
      
      // Vérifier que next() n'a pas été appelé
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 403 if tenant is not active', async () => {
      // Configurer l'utilisateur avec tenant_id
      const mockUser = {
        id: 'user_123',
        tenant_id: 'tenant_123',
        role: UserRole.ADMIN
      };
      
      mockRequest.user = mockUser;
      
      // Mock de la recherche école avec statut inactif
      const mockSchool = {
        id: 'tenant_123',
        status: SchoolStatus.INACTIVE,
        isActive: jest.fn().mockReturnValue(false)
      };
      
      (School.findById as jest.Mock).mockResolvedValue(mockSchool);
      
      // Appeler le middleware
      await requireTenant(mockRequest as Request, mockResponse as Response, nextFunction);
      
      // Vérifier que la réponse est 403
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'École inactive ou suspendue.'
      });
      
      // Vérifier que next() n'a pas été appelé
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe('requireSystemAdmin', () => {
    it('should pass if user is system admin', async () => {
      // Configurer l'utilisateur comme admin système
      const mockUser = {
        id: 'user_123',
        role: UserRole.SYSTEM_ADMIN,
        isSystemAdmin: jest.fn().mockReturnValue(true)
      };
      
      mockRequest.user = mockUser;
      
      // Appeler le middleware
      await requireSystemAdmin(mockRequest as Request, mockResponse as Response, nextFunction);
      
      // Vérifier que next() a été appelé
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should return 403 if user is not system admin', async () => {
      // Configurer l'utilisateur comme non admin système
      const mockUser = {
        id: 'user_123',
        role: UserRole.ADMIN,
        isSystemAdmin: jest.fn().mockReturnValue(false)
      };
      
      mockRequest.user = mockUser;
      
      // Appeler le middleware
      await requireSystemAdmin(mockRequest as Request, mockResponse as Response, nextFunction);
      
      // Vérifier que la réponse est 403
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Accès refusé. Droits administrateur système requis.'
      });
      
      // Vérifier que next() n'a pas été appelé
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 401 if no user in request', async () => {
      // Ne pas configurer d'utilisateur dans la requête
      mockRequest.user = undefined;
      
      // Appeler le middleware
      await requireSystemAdmin(mockRequest as Request, mockResponse as Response, nextFunction);
      
      // Vérifier que la réponse est 401
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Authentification requise.'
      });
      
      // Vérifier que next() n'a pas été appelé
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });
});
