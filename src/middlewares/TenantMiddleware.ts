/**
 * Middleware pour l'identification et la validation du tenant (école)
 * @module middlewares/TenantMiddleware
 */

import { Request, Response, NextFunction } from 'express';
import { School } from '../models/School';
import { SchoolStatus } from '../types/common';

/**
 * Interface pour étendre l'objet Request d'Express avec les informations du tenant
 */
// Utilisation de la syntaxe de module ES2015 au lieu de namespace
import 'express';

// Définir le type SchoolWithIndex pour la compatibilité avec le type tenant dans auth.ts
type SchoolWithIndex = School & {
  [key: string]: unknown;
};

// Étendre l'interface Request pour ajouter les propriétés manquantes
declare module 'express' {
  interface Request {
    // Ces propriétés sont utilisées dans ce middleware mais ne sont pas déclarées dans auth.ts
    subdomain?: string;
    tenantId?: string;
  }
}

/**
 * Middleware pour identifier et valider le tenant (école) à partir du sous-domaine
 */
export const TenantMiddleware = {
  /**
   * Identifie le tenant à partir du sous-domaine dans l'URL
   * Ajoute tenant, tenantId et subdomain à l'objet request
   */
  identify: async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Récupérer le sous-domaine à partir du hostname
      const hostname = req.hostname;
      const baseUrl = process.env.BASE_DOMAIN || 'academiahub.com';
      
      // Si c'est localhost ou l'URL principale sans sous-domaine, pas de tenant
      if (hostname === 'localhost' || hostname === baseUrl) {
        return next();
      }
      
      // Extraire le sous-domaine
      const subdomain = hostname.replace(`.${baseUrl}`, '');
      
      if (subdomain) {
        req.subdomain = subdomain;
        
        // Chercher l'école correspondant au sous-domaine
        const school = await School.findBySubdomain(subdomain);
        
        if (school) {
          // Conversion explicite pour résoudre l'erreur de type
          req.tenant = school as SchoolWithIndex;
          req.tenantId = school.id;
        }
      }
      
      next();
    } catch (error) {
      console.error('Erreur dans TenantMiddleware.identify:', error);
      next();
    }
  },

  /**
   * Vérifie que le tenant existe
   * À utiliser sur les routes qui nécessitent un tenant valide
   */
  require: (req: Request, res: Response, next: NextFunction) => {
    if (!req.tenant) {
      return res.status(404).json({
        success: false,
        message: 'École non trouvée'
      });
    }
    
    next();
  },

  /**
   * Vérifie que le tenant est actif
   * À utiliser sur les routes qui nécessitent un tenant actif
   */
  requireActive: (req: Request, res: Response, next: NextFunction) => {
    if (!req.tenant) {
      return res.status(404).json({
        success: false,
        message: 'École non trouvée'
      });
    }
    
    if (req.tenant.status !== SchoolStatus.ACTIVE) {
      return res.status(403).json({
        success: false,
        message: 'Cette école n\'est pas active',
        status: req.tenant.status
      });
    }
    
    next();
  },

  /**
   * Vérifie que le tenant a passé la vérification KYC
   * À utiliser sur les routes qui nécessitent un tenant vérifié
   */
  requireKycVerified: (req: Request, res: Response, next: NextFunction) => {
    if (!req.tenant) {
      return res.status(404).json({
        success: false,
        message: 'École non trouvée'
      });
    }
    
    // Vérification de type pour s'assurer que isKycVerified est une fonction
    if (typeof req.tenant.isKycVerified === 'function' && !req.tenant.isKycVerified()) {
      return res.status(403).json({
        success: false,
        message: 'La vérification KYC de cette école n\'est pas complète',
        kyc_status: req.tenant.kyc_status
      });
    }
    
    next();
  }
};

export default TenantMiddleware;
