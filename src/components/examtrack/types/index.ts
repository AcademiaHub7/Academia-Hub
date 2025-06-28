// Types d'utilisateurs
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  SCHOOL_ADMIN = 'SCHOOL_ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT'
}

// Type utilisateur
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  schoolId?: string;
  avatar?: string;
  lastLogin?: Date;
}

// Type établissement
export interface School {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Type matière
export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  schoolId: string;
}

// Type classe
export interface Class {
  id: string;
  name: string;
  level: string;
  academicYear: string;
  schoolId: string;
  students: string[]; // IDs des étudiants
}

// Type examen
export interface Exam {
  id: string;
  title: string;
  description?: string;
  subjectId: string;
  classIds: string[]; // Plusieurs classes peuvent passer le même examen
  date: Date;
  duration: number; // en minutes
  totalPoints: number;
  coefficient: number;
  status: ExamStatus;
  type: ExamType;
  createdBy: string; // ID de l'utilisateur
  createdAt: Date;
  updatedAt: Date;
}

// Statut d'un examen
export enum ExamStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  GRADED = 'GRADED',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED'
}

// Type d'examen
export enum ExamType {
  TRIMESTER = 'TRIMESTER', // Examen trimestriel
  MIDTERM = 'MIDTERM', // Examen de mi-parcours
  FINAL = 'FINAL', // Examen final
  QUIZ = 'QUIZ', // Interrogation
  ASSIGNMENT = 'ASSIGNMENT', // Devoir
  OFFICIAL = 'OFFICIAL' // Examen officiel (BEPC, BAC)
}

// Type note
export interface Grade {
  id: string;
  examId: string;
  studentId: string;
  score: number;
  comment?: string;
  gradedBy: string; // ID de l'enseignant
  gradedAt: Date;
  status: GradeStatus;
  history: GradeHistory[];
}

// Historique des modifications de note
export interface GradeHistory {
  previousScore: number;
  newScore: number;
  modifiedBy: string; // ID de l'utilisateur
  modifiedAt: Date;
  reason?: string;
}

// Statut d'une note
export enum GradeStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  VALIDATED = 'VALIDATED',
  PUBLISHED = 'PUBLISHED',
  CONTESTED = 'CONTESTED'
}

// Type document/épreuve
export interface Document {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string; // ID de l'utilisateur
  uploadedAt: Date;
  category: DocumentCategory;
  tags: string[];
  subjectId?: string;
  examId?: string;
  version: number;
}

// Catégorie de document
export enum DocumentCategory {
  EXAM = 'EXAM', // Sujet d'examen
  CORRECTION = 'CORRECTION', // Corrigé
  OFFICIAL = 'OFFICIAL', // Document officiel
  PEDAGOGICAL = 'PEDAGOGICAL', // Document pédagogique
  ADMINISTRATIVE = 'ADMINISTRATIVE' // Document administratif
}

// Statut d'un document
export enum DocumentStatus {
  DRAFT = 'DRAFT',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

// Type résultat
export interface Result {
  id: string;
  studentId: string;
  classId: string;
  academicYear: string;
  period: string; // Trimestre, semestre, etc.
  subjects: SubjectResult[];
  average: number;
  rank: number;
  totalStudents: number;
  status: ResultStatus;
  comments?: string;
  publishedAt?: Date;
}

// Résultat par matière
export interface SubjectResult {
  subjectId: string;
  grades: Grade[];
  average: number;
  coefficient: number;
  weightedAverage: number;
  rank: number;
  teacherComment?: string;
}

// Statut d'un résultat
export enum ResultStatus {
  DRAFT = 'DRAFT',
  VALIDATED_BY_TEACHER = 'VALIDATED_BY_TEACHER',
  VALIDATED_BY_ADMIN = 'VALIDATED_BY_ADMIN',
  PUBLISHED = 'PUBLISHED'
}

// Type notification
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: Date;
  link?: string;
}

// Type de notification
export enum NotificationType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR'
}

// Type statistique
export interface Statistics {
  examId?: string;
  classId?: string;
  subjectId?: string;
  academicYear: string;
  period?: string;
  averageScore: number;
  medianScore: number;
  minScore: number;
  maxScore: number;
  standardDeviation: number;
  passRate: number;
  distribution: {
    range: string;
    count: number;
    percentage: number;
  }[];
}

// Type audit
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: Date;
  details: Record<string, unknown> | {
    oldValue?: unknown;
    newValue?: unknown;
    field?: string;
    [key: string]: unknown;
  };
  ipAddress?: string;
}
