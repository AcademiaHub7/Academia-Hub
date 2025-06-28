/**
 * Service de gestion des abonnements
 * @module services/payment/subscriptionService
 */

import { fedapayService, TransactionStatus } from './fedapayService';
import { Subscription } from '../../models/Subscription';
import { SubscriptionPlan } from '../../models/SubscriptionPlan';
import { School } from '../../models/School';
import { Transaction } from '../../models/Transaction';
import { sendEmail } from '../email/emailService';
import { logger } from '../../utils/logger';
import { SubscriptionStatus } from '../../types/common';

/**
 * Types d'abonnement
 */
export enum SubscriptionType {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUAL = 'annual',
  TRIAL = 'trial'
}

/**
 * Statuts d'abonnement
 */
// Re-export du type SubscriptionStatus pour compatibilité
export { SubscriptionStatus } from '../../types/common';

/**
 * Interface pour les options de création d'abonnement
 */
interface CreateSubscriptionOptions {
  schoolId: string;
  planId: string;
  transactionId?: string;
  trialDays?: number;
}

/**
 * Interface pour les options de renouvellement d'abonnement
 */
interface RenewSubscriptionOptions {
  subscriptionId: string;
  automaticRenewal?: boolean;
}

/**
 * Service pour la gestion des abonnements
 */
export class SubscriptionService {
  /**
   * Crée un nouvel abonnement
   * @param options Options de création d'abonnement
   * @returns L'abonnement créé
   */
  public async createSubscription(options: CreateSubscriptionOptions): Promise<Subscription> {
    try {
      // Récupérer l'école et le plan
      const school = await School.findById(options.schoolId);
      const plan = await SubscriptionPlan.findById(options.planId);

      if (!school) {
        throw new Error(`École non trouvée avec l'ID: ${options.schoolId}`);
      }

      if (!plan) {
        throw new Error(`Plan d'abonnement non trouvé avec l'ID: ${options.planId}`);
      }

      // Déterminer la date de début et de fin
      const startDate = new Date();
      let endDate: Date;
      let status: SubscriptionStatus;

      // Si c'est une période d'essai
      if (options.trialDays && options.trialDays > 0) {
        endDate = new Date();
        endDate.setDate(endDate.getDate() + options.trialDays);
        status = SubscriptionStatus.TRIAL;
      } else {
        // Calculer la date de fin selon le type d'abonnement
        endDate = new Date();
        switch (plan.type) {
          case SubscriptionType.MONTHLY:
            endDate.setMonth(endDate.getMonth() + 1);
            break;
          case SubscriptionType.QUARTERLY:
            endDate.setMonth(endDate.getMonth() + 3);
            break;
          case SubscriptionType.ANNUAL:
            endDate.setFullYear(endDate.getFullYear() + 1);
            break;
          default:
            endDate.setMonth(endDate.getMonth() + 1); // Par défaut, mensuel
        }
        status = options.transactionId ? SubscriptionStatus.ACTIVE : SubscriptionStatus.PENDING;
      }

      // Créer l'abonnement dans la base de données
      const subscription = await Subscription.create({
        tenant_id: options.schoolId,
        plan_id: options.planId,
        status,
        start_date: startDate,
        end_date: endDate,
      });

      if (!subscription) {
        logger.error('Erreur lors de la création de l\'abonnement');
        return null;
      }

      // Récupérer l'école et le plan
      const school = await School.findById(options.tenantId);
      const plan = await subscription.getPlan();

      if (school && plan) {
        // Envoyer un email de confirmation
        await this.sendSubscriptionConfirmationEmail(school, subscription, plan);
      } else {
        logger.warn(`École ou plan non trouvé pour l'abonnement créé (tenant: ${options.tenantId}, plan: ${options.planId})`);
      }

      return subscription;
    } catch (error) {
      logger.error('Erreur lors de la création de l\'abonnement:', error);
      return null;
    }
  }

  /**
   * Renouvelle un abonnement existant
   * @param options Options de renouvellement
   * @returns L'abonnement renouvelé
   */
  public async renewSubscription(options: RenewSubscriptionOptions): Promise<Subscription | null> {
    try {
      // Récupérer l'abonnement
      const subscription = await Subscription.findById(options.subscriptionId);

      if (!subscription) {
        throw new Error(`Abonnement non trouvé avec l'ID: ${options.subscriptionId}`);
      }

      // Récupérer l'école et le plan
      const school = await School.findById(subscription.tenant_id);
      const plan = await subscription.getPlan();

      if (!school || !plan) {
        throw new Error(`École ou plan non trouvé pour l'abonnement: ${subscription.id}`);
      }

      // Créer une transaction pour le renouvellement
      const paymentTransaction = await Subscription.createFedaPayTransaction(
        subscription.plan_id,
        subscription.tenant_id
      );

      if (paymentTransaction) {
        // Envoyer un email de rappel
        await this.sendRenewalReminderEmail(
          school,
          subscription,
          plan,
          paymentTransaction.payment_url
        );
      }

      return subscription;
    } catch (error) {
      logger.error('Erreur lors du renouvellement de l\'abonnement:', error);
      return null;
    }
  }

