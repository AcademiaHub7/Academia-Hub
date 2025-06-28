/**
 * Contrôleur pour la gestion des vérifications KYC
 * @module controllers/KYCController
 */

import { Request, Response } from 'express';
import { School } from '../models/School';
import { User } from '../models/User';
import { SchoolStatus, KYCStatus, DocumentType } from '../types/common';
import { sendEmail } from '../services/email/emailService';

/**
 * Interface pour les documents KYC
 */
interface KYCDocument {
  type: DocumentType;
  file: string; // Base64 ou chemin du fichier
  description?: string;
}

/**
 * Contrôleur pour gérer le processus de vérification KYC
 */
export class KYCController {
  /**
   * Récupère les informations KYC d'une école
   */
  static async getKYCInfo(req: Request, res: Response) {
    try {
      if (!req.tenant) {
        return res.status(404).json({
          success: false,
          message: 'École non trouvée'
        });
      }
      
      const kycInfo = {
        status: req.tenant.kyc_status,
        submitted_at: req.tenant.kyc_submitted_at,
        verified_at: req.tenant.kyc_verified_at,
        rejection_reason: req.tenant.kyc_rejection_reason,
        documents: await req.tenant.getKYCDocuments()
      };
      
      return res.status(200).json({
        success: true,
        kyc_info: kycInfo
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des informations KYC:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des informations KYC'
      });
    }
  }

  /**
   * Soumet les documents KYC pour vérification
   */
  static async submitKYCDocuments(req: Request, res: Response) {
    try {
      if (!req.tenant) {
        return res.status(404).json({
          success: false,
          message: 'École non trouvée'
        });
      }
      
      // Vérifier que l'utilisateur est bien le promoteur de l'école
      if (!req.user || !req.user.isPromoter()) {
        return res.status(403).json({
          success: false,
          message: 'Seul le promoteur peut soumettre les documents KYC'
        });
      }
      
      // Vérifier que l'école est en attente de KYC
      if (req.tenant.status !== SchoolStatus.PENDING_KYC) {
        return res.status(400).json({
          success: false,
          message: 'L\'école n\'est pas en attente de vérification KYC',
          status: req.tenant.status
        });
      }
      
      // Récupérer les documents soumis
      const { documents } = req.body;
      
      if (!documents || !Array.isArray(documents) || documents.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Aucun document soumis'
        });
      }
      
      // Vérifier que tous les types de documents requis sont présents
      const requiredDocumentTypes = [
        DocumentType.ID_CARD,
        DocumentType.SCHOOL_AUTHORIZATION,
        DocumentType.ADDRESS_PROOF,
        DocumentType.SCHOOL_PHOTOS
      ];
      
      const submittedTypes = documents.map((doc: KYCDocument) => doc.type);
      
      const missingTypes = requiredDocumentTypes.filter(
        type => !submittedTypes.includes(type)
      );
      
