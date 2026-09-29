import { Injectable, UnauthorizedException } from '@nestjs/common';

/**
 * Base service with platform role support
 * Platform roles (owner, admin) don't have tenantId
 * This helper provides consistent handling across all services
 */
@Injectable()
export class BaseService {
  /**
   * Validates tenantId for tenant-scoped operations
   * Platform roles (owner, admin) are allowed without tenantId
   * Returns true if operation should proceed, false if should skip
   */
  protected validateTenantAccess(tenantId: string | null, user: any): boolean {
    const platformRoles = ['owner', 'admin'];
    const normalizedRole = user.role?.toLowerCase() || '';
    
    // Platform roles don't need tenantId
    if (platformRoles.includes(normalizedRole)) {
      return true;
    }
    
    // Tenant roles must have tenantId
    if (!tenantId) {
      throw new UnauthorizedException('Tenant tidak valid untuk role ini');
    }
    
    return true;
  }

  /**
   * Returns empty array for platform roles, otherwise proceeds with operation
   * Use for list operations where platform users should see empty results
   */
  protected async handlePlatformRoleList<T>(
    tenantId: string | null,
    user: any,
    operation: () => Promise<T[]>
  ): Promise<T[]> {
    const platformRoles = ['owner', 'admin'];
    const normalizedRole = user.role?.toLowerCase() || '';
    
    if (platformRoles.includes(normalizedRole) && !tenantId) {
      return [];
    }
    
    return operation();
  }
}