  /**
   * Traite un paiement réussi pour un abonnement
   * @param transactionId ID de la transaction FedaPay
   * @returns L'abonnement mis à jour
   */
  public async processSuccessfulPayment(transactionId: string): Promise<Subscription | null> {
    try {
      // Récupérer les détails de la transaction depuis FedaPay
      const transactionDetails = await fedapayService.getTransaction(transactionId);

      if (!transactionDetails || !transactionDetails.metadata) {
        logger.error(`Transaction ${transactionId} sans métadonnées`);
        return null;
      }

      // Récupérer l'ID de l'abonnement depuis les métadonnées
      const subscriptionId = transactionDetails.metadata.subscription_id;
      const schoolId = transactionDetails.metadata.school_id;

      if (!subscriptionId) {
        logger.error(`Transaction ${transactionId} sans ID d'abonnement dans les métadonnées`);
        return null;
      }

      // Récupérer l'abonnement
      const subscription = await Subscription.findById(subscriptionId);

      if (!subscription) {
        logger.error(`Abonnement non trouvé avec l'ID: ${subscriptionId}`);
        return null;
      }

      // Récupérer l'école et le plan
      const school = await School.findById(schoolId);
      const plan = await subscription.getPlan();

      if (!school || !plan) {
        logger.error(`École ou plan non trouvé pour l'abonnement: ${subscriptionId}`);
        return null;
      }

      // Mettre à jour la transaction dans notre base de données
      const transaction = await Transaction.findByFedaPayId(transactionId);
      if (transaction) {
        transaction.status = transactionDetails.status;
        await transaction.save();
      } else {
        // Créer la transaction si elle n'existe pas
        await Transaction.create({
          subscription_id: subscription.id,
          fedapay_transaction_id: transactionId,
          amount: transactionDetails.amount,
          status: transactionDetails.status,
          type: transactionDetails.metadata.type || 'payment',
          date: new Date()
        });
      }

      // Si le paiement est approuvé
      if (transactionDetails.status === TransactionStatus.APPROVED) {
        // Calculer la nouvelle date de fin
        const newEndDate = new Date();
        switch (plan.type) {
          case SubscriptionType.MONTHLY:
            newEndDate.setMonth(newEndDate.getMonth() + 1);
            break;
          case SubscriptionType.QUARTERLY:
            newEndDate.setMonth(newEndDate.getMonth() + 3);
            break;
          case SubscriptionType.ANNUAL:
            newEndDate.setFullYear(newEndDate.getFullYear() + 1);
            break;
          default:
            newEndDate.setMonth(newEndDate.getMonth() + 1);
        }

        // Mettre à jour l'abonnement
        // Mettre à jour l'abonnement via l'API
        await subscription.update({
          status: SubscriptionStatus.ACTIVE,
          start_date: new Date().toISOString(),
          end_date: newEndDate.toISOString(),
          fedapay_transaction_id: transactionId
        });

        // Envoyer un email de confirmation
        await this.sendPaymentConfirmationEmail(school, subscription, plan);

        return subscription;
      }

      return subscription;
    } catch (error) {
      logger.error('Erreur lors du traitement du paiement réussi:', error);
      return null;
    }
  }

