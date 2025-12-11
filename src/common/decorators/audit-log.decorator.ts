import { SetMetadata } from '@nestjs/common';

export const AUDIT_LOG_KEY = 'audit_log';

export interface AuditMetadata {
  tableName: string;
  action?: string;
}

export const AuditLog = (metadata: AuditMetadata) =>
  SetMetadata(AUDIT_LOG_KEY, metadata);
