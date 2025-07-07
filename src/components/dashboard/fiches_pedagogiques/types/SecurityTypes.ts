export enum UserRole {
  TEACHER = 'teacher',
  DIRECTOR = 'director',
  PEDAGOGICAL_ADVISOR = 'pedagogical_advisor',
  INSPECTOR = 'inspector'
}

export interface UserPermissions {
  institutionId: string;
  role: UserRole;
  canRead: boolean;
  canWrite: boolean;
  canValidate: boolean;
  canArchive: boolean;
}

export interface AccessLog {
  id: string;
  userId: string;
  ficheId: string;
  action: 'read' | 'write' | 'validate' | 'archive';
  timestamp: Date;
  ipAddress: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  ficheId: string;
  action: string;
  details: Record<string, any>;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
}

export interface SecurityContext {
  userId: string;
  permissions: UserPermissions[];
  currentInstitution: string;
  lastAccess: Date;
  sessionToken: string;
}

export interface ComplianceCheck {
  id: string;
  ficheId: string;
  checkType: 'MEMP' | 'FORMAT' | 'VALIDATION' | 'ARCHIVE';
  status: 'pass' | 'warning' | 'fail';
  details: string;
  timestamp: Date;
  checkedBy: string;
}

export interface BackupMetadata {
  id: string;
  ficheId: string;
  version: number;
  timestamp: Date;
  status: 'active' | 'archived' | 'deleted';
  checksum: string;
  encrypted: boolean;
}

export interface RecoveryPoint {
  id: string;
  ficheId: string;
  timestamp: Date;
  version: number;
  changes: Record<string, any>;
  status: 'available' | 'pending' | 'failed';
}
