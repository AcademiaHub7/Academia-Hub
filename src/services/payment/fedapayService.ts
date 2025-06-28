/**
 * Service d'intégration avec FedaPay pour la gestion des paiements
 * @module services/payment/fedapayService
 */

import axios from 'axios';
import crypto from 'crypto';

/**
 * Types d'environnement FedaPay
 */
export enum FedaPayEnvironment {
  SANDBOX = 'sandbox',
  PRODUCTION = 'production'
}

/**
 * Statuts des transactions FedaPay
 */
export enum TransactionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DECLINED = 'declined',
  CANCELED = 'canceled',
  FAILED = 'failed'
}

/**
 * Interface pour les options de configuration FedaPay
 */
interface FedaPayConfig {
  publicKey: string;
  secretKey: string;
  environment: FedaPayEnvironment;
  webhookSecret: string;
}

/**
 * Interface pour les données de transaction
 */
export interface TransactionData {
  amount: number;
  description: string;
  currency: string;
  callbackUrl?: string;
  customer?: {
    email: string;
    firstName?: string;
    lastName?: string;
  };
  metadata?: Record<string, any>;
}

/**
 * Interface pour les réponses de transaction
 */
export interface TransactionResponse {
  id: string;
  status: TransactionStatus;
  amount: number;
  description: string;
  paymentUrl?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

/**
 * Interface pour les données de webhook
 */
export interface WebhookData {
  event: string;
  data: {
    transaction: {
      id: string;
      status: TransactionStatus;
      amount: number;
      description: string;
      metadata?: Record<string, any>;
    }
  };
  signature: string;
}

/**
 * Service pour l'intégration avec FedaPay
 */
export class FedaPayService {
  private config: FedaPayConfig;
  private baseUrl: string;

  /**
   * Constructeur du service FedaPay
   */
  constructor() {
    this.config = {
      publicKey: process.env.FEDAPAY_PUBLIC_KEY || '',
      secretKey: process.env.FEDAPAY_SECRET_KEY || '',
      environment: (process.env.FEDAPAY_ENVIRONMENT as FedaPayEnvironment) || FedaPayEnvironment.SANDBOX,
      webhookSecret: process.env.FEDAPAY_WEBHOOK_SECRET || ''
    };

    // Déterminer l'URL de base selon l'environnement
    this.baseUrl = this.config.environment === FedaPayEnvironment.PRODUCTION
      ? 'https://api.fedapay.com/v1'
      : 'https://sandbox-api.fedapay.com/v1';
  }

  /**
   * Crée une nouvelle transaction
   * @param data Données de la transaction
   * @returns Réponse de la transaction
   */
  public async createTransaction(data: TransactionData): Promise<TransactionResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/transactions`,
        {
          transaction: {
            amount: data.amount,
            description: data.description,
            currency: { iso: data.currency },
            callback_url: data.callbackUrl,
            customer: data.customer ? {
              email: data.customer.email,
              firstname: data.customer.firstName,
              lastname: data.customer.lastName
            } : undefined,
            metadata: data.metadata
          }
        },
        {
          headers: this.getHeaders()
        }
      );

      return this.formatTransactionResponse(response.data.transaction);
    } catch (error) {
      this.handleApiError(error, 'Erreur lors de la création de la transaction');
      throw error;
    }
  }

  /**
   * Génère une URL de paiement pour une transaction
   * @param transactionId ID de la transaction
   * @returns URL de paiement
   */
  public async generatePaymentUrl(transactionId: string): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/transactions/${transactionId}/generate-payment-url`,
        {},
        {
          headers: this.getHeaders()
        }
      );

