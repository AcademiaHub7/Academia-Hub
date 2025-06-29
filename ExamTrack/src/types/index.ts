// Core types for multi-tenant exam management system

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  tenantId: string;
  tenantType: TenantType;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export type UserRole = 
  | 'super_admin'
  | 'patronat_admin' 
  | 'school_admin'
  | 'teacher'
  | 'student'
  | 'parent';

export type TenantType = 'patronat' | 'school';

export interface Tenant {
  id: string;
  name: string;
  type: TenantType;
  region?: string;
  parentTenantId?: string;
  isActive: boolean;
  settings: TenantSettings;
  createdAt: Date;
  subscriptionStatus?: SubscriptionStatus;
}

export interface TenantSettings {
  logo?: string;
  primaryColor: string;
  academicYear: string;
  timeZone: string;
  language: 'fr' | 'en';
  examTypes: string[];
  gradingScale: {
    min: number;
    max: number;
    passingGrade: number;
  };
}

// Messaging System Types
export interface Message {
  id: string;
  subject: string;
  content: string;
  senderId: string;
  senderName: string;
  senderType: TenantType;
  senderTenantId: string;
  recipients: MessageRecipient[];
  type: MessageType;
  priority: MessagePriority;
  status: MessageStatus;
  attachments?: MessageAttachment[];
  parentMessageId?: string; // For replies
  threadId: string;
  isRead: boolean;
  readAt?: Date;
  sentAt: Date;
  scheduledFor?: Date;
  expiresAt?: Date;
  tags?: string[];
}

export interface MessageRecipient {
  id: string;
  tenantId: string;
  tenantName: string;
  tenantType: TenantType;
  userId?: string;
  userName?: string;
  isRead: boolean;
  readAt?: Date;
  deliveredAt?: Date;
  status: RecipientStatus;
}

export interface MessageAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  uploadedAt: Date;
}

export interface MessageThread {
  id: string;
  subject: string;
  participants: ThreadParticipant[];
  lastMessageAt: Date;
  messageCount: number;
  unreadCount: number;
  isArchived: boolean;
  tags?: string[];
}

export interface ThreadParticipant {
  tenantId: string;
  tenantName: string;
  tenantType: TenantType;
  lastReadAt?: Date;
}

export type MessageType = 
  | 'individual'
  | 'group'
  | 'broadcast'
  | 'announcement'
  | 'notification';

export type MessagePriority = 
  | 'low'
  | 'normal'
  | 'high'
  | 'urgent';

export type MessageStatus = 
  | 'draft'
  | 'scheduled'
  | 'sent'
  | 'delivered'
  | 'failed';

export type RecipientStatus = 
  | 'pending'
  | 'delivered'
  | 'read'
  | 'failed';

export interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: string;
  tenantId: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface MessageFolder {
  id: string;
  name: string;
  type: FolderType;
  tenantId: string;
  messageCount: number;
  unreadCount: number;
  color?: string;
  icon?: string;
}

export type FolderType = 
  | 'inbox'
  | 'sent'
  | 'drafts'
  | 'archive'
  | 'trash'
  | 'custom';

// Subscription and Payment Types
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'XOF' | 'EUR';
  duration: 'monthly' | 'quarterly' | 'yearly';
  features: PlanFeature[];
  maxSchools: number;
  maxStudents: number;
  isPopular?: boolean;
}

export interface PlanFeature {
  id: string;
  name: string;
  description: string;
  included: boolean;
}

export interface Subscription {
  id: string;
  patronatId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentMethod: PaymentMethod;
  createdAt: Date;
}

export type SubscriptionStatus = 
  | 'pending_payment'
  | 'active'
  | 'expired'
  | 'cancelled'
  | 'suspended';

export interface PaymentMethod {
  id: string;
  type: 'mobile_money' | 'card' | 'bank_transfer';
  provider: 'fedapay' | 'moov' | 'mtn' | 'visa' | 'mastercard';
  lastFour?: string;
  isDefault: boolean;
}

export interface Payment {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: 'XOF' | 'EUR';
  status: PaymentStatus;
  fedapayTransactionId?: string;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  paidAt?: Date;
}

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded';

// Registration Types (KYC removed)
export interface PatronatRegistration {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
  };
  organizationInfo: {
    name: string;
    region: string;
    address: string;
    registrationNumber: string;
    taxNumber: string;
    website?: string;
  };
  planSelection: {
    planId: string;
    billingCycle: 'monthly' | 'quarterly' | 'yearly';
  };
  status: RegistrationStatus;
  createdAt: Date;
  completedAt?: Date;
}

export type RegistrationStatus = 
  | 'personal_info'
  | 'organization_info'
  | 'plan_selection'
  | 'payment_pending'
  | 'under_review'
  | 'approved'
  | 'rejected';

// Existing types...
export interface School {
  id: string;
  name: string;
  code: string;
  patronatId: string;
  address: string;
  phone?: string;
  email?: string;
  directorName: string;
  studentCapacity: number;
  currentStudents: number;
  isActive: boolean;
  credentials: {
    username: string;
    password: string;
  };
  createdAt: Date;
}

export interface Exam {
  id: string;
  name: string;
  type: ExamType;
  academicYear: string;
  term: number;
  tenantId: string;
  tenantType: TenantType;
  schoolId?: string;
  status: ExamStatus;
  startDate: Date;
  endDate: Date;
  subjects: ExamSubject[];
  targetClasses: string[];
  settings: ExamSettings;
  createdBy: string;
  createdAt: Date;
}

export type ExamType = 
  | 'CEP'
  | 'BEPC' 
  | 'BAC'
  | 'Contrôle Continu'
  | 'Composition'
  | 'Examen Blanc';

export type ExamStatus = 
  | 'draft'
  | 'scheduled'
  | 'ongoing'
  | 'completed'
  | 'results_published';

export interface ExamSubject {
  code: string;
  name: string;
  coefficient: number;
  duration: string;
  evaluationType: 'Écrit' | 'Oral' | 'Pratique' | 'Continu';
}

export interface ExamSettings {
  requirePatronatApproval: boolean;
  publishResultsAutomatically: boolean;
  allowMakeup: boolean;
  gradingScale: {
    min: number;
    max: number;
  };
  passingGrade: number;
}

export interface Grade {
  id: string;
  examId: string;
  studentId: string;
  subjectCode: string;
  grade: number | null;
  isAbsent: boolean;
  isExcused: boolean;
  appreciation: Appreciation;
  observation?: string;
  enteredBy: string;
  enteredAt: Date;
  validatedBy?: string;
  validatedAt?: Date;
}

export type Appreciation = 
  | 'Excellent'
  | 'Très Bien'
  | 'Bien'
  | 'Assez Bien'
  | 'Passable'
  | 'Insuffisant';

export interface Student {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  class: string;
  schoolId: string;
  parentContact?: {
    name: string;
    phone: string;
    email?: string;
  };
  isActive: boolean;
  enrollmentDate: Date;
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  grades: Grade[];
  average: number;
  rank: number;
  mention: string;
  status: 'Admis' | 'Ajourné' | 'Exclu';
  publishedAt?: Date;
}