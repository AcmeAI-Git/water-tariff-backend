import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogsService } from '../../audit-logs/audit-logs.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, ip, user } = request;

    // Extract table name and record ID from URL
    const urlParts = url.split('/').filter(Boolean);
    const tableName = urlParts[0] || 'unknown';

    // Determine action based on HTTP method
    let action = '';
    switch (method) {
      case 'POST':
        action = `Created ${tableName}`;
        break;
      case 'PUT':
      case 'PATCH':
        action = `Updated ${tableName}`;
        break;
      case 'DELETE':
        action = `Deleted ${tableName}`;
        break;
      default:
        return next.handle(); // Don't log GET requests
    }

    // Get record ID from URL parameters
    const recordId = parseInt(urlParts[1]) || 0;

    const userId =
      user?.id ||
      body?.userId ||
      body?.createdBy ||
      body?.approvedBy ||
      undefined;

    return next.handle().pipe(
      tap((response) => {
        // Log the change after successful operation
        if (method !== 'GET') {
          this.auditLogsService
            .logChange(
              userId,
              action,
              tableName,
              recordId || response?.data?.id || response?.id || 0,
              method === 'PUT' || method === 'PATCH' ? body : null, // For updates, body is old data context
              method === 'POST' ? body : method === 'PUT' ? body : null,
              ip,
            )
            .catch((err) => console.error('Failed to log audit:', err));
        }
      }),
    );
  }
}