      return response.data.payment_url;
    } catch (error) {
      this.handleApiError(error, 'Erreur lors de la génération de l\'URL de paiement');
      throw error;
    }
  }

  /**
   * Récupère les détails d'une transaction
   * @param transactionId ID de la transaction
   * @returns Détails de la transaction
   */
  public async getTransaction(transactionId: string): Promise<TransactionResponse> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/transactions/${transactionId}`,
        {
          headers: this.getHeaders()
        }
      );

      return this.formatTransactionResponse(response.data.transaction);
    } catch (error) {
      this.handleApiError(error, 'Erreur lors de la récupération de la transaction');
      throw error;
    }
  }

  /**
   * Récupère l'historique des transactions
   * @param page Numéro de page
   * @param perPage Nombre d'éléments par page
   * @returns Liste des transactions
   */
  public async getTransactionHistory(page = 1, perPage = 20): Promise<TransactionResponse[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/transactions`,
        {
          params: {
            page,
            per_page: perPage
          },
          headers: this.getHeaders()
        }
      );

      return response.data.transactions.map(this.formatTransactionResponse);
    } catch (error) {
      this.handleApiError(error, 'Erreur lors de la récupération de l\'historique des transactions');
      throw error;
    }
  }

  /**
   * Vérifie la signature d'un webhook
   * @param payload Données du webhook
   * @param signature Signature à vérifier
   * @returns Booléen indiquant si la signature est valide
   */
  public verifyWebhookSignature(payload: any, signature: string): boolean {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.config.webhookSecret)
        .update(JSON.stringify(payload))
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch (error) {
      console.error('Erreur lors de la vérification de la signature du webhook:', error);
      return false;
    }
  }

  /**
   * Traite les données d'un webhook
   * @param data Données du webhook
   * @param signature Signature du webhook
   * @returns Données de transaction traitées ou null si la signature est invalide
   */
  public processWebhook(data: any, signature: string): TransactionResponse | null {
    // Vérifier la signature
    if (!this.verifyWebhookSignature(data, signature)) {
      console.error('Signature de webhook invalide');
      return null;
    }

    // Vérifier que c'est un événement de transaction
    if (data.event !== 'transaction.updated') {
      console.log(`Événement webhook ignoré: ${data.event}`);
      return null;
    }

    // Formater et retourner les données de transaction
    return this.formatTransactionResponse(data.data.transaction);
  }

  /**
   * Crée un abonnement récurrent
   * @param customerId ID du client
   * @param planId ID du plan d'abonnement
   * @param metadata Métadonnées additionnelles
   * @returns ID de l'abonnement créé
   */
  public async createSubscription(
    customerId: string,
    planId: string,
    metadata?: Record<string, any>
  ): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/subscriptions`,
        {
          subscription: {
            customer_id: customerId,
            plan_id: planId,
            metadata
          }
        },
        {
          headers: this.getHeaders()
        }
      );

      return response.data.subscription.id;
    } catch (error) {
      this.handleApiError(error, 'Erreur lors de la création de l\'abonnement');
      throw error;
    }
  }

  /**
   * Annule un abonnement
   * @param subscriptionId ID de l'abonnement
   * @returns Booléen indiquant si l'annulation a réussi
   */
  public async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      await axios.delete(
        `${this.baseUrl}/subscriptions/${subscriptionId}`,
        {
          headers: this.getHeaders()
        }
      );

      return true;
    } catch (error) {
      this.handleApiError(error, 'Erreur lors de l\'annulation de l\'abonnement');
      throw error;
    }
  }

  /**
   * Récupère les détails d'un abonnement
   * @param subscriptionId ID de l'abonnement
   * @returns Détails de l'abonnement
   */
  public async getSubscription(subscriptionId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/subscriptions/${subscriptionId}`,
        {
          headers: this.getHeaders()
        }
      );

      return response.data.subscription;
    } catch (error) {
      this.handleApiError(error, 'Erreur lors de la récupération de l\'abonnement');
      throw error;
    }
  }

  /**
   * Génère les en-têtes pour les requêtes API
   * @returns En-têtes HTTP
   */
  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.config.secretKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  /**
   * Formate la réponse de transaction
   * @param transaction Données de transaction brutes
   * @returns Données de transaction formatées
   */
  private formatTransactionResponse(transaction: any): TransactionResponse {
    return {
      id: transaction.id,
      status: transaction.status,
      amount: transaction.amount,
      description: transaction.description,
      paymentUrl: transaction.payment_url,
      createdAt: transaction.created_at,
      updatedAt: transaction.updated_at,
      metadata: transaction.metadata
    };
  }

  /**
   * Gère les erreurs d'API
   * @param error Erreur à traiter
   * @param defaultMessage Message d'erreur par défaut
   */
  private handleApiError(error: any, defaultMessage: string): void {
    if (axios.isAxiosError(error) && error.response) {
      console.error(`Erreur FedaPay (${error.response.status}):`, error.response.data);
      
      // Log détaillé pour le débogage
      console.error({
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
    } else {
      console.error(defaultMessage, error);
    }
  }
}

// Exporter une instance singleton du service
export const fedapayService = new FedaPayService();
