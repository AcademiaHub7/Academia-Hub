/**
 * Contrôleur pour la gestion des paiements avec FedaPay
 * @module controllers/PaymentController
 */

import { Request, Response } from 'express';
import { Subscription } from '../models/Subscription';
import { School } from '../models/School';
import { SchoolStatus } from '../types/common';
import { emailService } from '../services/email/emailService';
import { fedapayService } from '../services/payment/fedapayService';

/**
 * Contrôleur pour gérer les paiements via FedaPay
 */
export class PaymentController {
  /**
   * Génère une URL de paiement pour un abonnement
   */
  static async generatePaymentUrl(req: Request, res: Response): Promise<void> {
    try {
      const { plan_id, tenant_id, description, currency = 'XOF' } = req.body;
      
      if (!plan_id || !tenant_id) {
        res.status(400).json({
          success: false,
          message: 'Informations de paiement incomplètes'
        });
      }
      
      // Récupérer l'école
      const school = await School.findById(tenant_id);
      
      if (!school) {
        res.status(404).json({
          success: false,
          message: 'École non trouvée'
        });
      }
      
      // Vérifier que l'utilisateur est autorisé (promoteur ou admin)
      if (req.user && req.user.tenant_id === tenant_id && 
          (req.user.role !== 'promoter' && req.user.role !== 'admin')) {
        res.status(403).json({
          success: false,
          message: 'Accès refusé'
        });
      }
      
      // Récupérer les détails du plan
      // Note: getPlanDetails n'existe pas dans fedapayService, il faudrait l'implémenter
      // Pour l'instant, on utilise un objet mock
      const planDetails = { name: 'Plan Standard', price: 50000 };
      
      if (!planDetails) {
        res.status(404).json({
          success: false,
          message: 'Plan d\'abonnement non trouvé'
        });
      }
      
      // Créer une transaction FedaPay
      const transaction = await fedapayService.createTransaction({
        description: description || `Abonnement ${planDetails.name} - ${school?.name || 'École'}`,
        amount: planDetails.price,
        currency: currency,
        callbackUrl: `${process.env.APP_URL}/api/payments/callback`,
        metadata: {
          tenant_id: tenant_id,
          plan_id: plan_id,
          user_id: req.user ? req.user.id : null
        }
      });
      
      if (!transaction || !transaction.id || !transaction.paymentUrl) {
        res.status(500).json({
          success: false,
          message: 'Erreur lors de la création de la transaction'
        });
      }
      
      res.status(200).json({
        success: true,
        transaction_id: transaction.id,
        payment_url: transaction.paymentUrl,
        amount: planDetails.price,
        currency: currency
      });
    } catch (error) {
      console.error('Erreur lors de la génération de l\'URL de paiement:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la génération de l\'URL de paiement'
      });
    }
  }

  /**
   * Traite le callback de paiement FedaPay
   */
  static async handlePaymentCallback(req: Request, res: Response): Promise<void> {
    try {
      const { transaction_id } = req.body;
      
      if (!transaction_id) {
        res.status(400).json({
          success: false,
          message: 'ID de transaction manquant'
        });
        return;
      }
      
      // Vérifier le statut de la transaction
      const transactionDetails = await fedapayService.getTransaction(transaction_id);
      
      if (!transactionDetails) {
        res.status(404).json({
          success: false,
          message: 'Transaction non trouvée'
        });
        return;
      }
      
      // Récupérer les données personnalisées
      const { tenant_id, plan_id } = transactionDetails.metadata || {};
      
      if (!tenant_id || !plan_id) {
        res.status(400).json({
          success: false,
          message: 'Données de transaction incomplètes'
        });
        return;
      }
      
      // Vérifier si le paiement est réussi
      if (transactionDetails.status !== 'approved') {
        res.status(200).json({
          success: false,
          message: 'Paiement non approuvé',
          status: transactionDetails.status
        });
        return;
      }
      
      // Récupérer l'école
      const school = await School.findById(tenant_id);
      
      if (!school) {
        res.status(404).json({
          success: false,
          message: 'École non trouvée'
        });
      return;
      }
      
      // Vérifier si un abonnement actif existe déjà
      const existingSubscription = await school.getActiveSubscription();
      
      if (existingSubscription) {
        // Si l'abonnement existe déjà, le renouveler
        await existingSubscription.renew(transaction_id);
      } else {
        // Créer un nouvel abonnement
        await Subscription.create({
          tenant_id,
          plan_id,
          fedapay_transaction_id: transaction_id
        });
      }
      
      // Enregistrer l'historique du paiement
      // Note: savePaymentHistory n'existe pas dans fedapayService
      // Cette fonctionnalité devrait être implémentée ailleurs
      // await fedapayService.savePaymentHistory({
      //   tenant_id: tenant_id,
      //   transaction_id: transaction_id,
      //   amount: transactionDetails.amount,
      //   currency: transactionDetails.currency,
      //   status: PaymentStatus.COMPLETED,
      //   payment_method: transactionDetails.payment_method,
      //   payment_date: new Date(),
      //   metadata: transactionDetails
      // });
      
      // Si c'est un nouveau paiement pour une école en attente, activer l'école
      if (school && school.status === 'pending_payment') {
        await school.updateStatus(SchoolStatus.PENDING_KYC);
      }
      
      // Envoyer un email de confirmation
      // Récupérer les utilisateurs de l'école
      const schoolUsers = school ? await school.getUsers() : [];
      const promoter = schoolUsers.find(user => user.role === 'promoter');
        
      if (promoter && school) {
        await emailService.sendPaymentConfirmation(
          promoter.email,
          `${promoter.first_name} ${promoter.last_name}`,
          transactionDetails.amount,
          transactionDetails.description || 'Plan Standard'
        );
      }
      
      res.status(200).json({
        success: true,
        message: 'Paiement traité avec succès',
        transaction_id: transaction_id
      });
    } catch (error) {
      console.error('Erreur lors du traitement du callback de paiement:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du traitement du callback de paiement'
      });
    }
  }

  /**
   * Vérifie le statut d'un paiement
   */
  static async checkPaymentStatus(req: Request, res: Response): Promise<void> {
    try {
      const { transaction_id } = req.params;
      
      if (!transaction_id) {
        res.status(400).json({
          success: false,
          message: 'ID de transaction requis'
        });
      }
      
      // Vérifier le statut de la transaction
      const transactionDetails = await fedapayService.getTransaction(transaction_id);
      
      if (!transactionDetails) {
        res.status(404).json({
          success: false,
          message: 'Transaction non trouvée'
        });
      }
      
      res.status(200).json({
        success: true,
        transaction_id: transaction_id,
        status: transactionDetails.status,
        amount: transactionDetails.amount,
        // Note: Ces propriétés n'existent pas dans TransactionResponse
        // On utilise les propriétés disponibles ou des valeurs par défaut
        currency: transactionDetails.metadata?.currency || 'XOF',
        payment_method: transactionDetails.metadata?.paymentMethod || 'unknown',
        payment_date: transactionDetails.createdAt
      });
    } catch (error) {
      console.error('Erreur lors de la vérification du statut de paiement:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification du statut de paiement'
      });
    }
  }

  /**
   * Récupère l'historique des paiements d'une école
   */
  static async getPaymentHistory(req: Request, res: Response): Promise<void> {
    try {
      if (!req.tenant) {
        res.status(404).json({
          success: false,
          message: 'École non trouvée'
        });
      }
      
      // Vérifier que l'utilisateur est autorisé (promoteur ou admin)
      if (!req.user || (req.user.role !== 'promoter' && req.user.role !== 'admin')) {
        res.status(403).json({
          success: false,
          message: 'Accès refusé'
        });
      }
      
      // Récupérer l'historique des paiements
      // Note: getPaymentHistory n'existe pas dans fedapayService
      // On utilise getTransactionHistory à la place
      const paymentHistory = await fedapayService.getTransactionHistory();
      
      res.status(200).json({
        success: true,
        payment_history: paymentHistory
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique des paiements:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'historique des paiements'
      });
    }
  }

  /**
   * Génère une facture PDF pour un paiement
   */
  static async generateInvoice(req: Request, res: Response): Promise<void> {
    try {
      const { transaction_id } = req.params;
      
      if (!transaction_id) {
        res.status(400).json({
          success: false,
          message: 'ID de transaction requis'
        });
      }
      
      // Vérifier que l'utilisateur est autorisé
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentification requise'
        });
      }
      
      // Récupérer les détails de la transaction
      const transactionDetails = await fedapayService.getTransaction(transaction_id);
      
      if (!transactionDetails) {
        res.status(404).json({
          success: false,
          message: 'Transaction non trouvée'
        });
      }
      
      // Vérifier que l'utilisateur appartient au même tenant
      const { tenant_id } = transactionDetails.metadata || {};
      
      if (!req.user || (tenant_id !== req.user.tenant_id && req.user.role !== 'admin')) {
        res.status(403).json({
          success: false,
          message: 'Accès refusé'
        });
      }
      
      // Générer la facture PDF
      // Note: generateInvoice n'existe pas dans fedapayService
      // Cette fonctionnalité devrait être implémentée ailleurs
      // Pour l'instant, on renvoie une erreur
      const invoicePdf = null;
      
      if (!invoicePdf) {
        res.status(500).json({
          success: false,
          message: 'Erreur lors de la génération de la facture'
        });
      }
      
      // Configurer les headers pour le téléchargement du PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="facture-${transaction_id}.pdf"`);
      
      // Envoyer le PDF
      res.send(invoicePdf);
    } catch (error) {
      console.error('Erreur lors de la génération de la facture:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la génération de la facture'
      });
    }
  }
}

export default PaymentController;
