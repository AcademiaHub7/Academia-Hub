/**
 * Middleware pour la vérification des rôles et permissions
 * @module middlewares/RoleMiddleware
 */

import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { UserRole } from '../types/common';
import { Permission } from '../services/auth/permissionService';

// Définir le type JwtUser pour la compatibilité avec auth.ts
type JwtUser = {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  tenant_id?: string;
  role?: string;
  [key: string]: unknown;
};

// Type utilisé pour la conversion de User vers JwtUser
type UserWithRole = User & { role?: UserRole };

// Remarque: Nous n'étendons pas l'interface Request ici car elle est déjà étendue dans auth.ts
// Nous utilisons directement les types définis là-bas

/**
 * Middleware pour vérifier les rôles et permissions des utilisateurs
 */
export const RoleMiddleware = {
  /**
   * Vérifie que l'utilisateur est authentifié
   * Ajoute user et userId à l'objet request
   */
  auth: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Vérifier si le token est présent dans les headers
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'Authentification requise'
        });
      }
      
      // Extraction du token mais pas utilisé directement pour l'instant
      // const token = authHeader.split(' ')[1];
      
      // Vérifier et décoder le token JWT
      // Note: Dans une implémentation réelle, utilisez une bibliothèque JWT
      // et vérifiez la signature du token
      
      // Simuler la récupération de l'utilisateur à partir du token
      // Dans une implémentation réelle, décodez le token et récupérez l'ID utilisateur
      const userId = 'user_id_from_token'; // À remplacer par la logique réelle
      
      // Récupérer l'utilisateur à partir de l'ID
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }
      
      // Vérifier si l'utilisateur est actif
      if (!user.isActive()) {
        return res.status(403).json({
          success: false,
          message: 'Compte utilisateur inactif'
        });
      }
      
      // Ajouter l'utilisateur à l'objet request en le convertissant en JwtUser
      const userWithRole = user as UserWithRole;
      req.user = {
        id: userWithRole.id,
        email: userWithRole.email,
        role: userWithRole.role,
        // Ajouter d'autres propriétés nécessaires
        ...userWithRole
      } as JwtUser;
      req.userId = user.id;
      
      next();
    } catch (error) {
      console.error('Erreur dans RoleMiddleware.auth:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'authentification'
      });
    }
  },

  /**
   * Vérifie que l'utilisateur appartient au tenant actuel
   * À utiliser après les middlewares auth et tenant
   */
  requireSameTenant: (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.tenant) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }
    
    if (req.user.tenant_id !== req.tenant.id) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'avez pas accès à cette école'
      });
    }
    
    next();
  },

  /**
   * Vérifie que l'utilisateur a un rôle spécifique
   * @param roles - Liste des rôles autorisés
   */
  hasRole: (roles: UserRole | UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentification requise'
        });
      }
      
      const rolesToCheck = Array.isArray(roles) ? roles : [roles];
      
      // Vérification de type pour s'assurer que req.user.role n'est pas undefined
      const userRole = req.user.role as UserRole;
      if (!rolesToCheck.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'Accès refusé: rôle insuffisant'
        });
      }
      
      next();
    };
  },

  /**
   * Vérifie que l'utilisateur est un promoteur
   */
  isPromoter: (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }
    
    // Vérification de type pour s'assurer que isPromoter est une fonction
    if (typeof req.user.isPromoter === 'function' && !req.user.isPromoter()) {
      return res.status(403).json({
        success: false,
        message: 'Accès réservé au promoteur de l\'école'
      });
    }
    
    next();
  },

  /**
   * Vérifie que l'utilisateur est un administrateur ou promoteur
   */
  isAdmin: (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }
    
    // Vérification de type pour s'assurer que isAdmin et isPromoter sont des fonctions
    const isAdminFunc = typeof req.user.isAdmin === 'function' ? req.user.isAdmin() : false;
    const isPromoterFunc = typeof req.user.isPromoter === 'function' ? req.user.isPromoter() : false;
    
    if (!isAdminFunc && !isPromoterFunc) {
      return res.status(403).json({
        success: false,
        message: 'Accès réservé aux administrateurs'
      });
    }
    
    next();
  },

  /**
   * Vérifie que l'utilisateur a une permission spécifique
   * @param permissions - Liste des permissions requises (toutes nécessaires)
   */
  hasPermission: (requiredPermissions: Permission | Permission[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentification requise'
        });
      }
      
      // Vérifier chaque permission requise
      // Dans une implémentation réelle, utilisez le service de permissions
      // pour vérifier les permissions en fonction du rôle de l'utilisateur
      
      // Conversion en tableau si nécessaire (utilisé pour la vérification)
      const permissionsArray = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
      console.log(`Vérification des permissions: ${permissionsArray.join(', ')}`);
      
      // Simuler la vérification des permissions
      const hasAllPermissions = true; // À remplacer par la logique réelle
      
      if (!hasAllPermissions) {
        return res.status(403).json({
          success: false,
          message: 'Accès refusé: permissions insuffisantes'
        });
      }
      
      next();
    };
  },

  /**
   * Vérifie que l'utilisateur a au moins une des permissions spécifiées
   * @param permissions - Liste des permissions (au moins une nécessaire)
   */
  hasAnyPermission: (permissionOptions: Permission[]) => {
    // Utilisation de permissionOptions pour la vérification
    return async (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentification requise'
        });
      }
      
      // Vérifier si l'utilisateur a au moins une des permissions
      // Dans une implémentation réelle, utilisez le service de permissions
      
      // Log des permissions à vérifier
      console.log(`Vérification d'au moins une permission parmi: ${permissionOptions.join(', ')}`);
      
      // Simuler la vérification des permissions
      const hasAnyPermission = permissionOptions.length > 0; // À remplacer par la logique réelle
      
      if (!hasAnyPermission) {
        return res.status(403).json({
          success: false,
          message: 'Accès refusé: permissions insuffisantes'
        });
      }
      
      next();
    };
  }
};

export default RoleMiddleware;