      if (missingTypes.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Documents requis manquants',
          missing_types: missingTypes
        });
      }
      
      // Enregistrer les documents
      await req.tenant.saveKYCDocuments(documents);
      
      // Mettre à jour le statut KYC
      await req.tenant.updateKYCStatus(KYCStatus.PENDING);
      
      // Notifier l'équipe de vérification
      await sendEmail({
        to: process.env.KYC_VERIFICATION_EMAIL || 'kyc@academiahub.com',
        subject: `Nouvelle soumission KYC - ${req.tenant.name}`,
        template: 'kyc_submission_notification',
        context: {
          school_name: req.tenant.name,
          school_id: req.tenant.id,
          promoter_name: `${req.user.first_name} ${req.user.last_name}`,
          promoter_email: req.user.email,
          submission_date: new Date().toISOString()
        }
      });
      
      return res.status(200).json({
        success: true,
        message: 'Documents KYC soumis avec succès',
        status: KYCStatus.PENDING
      });
    } catch (error) {
      console.error('Erreur lors de la soumission des documents KYC:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la soumission des documents KYC'
      });
    }
  }

  /**
   * Approuve la vérification KYC (réservé aux administrateurs système)
   */
  static async approveKYC(req: Request, res: Response) {
    try {
      const { school_id } = req.params;
      
      // Vérifier que l'utilisateur est un administrateur système
      if (!req.user || !req.user.isSystemAdmin()) {
        return res.status(403).json({
          success: false,
          message: 'Accès refusé'
        });
      }
      
      // Récupérer l'école
      const school = await School.findById(school_id);
      
      if (!school) {
        return res.status(404).json({
          success: false,
          message: 'École non trouvée'
        });
      }
      
      // Vérifier que l'école est en attente de vérification KYC
      if (school.kyc_status !== KYCStatus.PENDING) {
        return res.status(400).json({
          success: false,
          message: 'L\'école n\'est pas en attente de vérification KYC',
          status: school.kyc_status
        });
      }
      
      // Approuver la vérification KYC
      await school.updateKYCStatus(KYCStatus.VERIFIED);
      
      // Mettre à jour le statut de l'école
      await school.updateStatus(SchoolStatus.ACTIVE);
      
      // Récupérer le promoteur de l'école
      const promoter = await User.findByTenantAndRole(school.id, 'promoter');
      
      if (promoter) {
        // Notifier le promoteur
        await sendEmail({
          to: promoter.email,
          subject: 'Vérification KYC approuvée - Academia Hub',
          template: 'kyc_approved',
          context: {
            promoter_name: `${promoter.first_name} ${promoter.last_name}`,
            school_name: school.name,
            school_url: `https://${school.subdomain}.academiahub.com`
          }
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Vérification KYC approuvée avec succès',
        school_status: school.status,
        kyc_status: school.kyc_status
      });
    } catch (error) {
      console.error('Erreur lors de l\'approbation KYC:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'approbation KYC'
      });
    }
  }

  /**
   * Rejette la vérification KYC (réservé aux administrateurs système)
   */
  static async rejectKYC(req: Request, res: Response) {
    try {
      const { school_id } = req.params;
      const { rejection_reason } = req.body;
      
      // Vérifier que l'utilisateur est un administrateur système
      if (!req.user || !req.user.isSystemAdmin()) {
        return res.status(403).json({
          success: false,
          message: 'Accès refusé'
        });
      }
      
      if (!rejection_reason) {
        return res.status(400).json({
          success: false,
          message: 'Motif de rejet requis'
        });
      }
      
      // Récupérer l'école
      const school = await School.findById(school_id);
      
      if (!school) {
        return res.status(404).json({
          success: false,
          message: 'École non trouvée'
        });
      }
      
      // Vérifier que l'école est en attente de vérification KYC
      if (school.kyc_status !== KYCStatus.PENDING) {
        return res.status(400).json({
          success: false,
          message: 'L\'école n\'est pas en attente de vérification KYC',
          status: school.kyc_status
        });
      }
      
      // Rejeter la vérification KYC
      await school.rejectKYC(rejection_reason);
      
      // Récupérer le promoteur de l'école
      const promoter = await User.findByTenantAndRole(school.id, 'promoter');
      
      if (promoter) {
        // Notifier le promoteur
        await sendEmail({
          to: promoter.email,
          subject: 'Vérification KYC rejetée - Academia Hub',
          template: 'kyc_rejected',
          context: {
            promoter_name: `${promoter.first_name} ${promoter.last_name}`,
            school_name: school.name,
            rejection_reason: rejection_reason,
            resubmit_url: `https://${school.subdomain}.academiahub.com/school/kyc-verification`
          }
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Vérification KYC rejetée',
        kyc_status: school.kyc_status,
        rejection_reason: rejection_reason
      });
    } catch (error) {
      console.error('Erreur lors du rejet KYC:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors du rejet KYC'
      });
    }
  }

  /**
   * Télécharge un document KYC spécifique
   */
  static async downloadKYCDocument(req: Request, res: Response) {
    try {
      if (!req.tenant) {
        return res.status(404).json({
          success: false,
          message: 'École non trouvée'
        });
      }
      
      // Vérifier que l'utilisateur est autorisé (promoteur ou admin système)
      if (!req.user || (!req.user.isPromoter() && !req.user.isSystemAdmin())) {
        return res.status(403).json({
          success: false,
          message: 'Accès refusé'
        });
      }
      
      const { document_id } = req.params;
      
      // Récupérer le document
      const document = await req.tenant.getKYCDocument(document_id);
      
      if (!document) {
        return res.status(404).json({
          success: false,
          message: 'Document non trouvé'
        });
      }
      
      // Dans une implémentation réelle, retourner le fichier
      // Ici, nous simulons un téléchargement
      
      return res.status(200).json({
        success: true,
        document: {
          id: document_id,
          type: document.type,
          filename: document.filename,
          // Dans une implémentation réelle, ne pas retourner le contenu du fichier
          // mais plutôt configurer le header pour un téléchargement
        }
      });
    } catch (error) {
      console.error('Erreur lors du téléchargement du document KYC:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors du téléchargement du document KYC'
      });
    }
  }
}

export default KYCController;