  /**
   * Traite un paiement échoué pour un abonnement
   * @param transactionId ID de la transaction FedaPay
   * @returns L'abonnement mis à jour
   */
  public async processFailedPayment(transactionId: string): Promise<Subscription | null> {
    try {
      // Récupérer les détails de la transaction depuis FedaPay
      const transactionDetails = await fedapayService.getTransaction(transactionId);

      if (!transactionDetails || !transactionDetails.metadata) {
        logger.error(`Transaction ${transactionId} sans métadonnées`);
        return null;
      }

      // Récupérer l'ID de l'abonnement depuis les métadonnées
      const subscriptionId = transactionDetails.metadata.subscription_id;
      const schoolId = transactionDetails.metadata.school_id;

      if (!subscriptionId) {
        logger.error(`Transaction ${transactionId} sans ID d'abonnement dans les métadonnées`);
        return null;
      }

      // Récupérer l'abonnement
      const subscription = await Subscription.findById(subscriptionId);

      if (!subscription) {
        logger.error(`Abonnement non trouvé avec l'ID: ${subscriptionId}`);
        return null;
      }

      // Récupérer l'école
      const school = await School.findById(schoolId);

      if (!school) {
        logger.error(`École non trouvée avec l'ID: ${schoolId}`);
        return null;
      }

      // Mettre à jour la transaction dans notre base de données
      const transaction = await Transaction.findByFedaPayId(transactionId);
      if (transaction) {
        transaction.status = transactionDetails.status;
        await transaction.save();
      }

      // Si c'est un renouvellement et que la date de fin est dépassée
      if (transactionDetails.metadata.type === 'renewal' && subscription.end_date && new Date() > new Date(subscription.end_date)) {
        await subscription.updateStatus(SubscriptionStatus.EXPIRED);
      } else if (subscription.status === SubscriptionStatus.PENDING) {
        // Si c'est un nouvel abonnement qui échoue
        await subscription.updateStatus(SubscriptionStatus.PAYMENT_FAILED);
      }

      // Envoyer un email d'échec de paiement
      await this.sendPaymentFailedEmail(school, subscription);

      return subscription;
    } catch (error) {
      logger.error('Erreur lors du traitement du paiement échoué:', error);
      return null;
    }
  }

  /**
   * Vérifie les abonnements expirants et envoie des rappels
   */
  public async checkExpiringSubscriptions(): Promise<void> {
    try {
      const today = new Date();
      const in7Days = new Date();
      in7Days.setDate(today.getDate() + 7);

      const in3Days = new Date();
      in3Days.setDate(today.getDate() + 3);

      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      // Récupérer les abonnements qui expirent dans 7 jours
      const expiringIn7Days = await Subscription.findExpiringBetween(today, in7Days);
      for (const subscription of expiringIn7Days) {
        await this.sendExpirationReminderEmail(subscription, 7);
      }

      // Récupérer les abonnements qui expirent dans 3 jours
      const expiringIn3Days = await Subscription.findExpiringBetween(today, in3Days);
      for (const subscription of expiringIn3Days) {
        await this.sendExpirationReminderEmail(subscription, 3);
      }

      // Récupérer les abonnements qui expirent demain
      const expiringTomorrow = await Subscription.findExpiringBetween(today, tomorrow);
      for (const subscription of expiringTomorrow) {
        await this.sendExpirationReminderEmail(subscription, 1);
      }

      // Renouveler automatiquement les abonnements avec auto_renew activé
      for (const subscription of [...expiringIn7Days, ...expiringIn3Days, ...expiringTomorrow]) {
        if (subscription.auto_renew) {
          await this.renewSubscription({ subscriptionId: subscription.id });
        }
      }
    } catch (error) {
      logger.error('Erreur lors de la vérification des abonnements expirants:', error);
    }
  }

  /**
   * Calcule le prix d'un plan d'abonnement avec d'éventuelles remises
   * @param planId ID du plan d'abonnement
   * @param discountCode Code de réduction optionnel
   * @returns Prix calculé
   */
  public async calculatePrice(planId: string, discountCode?: string): Promise<number> {
    try {
      const plan = await SubscriptionPlan.findById(planId);

      if (!plan) {
        throw new Error(`Plan d'abonnement non trouvé avec l'ID: ${planId}`);
      }

      let price = plan.price;

      // Appliquer une réduction si un code est fourni
      if (discountCode) {
        // Logique pour appliquer la réduction
        // À implémenter selon les besoins
      }

      return price;
    } catch (error) {
      logger.error('Erreur lors du calcul du prix:', error);
      throw error;
    }
  }

