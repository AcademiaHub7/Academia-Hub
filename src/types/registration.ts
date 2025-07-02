/**
 * Types pour le processus d'inscription
 * @module types/registration
 */

import { PaymentStatus } from './common';

export interface RegistrationSession {
  id: string;
  promoter?: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    position?: string;
    password?: string;
    confirmPassword?: string;
    emailVerified?: boolean;
  };
  school?: {
    name: string;
    type: string;
    address: string;
    subdomain: string;
    country?: string;
    city?: string;
    postalCode?: string;
    phone?: string;
    website?: string;
    foundedYear?: number;
    numberOfStudents?: number;
  };
  plan?: {
    id: string;
    name: string;
    price: number;
    currency: string;
    billingCycle: 'monthly' | 'quarterly' | 'annual';
    features?: string[];
    selectedAt?: string;
  };
  subscription?: {
    planId?: string;
    planName?: string;
    startDate?: string;
    endDate?: string;
    status?: 'active' | 'pending' | 'cancelled';
  };
  payment?: {
    transactionId?: string;
    amount?: number;
    currency?: string;
    status?: 'pending' | 'completed' | 'failed';
    paymentMethod?: string;
    paymentDate?: string;
    receiptUrl?: string;
  };
  kyc?: {
    documents?: Record<string, {
      documentId: string;
      status?: 'pending' | 'approved' | 'rejected';
      uploadedAt?: string;
      previewUrl?: string;
    }>;
    status?: 'pending' | 'submitted' | 'approved' | 'rejected' | 'verified';
    submittedAt?: string;
  };
  activation?: {
    status?: 'pending' | 'activated' | 'failed';
    activationDate?: string;
    activationCode?: string;
  };
  status: 'pending' | 'email_verified' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface VerificationResponse {
  success: boolean;
  message?: string;
  session?: RegistrationSession;
}

export interface KycDocumentData {
  document_type: string;
  document_number: string;
  expiry_date?: string;
  file: File;
}

export interface RegistrationService {
  startRegistrationSession(): Promise<RegistrationSession>;
  getRegistrationSession(sessionId: string): Promise<RegistrationSession>;
  sendVerificationCode(sessionId: string): Promise<VerificationResponse>;
  verifyEmailCode(sessionId: string, code: string): Promise<VerificationResponse>;
  cancelRegistration(sessionId: string): Promise<{ success: boolean }>;
  updateSession(sessionId: string, updates: Partial<RegistrationSession>): Promise<RegistrationSession>;
  checkPaymentStatus(sessionId: string, transactionId: string): Promise<{ status: PaymentStatus, message: string }>;
  submitKycDocuments(sessionId: string, documents: KycDocumentData[]): Promise<RegistrationSession>;
}
