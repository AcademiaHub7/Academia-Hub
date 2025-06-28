/**
 * Types communs utilisés dans toute l'application
 * @module types/common
 */

/**
 * Statuts possibles pour une école
 */
export enum SchoolStatus {
  PENDING_PAYMENT = 'pending_payment',
  PENDING_KYC = 'pending_kyc',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  EXPIRED = 'expired'
}

/**
 * Statuts possibles pour un utilisateur
 */
export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DELETED = 'deleted'
}

/**
 * Rôles possibles pour un utilisateur
 */
export enum UserRole {
  PROMOTER = 'promoter',
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  PARENT = 'parent',
  STAFF = 'staff'
}

/**
 * Statuts possibles pour un abonnement
 */
export enum SubscriptionStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  PAYMENT_FAILED = 'payment_failed',
  TRIAL = 'trial'
}

/**
 * Statuts possibles pour la vérification KYC
 */
export enum KycStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  VERIFIED = 'verified',
  REJECTED = 'rejected'
}

/**
 * Statuts possibles pour un paiement
 */
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

/**
 * Statuts possibles pour une transaction
 */
export enum TransactionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DECLINED = 'declined',
  CANCELED = 'canceled',
  FAILED = 'failed'
}
