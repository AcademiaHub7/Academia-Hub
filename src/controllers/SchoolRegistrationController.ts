/**
 * Contrôleur pour le processus d'inscription des écoles
 * @module controllers/SchoolRegistrationController
 */

import { Request, Response } from 'express';
import { registrationService } from '../services/registration/registrationService';
import { School } from '../models/School';
import { User } from '../models/User';
import { UserRole, SchoolStatus } from '../types/common';
import { sendEmail } from '../services/email/emailService';

/**
 * Contrôleur pour gérer le processus d'inscription multi-étapes des écoles
 */
export class SchoolRegistrationController {
  /**
   * Démarre une nouvelle session d'inscription
   */
  static async startRegistration(req: Request, res: Response) {
    try {
      const sessionId = await registrationService.startSession();
      
      return res.status(200).json({
        success: true,
        message: 'Session d\'inscription démarrée',
        session_id: sessionId
      });
    } catch (error) {
      console.error('Erreur lors du démarrage de la session d\'inscription:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors du démarrage de la session d\'inscription'
      });
    }
  }

  /**
   * Vérifie la disponibilité d'un sous-domaine
   */
  static async checkSubdomainAvailability(req: Request, res: Response) {
    try {
      const { subdomain } = req.body;
      
      if (!subdomain) {
        return res.status(400).json({
          success: false,
          message: 'Le sous-domaine est requis'
        });
      }
      
      const isAvailable = await registrationService.isSubdomainAvailable(subdomain);
      
      return res.status(200).json({
        success: true,
        is_available: isAvailable
      });
    } catch (error) {
      console.error('Erreur lors de la vérification du sous-domaine:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification du sous-domaine'
      });
    }
  }

  /**
   * Vérifie la disponibilité d'une adresse email
   */
  static async checkEmailAvailability(req: Request, res: Response) {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'L\'adresse email est requise'
        });
      }
      
      const isAvailable = await registrationService.isEmailAvailable(email);
      
      return res.status(200).json({
        success: true,
        is_available: isAvailable
      });
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'email:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification de l\'email'
      });
    }
  }

  /**
   * Soumet les informations du promoteur et de l'école
   */
  static async submitPromoterAndSchoolInfo(req: Request, res: Response) {
    try {
      const { session_id, promoter_info, school_info } = req.body;
      
      if (!session_id || !promoter_info || !school_info) {
        return res.status(400).json({
          success: false,
          message: 'Informations incomplètes'
        });
      }
      
      // Valider les informations du promoteur
      if (!promoter_info.email || !promoter_info.first_name || !promoter_info.last_name) {
        return res.status(400).json({
          success: false,
          message: 'Informations du promoteur incomplètes'
        });
      }
      
      // Valider les informations de l'école
      if (!school_info.name || !school_info.subdomain) {
        return res.status(400).json({
          success: false,
          message: 'Informations de l\'école incomplètes'
        });
      }
      
      // Vérifier la disponibilité du sous-domaine
      const isSubdomainAvailable = await registrationService.isSubdomainAvailable(school_info.subdomain);
      if (!isSubdomainAvailable) {
        return res.status(400).json({
          success: false,
          message: 'Ce sous-domaine est déjà utilisé'
        });
      }
      
      // Vérifier la disponibilité de l'email
      const isEmailAvailable = await registrationService.isEmailAvailable(promoter_info.email);
      if (!isEmailAvailable) {
        return res.status(400).json({
          success: false,
          message: 'Cette adresse email est déjà utilisée'
        });
      }
      
      // Enregistrer les informations dans la session
      await registrationService.savePromoterInfo(session_id, promoter_info);
      await registrationService.saveSchoolInfo(session_id, school_info);
      
      return res.status(200).json({
        success: true,
        message: 'Informations enregistrées avec succès',
        next_step: 'subscription_plan'
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des informations:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'enregistrement des informations'
      });
    }
  }

  /**
   * Sélectionne un plan d'abonnement
   */
  static async selectSubscriptionPlan(req: Request, res: Response) {
    try {
      const { session_id, plan_id } = req.body;
      
      if (!session_id || !plan_id) {
        return res.status(400).json({
          success: false,
          message: 'Informations incomplètes'
        });
      }
      
      // Enregistrer le plan dans la session
      await registrationService.saveSubscriptionPlan(session_id, plan_id);
      
      // Générer l'URL de paiement
      const paymentUrl = await registrationService.generatePaymentUrl(session_id);
      
      return res.status(200).json({
        success: true,
        message: 'Plan d\'abonnement sélectionné',
        payment_url: paymentUrl,
        next_step: 'payment'
      });
    } catch (error) {
      console.error('Erreur lors de la sélection du plan:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la sélection du plan'
      });
    }
  }

  /**
   * Vérifie le statut du paiement
   */
  static async checkPaymentStatus(req: Request, res: Response) {
    try {
      const { session_id, transaction_id } = req.body;
      
      if (!session_id || !transaction_id) {
        return res.status(400).json({
          success: false,
          message: 'Informations incomplètes'
        });
      }
      
      // Vérifier le statut du paiement
      const paymentStatus = await registrationService.checkPaymentStatus(session_id, transaction_id);
      
      if (paymentStatus === 'completed') {
        return res.status(200).json({
          success: true,
          message: 'Paiement confirmé',
          status: paymentStatus,
          next_step: 'create_school'
        });
      } else {
        return res.status(200).json({
          success: true,
          message: 'Paiement en cours de traitement',
          status: paymentStatus
        });
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du paiement:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification du paiement'
      });
    }
  }

  /**
   * Crée l'école et le compte promoteur après paiement confirmé
   */
  static async createSchoolAfterPayment(req: Request, res: Response) {
    try {
      const { session_id, transaction_id } = req.body;
      
      if (!session_id || !transaction_id) {
        return res.status(400).json({
          success: false,
          message: 'Informations incomplètes'
        });
      }
      
      // Vérifier que le paiement est bien confirmé
      const paymentStatus = await registrationService.checkPaymentStatus(session_id, transaction_id);
      
      if (paymentStatus !== 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Le paiement n\'est pas encore confirmé',
          status: paymentStatus
        });
      }
      
      // Récupérer les informations de la session
      const sessionData = await registrationService.getSession(session_id);
      
      if (!sessionData || !sessionData.promoter_info || !sessionData.school_info || !sessionData.plan_id) {
        return res.status(400).json({
          success: false,
          message: 'Informations de session incomplètes'
        });
      }
      
      // Créer l'école avec statut initial pending_kyc
      const school = await School.create({
        name: sessionData.school_info.name,
        subdomain: sessionData.school_info.subdomain,
        status: SchoolStatus.PENDING_KYC,
        // Autres informations de l'école
      });
      
      // Générer un mot de passe temporaire pour le promoteur
      const temporaryPassword = Math.random().toString(36).slice(-8);
      
      // Créer le compte promoteur
      const promoter = await User.create({
        email: sessionData.promoter_info.email,
        first_name: sessionData.promoter_info.first_name,
        last_name: sessionData.promoter_info.last_name,
        password: temporaryPassword, // À hacher dans une implémentation réelle
        role: UserRole.PROMOTER,
        tenant_id: school.id,
        // Autres informations du promoteur
      });
      
      // Créer l'abonnement
      await registrationService.createSubscription(school.id, sessionData.plan_id, transaction_id);
      
      // Envoyer un email de confirmation avec les identifiants
      await sendEmail({
        to: promoter.email,
        subject: 'Bienvenue sur Academia Hub - Vos identifiants de connexion',
        template: 'welcome_promoter',
        context: {
          promoter_name: `${promoter.first_name} ${promoter.last_name}`,
          school_name: school.name,
          school_url: `https://${school.subdomain}.academiahub.com`,
          email: promoter.email,
          password: temporaryPassword,
          kyc_url: `https://${school.subdomain}.academiahub.com/school/kyc-verification`
        }
      });
      
      // Finaliser la session d'inscription
      await registrationService.finalizeSession(session_id);
      
      return res.status(200).json({
        success: true,
        message: 'École et compte promoteur créés avec succès',
        school_id: school.id,
        promoter_id: promoter.id,
        next_step: 'kyc_verification'
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'école:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de l\'école'
      });
    }
  }

  /**
   * Annule le processus d'inscription
   */
  static async cancelRegistration(req: Request, res: Response) {
    try {
      const { session_id } = req.body;
      
      if (!session_id) {
        return res.status(400).json({
          success: false,
          message: 'ID de session requis'
        });
      }
      
      await registrationService.cancelSession(session_id);
      
      return res.status(200).json({
        success: true,
        message: 'Inscription annulée avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de l\'annulation de l\'inscription:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'annulation de l\'inscription'
      });
    }
  }
}

export default SchoolRegistrationController;
