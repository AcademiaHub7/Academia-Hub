/**
 * Service de gestion des paiements
 * @module services/payment/paymentService
 */

import axios from 'axios';
// Import supprimé car non utilisé: import { fedapayService } from './fedapayService';

interface CreateTransactionParams {
  registrationId: string;
  planId: string;
  email: string;
}

interface TransactionData {
  id: string;
  amount: number;
  description: string;
  status: string;
  paymentUrl?: string;
}

/**
 * Crée une transaction pour le paiement d'un abonnement
 * @param params Paramètres de la transaction
 * @returns Données de la transaction créée
 */
export const createTransaction = async (params: CreateTransactionParams): Promise<TransactionData> => {
  try {
    // Récupérer les détails du plan d'abonnement
    await axios.get(`/api/subscription/plans/${params.planId}`);
    // Note: Les données du plan ne sont pas utilisées actuellement
    
    // Récupérer les détails de l'inscription
    await axios.get(`/api/register/school/${params.registrationId}`);
    // Note: Les données d'inscription ne sont pas utilisées actuellement
    
    // Créer la transaction via l'API
    const response = await axios.post('/api/payment/transactions', {
      registrationId: params.registrationId,
      planId: params.planId,
      email: params.email
    });
    
    // Si la transaction a été créée avec succès, retourner les données
    if (response.data && response.data.id) {
      return {
        id: response.data.id,
        amount: response.data.amount,
        description: response.data.description,
        status: response.data.status,
        paymentUrl: response.data.paymentUrl
      };
    }
    
    throw new Error('La création de la transaction a échoué');
  } catch (error: unknown) {
    console.error('Erreur lors de la création de la transaction:', error);
    
    // Vérification de type pour les erreurs Axios
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Erreur lors de la création de la transaction');
    }
    
    throw new Error('Erreur de connexion au serveur');
  }
};

/**
 * Vérifie le statut d'une transaction
 * @param transactionId ID de la transaction
 * @returns Statut de la transaction
 */
export const checkTransactionStatus = async (transactionId: string): Promise<string> => {
  try {
    const response = await axios.get(`/api/payment/transactions/${transactionId}/status`);
    
    return response.data.status;
  } catch (error: unknown) {
    console.error('Erreur lors de la vérification du statut de la transaction:', error);
    
    // Vérification de type pour les erreurs Axios
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Erreur lors de la vérification du statut de la transaction');
    }
    
    throw new Error('Erreur de connexion au serveur');
  }
};

/**
 * Récupère l'historique des transactions
 * @returns Liste des transactions
 */
export const getTransactionHistory = async (): Promise<Record<string, unknown>[]> => {
  try {
    const response = await axios.get('/api/payment/transactions/history');
    
    return response.data.transactions || [];
  } catch (error: unknown) {
    console.error('Erreur lors de la récupération de l\'historique des transactions:', error);
    
    // Vérification de type pour les erreurs Axios
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Erreur lors de la récupération de l\'historique des transactions');
    }
    
    throw new Error('Erreur de connexion au serveur');
  }
};

/**
 * Récupère les détails d'une transaction
 * @param transactionId ID de la transaction
 * @returns Détails de la transaction
 */
export const getTransactionDetails = async (transactionId: string): Promise<Record<string, unknown>> => {
  try {
    const response = await axios.get(`/api/payment/transactions/${transactionId}`);
    
    return response.data;
  } catch (error: unknown) {
    console.error('Erreur lors de la récupération des détails de la transaction:', error);
    
    // Vérification de type pour les erreurs Axios
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Erreur lors de la récupération des détails de la transaction');
    }
    
    throw new Error('Erreur de connexion au serveur');
  }
};

/**
 * Génère une facture pour une transaction
 * @param transactionId ID de la transaction
 * @returns URL de la facture
 */
export const generateInvoice = async (transactionId: string): Promise<string> => {
  try {
    const response = await axios.post(`/api/payment/transactions/${transactionId}/invoice`);
    
    return response.data.invoiceUrl;
  } catch (error: unknown) {
    console.error('Erreur lors de la génération de la facture:', error);
    
    // Vérification de type pour les erreurs Axios
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Erreur lors de la génération de la facture');
    }
    
    throw new Error('Erreur de connexion au serveur');
  }
};

/**
 * Annule une transaction
 * @param transactionId ID de la transaction
 * @param reason Raison de l'annulation
 * @returns Réponse de l'API
 */
export const cancelTransaction = async (transactionId: string, reason: string): Promise<Record<string, unknown>> => {
  try {
    const response = await axios.post(`/api/payment/transactions/${transactionId}/cancel`, { reason });
    
    return response.data;
  } catch (error: unknown) {
    console.error('Erreur lors de l\'annulation de la transaction:', error);
    
    // Vérification de type pour les erreurs Axios
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Erreur lors de l\'annulation de la transaction');
    }
    
    throw new Error('Erreur de connexion au serveur');
  }
};

export default {
  createTransaction,
  checkTransactionStatus,
  getTransactionHistory,
  getTransactionDetails,
  generateInvoice,
  cancelTransaction
};
