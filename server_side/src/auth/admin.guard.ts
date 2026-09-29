import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

/**
 * 🚨 FIX URGENT: role di database sudah di-migrasi ke skema 4-tier
 * ('owner' | 'admin' | 'admin_tenant' | 'user') lewat migrasi
 * `role_hierarchy_and_permissions`, tapi daftar role di guard ini masih
 * yang lama ('admin', 'admin_gereja', 'sub_owner', 'super_admin',
 * 'superadmin') — TIDAK ADA yang cocok dengan role baru. Efeknya: SEMUA
 * admin gereja (sekarang role-nya 'admin_tenant') ditolak guard ini sejak
 * migrasi dijalankan, kecuali kebetulan match salah satu entry di
 * `permissions` array mereka.
 *
 * Daftar lama tetap dipertahankan sebagai fallback (kalau ada baris lama
 * yang entah kenapa belum ke-migrasi), tapi role baru ditambahkan sebagai
 * prioritas.
 *
 * CATATAN: guard ini punya DUA sistem izin yang sekarang tumpang tindih:
 * 1. Role-based (list di bawah)
 * 2. `user.permissions` array (kelola_settings, kelola_jemaat, dst.)
 * Ini terpisah dari tabel `role_permissions` yang baru saya buat untuk
 * kustomisasi izin per-role oleh owner (lihat role.guards.ts:
 * PermissionGuard). Dua sistem izin granular berjalan paralel sekarang —
 * perlu diputuskan mau dikonsolidasi ke satu sistem atau tetap dua-duanya
 * untuk keperluan berbeda (role.guards.ts = per-ROLE, permissions array
 * ini = per-USER individual override).
 */
@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isValid = (await super.canActivate(context)) as boolean;
    if (!isValid) return false;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      console.error('AdminGuard: User not found in request');
      return false;
    }

    // 'owner' dan 'admin' (platform staff) selalu lolos — tidak terikat gereja.
    // 'admin_tenant' adalah role baru untuk church-admin (dulu 'admin'/'admin_gereja').
    const bypassRoles = [
      'owner',
      'admin',
      'admin_tenant',
      // --- fallback untuk baris lama yang belum ke-migrasi, hapus setelah dipastikan bersih ---
      'admin_gereja',
      'sub_owner',
      'super_admin',
      'superadmin',
    ];
    // Case-insensitive role check
    const userRole = user.role?.toLowerCase();
    if (bypassRoles.includes(userRole)) {
      console.log(`AdminGuard: User role '${userRole}' bypassed permissions check`);
      return true;
    }

    const permissions = Array.isArray(user.permissions)
      ? user.permissions
      : typeof user.permissions === 'string'
        ? JSON.parse(user.permissions)
        : [];
    const path = request.route?.path ?? request.path ?? '';
    const permission = path.includes('settings')
      ? 'kelola_settings'
      : path.includes('users')
        ? 'kelola_user'
        : path.includes('pelayan')
          ? 'kelola_pelayan'
          : path.includes('jemaat')
            ? 'kelola_jemaat'
            : path.includes('keuangan')
              ? 'kelola_keuangan'
              : path.includes('jadwal')
                ? 'kelola_jadwal'
                : path.includes('form')
                  ? 'kelola_form'
                  : 'akses_gpanel';

    const hasPermission = permissions.includes('akses_gpanel') || permissions.includes(permission);
    console.log(`AdminGuard: User role '${userRole}', permissions: ${permissions.join(', ')}, required: ${permission}, allowed: ${hasPermission}`);
    return hasPermission;
  }
}
