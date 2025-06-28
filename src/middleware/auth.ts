/**
 * Middleware d'authentification
 * @module middleware/auth
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Utiliser la syntaxe de module ES2015 plutôt que les namespaces
import 'express';

// Définir un type JwtUser pour représenter les données décodées du JWT
interface JwtUser {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  tenant_id?: string;
  role?: string;
  [key: string]: unknown;
}

// Étendre l'interface Request pour inclure l'utilisateur et le tenant
declare module 'express' {
  interface Request {
    user?: JwtUser;
    tenant?: {
      id: string;
      [key: string]: unknown;
    };
  }
}

/**
 * Middleware pour vérifier le JWT et authentifier l'utilisateur
 */
export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    res.status(401).json({ success: false, message: 'Token d\'authentification manquant' });
    return;
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    // Convertir le résultat décodé en objet JwtUser
    req.user = typeof decoded === 'object' ? decoded as JwtUser : { id: String(decoded) };
    next();
  } catch (error) {
    console.error('Erreur d\'authentification JWT:', error);
    res.status(403).json({ success: false, message: 'Token invalide ou expiré' });
  }
};

/**
 * Middleware pour vérifier que l'utilisateur a un tenant associé
 */
export const requireTenant = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || !req.user.tenant_id) {
    res.status(403).json({ success: false, message: 'Accès refusé: tenant non associé' });
    return;
  }
  
  // Ajouter le tenant à la requête pour faciliter l'accès dans les contrôleurs
  if (req.user.tenant_id) {
    // Créer un objet tenant avec l'ID du tenant
    req.tenant = {
      id: req.user.tenant_id
    };
  }
  next();
};

/**
 * Middleware pour vérifier que l'utilisateur a un rôle spécifique
 */
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Accès refusé: rôle insuffisant' });
      return;
    }
    
    next();
  };
};