  /**
   * Envoie un email de confirmation d'abonnement
   * @param school École concernée
   * @param subscription Abonnement créé
   * @param plan Plan d'abonnement
   */
  private async sendSubscriptionConfirmationEmail(
    school: School,
    subscription: Subscription,
    plan: SubscriptionPlan
  ): Promise<void> {
    try {
      // Utiliser l'email de contact dans les paramètres de l'école
      const contactEmail = school.settings?.contact_info?.email;
      
      if (!contactEmail) {
        logger.error(`Impossible d'envoyer l'email de confirmation: aucune adresse email trouvée pour l'école ${school.name}`);
        return;
      }

      // Formater les dates si elles existent
      let startDateStr = 'Non définie';
      if (subscription.start_date) {
        const startDate = new Date(subscription.start_date);
        startDateStr = startDate.toLocaleDateString();
      }

      let endDateStr = 'Non définie';
      if (subscription.end_date) {
        const endDate = new Date(subscription.end_date);
        endDateStr = endDate.toLocaleDateString();
      }

      await sendEmail({
        to: contactEmail,
        subject: 'Confirmation de votre abonnement - Academia Hub',
        template: 'subscription_confirmation',
        context: {
          school_name: school.name,
          plan_name: plan.name,
          start_date: startDateStr,
          end_date: endDateStr,
          price: plan.price
        }
      });
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de l\'email de confirmation d\'abonnement:', error);
    }
  }

  /**
   * Envoie un email de confirmation de paiement
   * @param school École concernée
   * @param subscription Abonnement concerné
   * @param plan Plan d'abonnement
   */
  private async sendPaymentConfirmationEmail(
    school: School,
    subscription: Subscription,
    plan: SubscriptionPlan
  ): Promise<void> {
    try {
      await sendEmail({
        to: school.email,
        subject: 'Confirmation de paiement - Academia Hub',
        template: 'payment_confirmation',
        context: {
          school_name: school.name,
          plan_name: plan.name,
          subscription_end: subscription.end_date.toLocaleDateString(),
          price: subscription.price,
          invoice_url: `${process.env.APP_URL}/invoices/${subscription.fedapay_transaction_id || ''}`
        }
      });
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de l\'email de confirmation de paiement:', error);
    }
  }

  /**
   * Envoie un email d'échec de paiement
   * @param school École concernée
   * @param subscription Abonnement concerné
   */
  private async sendPaymentFailedEmail(
    school: School,
    subscription: Subscription
  ): Promise<void> {
    try {
      // Utiliser l'email de contact dans les paramètres de l'école
      const contactEmail = school.settings?.contact_info?.email;
      
      if (!contactEmail) {
        logger.error(`Impossible d'envoyer l'email d'échec de paiement: aucune adresse email trouvée pour l'école ${school.name}`);
        return;
      }

      await sendEmail({
        to: contactEmail,
        subject: 'Échec de paiement - Academia Hub',
        template: 'payment_failed',
        context: {
          school_name: school.name,
          retry_url: `${process.env.APP_URL}/subscription/retry-payment/${subscription.id}`,
          support_email: process.env.SUPPORT_EMAIL || 'support@academiahub.com'
        }
      });
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de l\'email d\'échec de paiement:', error);
    }
  }

  /**
   * Envoie un email de rappel d'expiration
   * @param subscription Abonnement concerné
   * @param daysRemaining Jours restants avant expiration
   */
  private async sendExpirationReminderEmail(subscription: Subscription, daysRemaining: number): Promise<void> {
    try {
      const school = await School.findById(subscription.school_id);
      const plan = await SubscriptionPlan.findById(subscription.plan_id);

      if (!school || !plan) {
        logger.error(`École ou plan non trouvé pour l'abonnement: ${subscription.id}`);
        return;
      }

      await sendEmail({
        to: school.email,
        subject: `Votre abonnement expire dans ${daysRemaining} jour(s) - Academia Hub`,
        template: 'subscription_expiring',
        context: {
          school_name: school.name,
          plan_name: plan.name,
          days_remaining: daysRemaining,
          expiry_date: subscription.end_date.toLocaleDateString(),
          renewal_url: `${process.env.APP_URL}/subscription/renew/${subscription.id}`,
          auto_renew: subscription.auto_renew
        }
      });
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de l\'email de rappel d\'expiration:', error);
    }
  }

  /**
   * Envoie un email de rappel de renouvellement
   * @param school École concernée
   * @param subscription Abonnement concerné
   * @param plan Plan d'abonnement
   * @param paymentUrl URL de paiement
   */
  private async sendRenewalReminderEmail(
    school: School,
    subscription: Subscription,
    plan: SubscriptionPlan,
    paymentUrl: string
  ): Promise<void> {
    try {
      // Utiliser l'email de contact dans les paramètres de l'école
      const contactEmail = school.settings?.contact_info?.email;
      
      if (!contactEmail) {
        logger.error(`Impossible d'envoyer l'email de rappel: aucune adresse email trouvée pour l'école ${school.name}`);
        return;
      }

      // Formater la date d'expiration si elle existe
      let expiryDateStr = 'Non définie';
      if (subscription.end_date) {
        const expiryDate = new Date(subscription.end_date);
        expiryDateStr = expiryDate.toLocaleDateString();
      }

      await sendEmail({
        to: contactEmail,
        subject: 'Renouvellement de votre abonnement - Academia Hub',
        template: 'subscription_renewal',
        context: {
          school_name: school.name,
          plan_name: plan.name,
          price: plan.price,
          payment_url: paymentUrl,
          expiry_date: expiryDateStr
        }
      });
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de l\'email de rappel de renouvellement:', error);
    }
  }
}

// Exporter une instance singleton du service
export const subscriptionService = new SubscriptionService();
