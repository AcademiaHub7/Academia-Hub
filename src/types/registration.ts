/**
 * Types pour le processus d'inscription
 * @module types/registration
 */

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

export interface RegistrationService {
  startRegistrationSession(): Promise<RegistrationSession>;
  getRegistrationSession(sessionId: string): Promise<RegistrationSession>;
  sendVerificationCode(sessionId: string): Promise<VerificationResponse>;
  verifyEmailCode(sessionId: string, code: string): Promise<VerificationResponse>;
  cancelRegistration(sessionId: string): Promise<{ success: boolean }>;
  updateSession(sessionId: string, updates: Partial<RegistrationSession>): Promise<RegistrationSession>;
}
