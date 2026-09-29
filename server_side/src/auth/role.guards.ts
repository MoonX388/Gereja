import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Type } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

/**
 * Role hierarchy (see ROLE_MIGRATION.md):
 * - 'owner'         — platform owner. Full access, not tied to a church.
 * - 'admin'         — platform staff/moderator. Not tied to a church.
 * - 'admin_tenant'  — church admin. MUST have tenantId.
 * - 'user'          — jemaat/pelayan/staff. MUST have tenantId.
 *
 * These guards replace the old `AdminGuard` (checked `role === 'admin'`,
 * which under the OLD naming meant "church admin" — under the NEW naming
 * that meaning moved to `'admin_tenant'`). Update every controller that
 * imported the old `AdminGuard` expecting church-admin semantics to use
 * `TenantAdminGuard` instead — see ROLE_MIGRATION.md for the full list of
 * files that need this swap.
 */

@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    if (req.user?.role?.toLowerCase() !== 'owner') {
      throw new ForbiddenException('Hanya platform owner yang dapat mengakses endpoint ini.');
    }
    return true;
  }
}

/** owner OR admin (platform staff) — both are platform-level, not tenant-scoped. */
@Injectable()
export class PlatformStaffGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    if (!['owner', 'admin'].includes(req.user?.role?.toLowerCase())) {
      throw new ForbiddenException('Hanya staf platform yang dapat mengakses endpoint ini.');
    }
    return true;
  }
}

/** Replaces the old `AdminGuard` (church-admin semantics). */
@Injectable()
export class TenantAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    if (req.user?.role?.toLowerCase() !== 'admin_tenant') {
      throw new ForbiddenException('Hanya admin gereja yang dapat mengakses endpoint ini.');
    }
    if (!req.user?.tenantId) {
      throw new ForbiddenException('Akun ini belum terhubung ke gereja manapun.');
    }
    return true;
  }
}

/** Ensures any tenant-scoped role ('admin_tenant' | 'user') actually has a tenantId set. */
@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const role = req.user?.role?.toLowerCase();
    if ((role === 'admin_tenant' || role === 'user') && !req.user?.tenantId) {
      throw new ForbiddenException(
        'Akun ini belum terhubung ke gereja manapun. Hubungi admin platform untuk aktivasi.',
      );
    }
    return true;
  }
}

/**
 * Fine-grained check against the `role_permissions` table (owner-editable
 * via landing-page dashboard/settings) — use for features that need finer
 * control than the coarse role guards above, e.g. `glive.control` for
 * deciding whether a 'user' (staff/pelayan) can operate the OBS overlay.
 *
 * Usage: @UseGuards(JwtAuthGuard, PermissionGuard('glive.control'))
 */
export function PermissionGuard(permissionKey: string): Type<CanActivate> {
  @Injectable()
  class PermissionGuardMixin implements CanActivate {
    constructor(private supabaseService: SupabaseService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest();
      const role = req.user?.role;
      if (!role) throw new ForbiddenException('Tidak terautentikasi.');
      if (role === 'owner') return true; // owner always passes

      const { data, error } = await this.supabaseService
        .getClient()
        .from('role_permissions')
        .select('allowed')
        .eq('role', role)
        .eq('permission_key', permissionKey)
        .maybeSingle();

      if (error || !data?.allowed) {
        throw new ForbiddenException(`Role '${role}' tidak memiliki izin '${permissionKey}'.`);
      }
      return true;
    }
  }
  return PermissionGuardMixin;
}
