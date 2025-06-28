/**
 * Middleware pour la vérification des abonnements
 * @module middlewares/SubscriptionMiddleware
 */

import { Request, Response, NextFunction } from 'express';
import { Subscription } from '../models/Subscription';
import { SubscriptionStatus } from '../types/common';

/**
 * Middleware pour vérifier les abonnements des tenants
 */
export const SubscriptionMiddleware = {
  /**
   * Vérifie que le tenant a un abonnement actif
   * À utiliser après le middleware tenant
   */
  requireActiveSubscription: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.tenant) {
        return res.status(404).json({
          success: false,
          message: 'École non trouvée'
        });
      }
      
      // Récupérer l'abonnement actif du tenant
      const subscription = await req.tenant.getActiveSubscription();
      
      if (!subscription) {
        return res.status(403).json({
          success: false,
          message: 'Aucun abonnement actif trouvé pour cette école'
        });
      }
      
      if (subscription.status !== SubscriptionStatus.ACTIVE) {
        return res.status(403).json({
          success: false,
          message: 'L\'abonnement de cette école n\'est pas actif',
          status: subscription.status
        });
      }
      
      // Vérifier si l'abonnement est expiré
      if (subscription.isExpired()) {
        return res.status(403).json({
          success: false,
          message: 'L\'abonnement de cette école est expiré',
          expired_at: subscription.end_date
        });
      }
      
      // Ajouter l'abonnement à l'objet request pour une utilisation ultérieure
      req.subscription = subscription;
      
      next();
    } catch (error) {
      console.error('Erreur dans SubscriptionMiddleware.requireActiveSubscription:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification de l\'abonnement'
      });
    }
  },

  /**
   * Vérifie que le tenant n'est pas en période d'essai
   * Utile pour restreindre certaines fonctionnalités aux abonnements payants
   */
  requirePaidSubscription: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.tenant) {
        return res.status(404).json({
          success: false,
          message: 'École non trouvée'
        });
      }
      
      // Récupérer l'abonnement actif du tenant
      const subscription = await req.tenant.getActiveSubscription();
      
      if (!subscription) {
        return res.status(403).json({
          success: false,
          message: 'Aucun abonnement actif trouvé pour cette école'
        });
      }
      
      // Vérifier si l'abonnement est en période d'essai
      if (subscription.isInTrialPeriod()) {
        return res.status(403).json({
          success: false,
          message: 'Cette fonctionnalité n\'est pas disponible pendant la période d\'essai',
          trial_ends_at: subscription.trial_ends_at
        });
      }
      
      next();
    } catch (error) {
      console.error('Erreur dans SubscriptionMiddleware.requirePaidSubscription:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification de l\'abonnement'
      });
    }
  },

  /**
   * Vérifie que le tenant a un abonnement qui expire bientôt (dans les 7 jours)
   * Utile pour afficher des notifications de renouvellement
   */
  checkExpirationSoon: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.tenant) {
        return next();
      }
      
      // Récupérer l'abonnement actif du tenant
      const subscription = await req.tenant.getActiveSubscription();
      
      if (subscription && subscription.status === SubscriptionStatus.ACTIVE) {
        const remainingDays = subscription.getRemainingDays();
        
        if (remainingDays <= 7) {
          // Ajouter une information à l'objet request
          req.subscriptionExpiringDays = remainingDays;
        }
      }
      
      next();
    } catch (error) {
      console.error('Erreur dans SubscriptionMiddleware.checkExpirationSoon:', error);
      // Ne pas bloquer la requête en cas d'erreur
      next();
    }
  },

  /**
   * Vérifie les limites d'utilisation en fonction du plan d'abonnement
   * @param resourceType - Type de ressource à vérifier (utilisateurs, classes, etc.)
   */
  checkUsageLimits: (resourceType: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.tenant) {
          return res.status(404).json({
            success: false,
            message: 'École non trouvée'
          });
        }
        
        // Récupérer l'abonnement actif du tenant
        const subscription = await req.tenant.getActiveSubscription();
        
        if (!subscription) {
          return res.status(403).json({
            success: false,
            message: 'Aucun abonnement actif trouvé pour cette école'
          });
        }
        
        // Récupérer le plan associé à l'abonnement
        const plan = await subscription.getPlan();
        
        if (!plan) {
          return res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du plan d\'abonnement'
          });
        }
        
        // Vérifier les limites en fonction du type de ressource
        // Dans une implémentation réelle, récupérez les limites du plan
        // et comparez-les avec l'utilisation actuelle
        
        let isLimitReached = false;
        let currentUsage = 0;
        let maxAllowed = 0;
        
        switch (resourceType) {
          case 'users':
            // Simuler la vérification des limites d'utilisateurs
            currentUsage = 50; // À remplacer par la logique réelle
            maxAllowed = 100; // À remplacer par la limite du plan
            isLimitReached = currentUsage >= maxAllowed;
            break;
            
          case 'classes':
            // Simuler la vérification des limites de classes
            currentUsage = 10; // À remplacer par la logique réelle
            maxAllowed = 20; // À remplacer par la limite du plan
            isLimitReached = currentUsage >= maxAllowed;
            break;
            
          // Ajouter d'autres types de ressources selon les besoins
        }
        
        if (isLimitReached) {
          return res.status(403).json({
            success: false,
            message: `Limite d'utilisation atteinte pour ${resourceType}`,
            current: currentUsage,
            max: maxAllowed
          });
        }
        
        next();
      } catch (error) {
        console.error(`Erreur dans SubscriptionMiddleware.checkUsageLimits(${resourceType}):`, error);
        return res.status(500).json({
          success: false,
          message: 'Erreur lors de la vérification des limites d\'utilisation'
        });
      }
    };
  }
};

// Étendre l'interface Request pour inclure les propriétés ajoutées par ce middleware
declare global {
  namespace Express {
    interface Request {
      subscription?: Subscription;
      subscriptionExpiringDays?: number;
    }
  }
}

export default SubscriptionMiddleware;
