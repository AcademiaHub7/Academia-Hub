/**
 * Contrôleur pour la gestion des webhooks
 * @module controllers/WebhookController
 */

import { Request, Response } from 'express';
import { fedapayService, TransactionStatus } from '../services/payment/fedapayService';
import { subscriptionService } from '../services/payment/subscriptionService';
import { Transaction } from '../models/Transaction';
import { logger } from '../utils/logger';

/**
 * Contrôleur pour la gestion des webhooks FedaPay
 */
export class WebhookController {
  /**
   * Traite les webhooks FedaPay
   * @param req Requête HTTP
   * @param res Réponse HTTP
   */
  static async handleFedaPayWebhook(req: Request, res: Response) {
    try {
      // Récupérer la signature du webhook depuis les en-têtes
      const signature = req.headers['x-fedapay-signature'] as string;
      
      if (!signature) {
        logger.warn('Webhook reçu sans signature');
        return res.status(400).json({
          success: false,
          message: 'Signature manquante'
        });
      }
      
      // Vérifier et traiter le webhook
      const webhookData = fedapayService.processWebhook(req.body, signature);
      
      if (!webhookData) {
        logger.warn('Webhook avec signature invalide ou événement non pris en charge');
        return res.status(400).json({
          success: false,
          message: 'Signature invalide ou événement non pris en charge'
        });
      }
      
      logger.info(`Webhook FedaPay reçu pour la transaction ${webhookData.id} avec le statut ${webhookData.status}`);
      
      // Traiter selon le statut de la transaction
      switch (webhookData.status) {
        case TransactionStatus.APPROVED:
          await this.handleApprovedTransaction(webhookData);
          break;
        
        case TransactionStatus.DECLINED:
        case TransactionStatus.CANCELED:
        case TransactionStatus.FAILED:
          await this.handleFailedTransaction(webhookData);
          break;
        
        default:
          logger.info(`Statut de transaction non traité: ${webhookData.status}`);
      }
      
      // Répondre avec succès pour confirmer la réception
      return res.status(200).json({
        success: true,
        message: 'Webhook traité avec succès'
      });
    } catch (error) {
      logger.error('Erreur lors du traitement du webhook FedaPay:', error);
      
      // Toujours répondre avec un succès pour éviter les retentatives de FedaPay
      return res.status(200).json({
        success: true,
        message: 'Webhook reçu, mais erreur lors du traitement'
      });
    }
  }
  
  /**
   * Traite une transaction approuvée
   * @param transaction Données de la transaction
   */
  private static async handleApprovedTransaction(transaction: any) {
    try {
      // Vérifier si la transaction existe déjà dans notre système
      const existingTransaction = await Transaction.findByFedaPayId(transaction.id);
      
      if (existingTransaction && existingTransaction.status === TransactionStatus.APPROVED) {
        logger.info(`Transaction ${transaction.id} déjà traitée comme approuvée`);
        return;
      }
      
      // Traiter le paiement réussi
      const subscription = await subscriptionService.processSuccessfulPayment(transaction.id);
      
      if (subscription) {
        logger.info(`Abonnement ${subscription.id} mis à jour avec succès après paiement approuvé`);
      } else {
        logger.warn(`Aucun abonnement trouvé pour la transaction ${transaction.id}`);
      }
    } catch (error) {
      logger.error(`Erreur lors du traitement de la transaction approuvée ${transaction.id}:`, error);
    }
  }
  
  /**
   * Traite une transaction échouée
   * @param transaction Données de la transaction
   */
  private static async handleFailedTransaction(transaction: any) {
    try {
      // Vérifier si la transaction existe déjà dans notre système
      const existingTransaction = await Transaction.findByFedaPayId(transaction.id);
      
      if (existingTransaction && 
          (existingTransaction.status === TransactionStatus.DECLINED || 
           existingTransaction.status === TransactionStatus.CANCELED || 
           existingTransaction.status === TransactionStatus.FAILED)) {
        logger.info(`Transaction ${transaction.id} déjà traitée comme échouée`);
        return;
      }
      
      // Traiter le paiement échoué
      const subscription = await subscriptionService.processFailedPayment(transaction.id);
      
      if (subscription) {
        logger.info(`Abonnement ${subscription.id} mis à jour après échec de paiement`);
      } else {
        logger.warn(`Aucun abonnement trouvé pour la transaction échouée ${transaction.id}`);
      }
    } catch (error) {
      logger.error(`Erreur lors du traitement de la transaction échouée ${transaction.id}:`, error);
    }
  }
}

export default WebhookController;
