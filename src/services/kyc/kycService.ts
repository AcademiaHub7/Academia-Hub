/**
 * Service de gestion des vérifications KYC
 * @module services/kyc/kycService
 */

import axios from 'axios';
import { KYCStatus, KYCResponse, KYCSubmission } from '../../types/kyc';

/**
 * Télécharge les documents KYC
 * @param formData Les données du formulaire contenant les fichiers
 * @returns Réponse de l'API
 */
export const uploadKYCDocuments = async (formData: FormData): Promise<KYCResponse> => {
  try {
    const response = await axios.post('/api/kyc/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Erreur lors du téléchargement des documents';
      console.error('Erreur lors du téléchargement des documents KYC:', errorMessage);
      throw new Error(errorMessage);
    }
    
    console.error('Erreur lors du téléchargement des documents KYC:', error);
    throw new Error('Une erreur est survenue');
  }
};

/**
 * Récupère le statut KYC actuel
 * @returns Statut KYC et raison de rejet si applicable
 */
export const getKYCStatus = async (): Promise<{ status: KYCStatus; rejectionReason: string | null }> => {
  try {
    const response = await axios.get('/api/kyc/status');
    
    return {
      status: response.data.status,
      rejectionReason: response.data.rejectionReason || null
    };
  } catch (error: unknown) {
    console.error('Erreur lors du traitement:', error);
    throw error instanceof Error ? error : new Error('Une erreur est survenue');
  }
};

/**
 * Récupère l'historique des soumissions KYC
 * @returns Liste des soumissions KYC
 */
export const getKYCHistory = async (): Promise<KYCSubmission[]> => {
  try {
    const response = await axios.get('/api/kyc/history');
    
    return response.data.submissions || [];
  } catch (error: unknown) {
    console.error('Erreur lors du traitement:', error);
    throw error instanceof Error ? error : new Error('Une erreur est survenue');
  }
};

/**
 * Récupère les détails d'une soumission KYC spécifique
 * @param submissionId ID de la soumission
 * @returns Détails de la soumission
 */
export const getKYCSubmissionDetails = async (submissionId: string): Promise<KYCSubmission> => {
  try {
    const response = await axios.get(`/api/kyc/submissions/${submissionId}`);
    
    return response.data;
  } catch (error: unknown) {
    console.error('Erreur lors du traitement:', error);
    throw error instanceof Error ? error : new Error('Une erreur est survenue');
  }
};

/**
 * Annule une soumission KYC en cours
 * @param submissionId ID de la soumission
 * @returns Réponse de l'API
 */
export const cancelKYCSubmission = async (submissionId: string): Promise<KYCResponse> => {
  try {
    const response = await axios.post(`/api/kyc/submissions/${submissionId}/cancel`);
    
    return response.data;
  } catch (error: unknown) {
    console.error('Erreur lors du traitement:', error);
    throw error instanceof Error ? error : new Error('Une erreur est survenue');
  }
};

/**
 * Télécharge un document KYC spécifique
 * @param documentId ID du document
 * @returns URL de téléchargement du document
 */
export const downloadKYCDocument = async (documentId: string): Promise<string> => {
  try {
    const response = await axios.get(`/api/kyc/documents/${documentId}/download`, {
      responseType: 'blob'
    });
    
    // Créer une URL pour le blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    
    return url;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Erreur lors du téléchargement du document KYC';
      console.error('Erreur lors du téléchargement du document KYC:', errorMessage);
      throw new Error(errorMessage);
    }
    
    console.error('Erreur lors du téléchargement du document KYC:', error);
    throw new Error('Une erreur est survenue');
  }
};

/**
 * Vérifie si l'école a complété le processus KYC
 * @returns Booléen indiquant si le KYC est complété
 */
export const isKYCCompleted = async (): Promise<boolean> => {
  try {
    const { status } = await getKYCStatus();
    
    return status === 'approved';
  } catch (error) {
    console.error('Erreur lors de la vérification du statut KYC:', error);
    return false;
  }
};

export default {
  uploadKYCDocuments,
  getKYCStatus,
  getKYCHistory,
  getKYCSubmissionDetails,
  cancelKYCSubmission,
  downloadKYCDocument,
  isKYCCompleted
};
