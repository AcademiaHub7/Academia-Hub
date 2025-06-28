/**
 * Types pour les données KYC
 * @module types/kyc
 */

/**
 * Statut d'une soumission KYC
 */
export type KYCStatus = 'pending' | 'processing' | 'approved' | 'rejected' | 'cancelled';

/**
 * Type pour une soumission KYC
 */
export interface KYCSubmission {
  id: string;
  status: KYCStatus;
  createdAt: string;
  updatedAt: string;
  documents: KYCDocument[];
  rejectionReason?: string;
}

/**
 * Type pour un document KYC
 */
export interface KYCDocument {
  id: string;
  type: 'id_card' | 'address_proof' | 'business_registration' | 'other';
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  status: 'pending' | 'processed' | 'rejected';
  rejectionReason?: string;
}

/**
 * Type pour une erreur API
 */
export interface APIError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

/**
 * Type pour la réponse de l'API KYC
 */
export interface KYCResponse {
  status: KYCStatus;
  rejectionReason?: string;
  submission?: KYCSubmission;
}
