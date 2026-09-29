import { Injectable } from '@nestjs/common';
import { GenericService, ServiceConfig } from '../common/base/generic-service';
import { GenericRepository } from '../common/base/generic-repository';

@Injectable()
export class UsersGenericService extends GenericService {
  constructor(repository: GenericRepository) {
    super(repository, {
      tableName: 'user',
      defaultSelect: '*',
      defaultRelations: ['jemaat', 'pelayan'] // Contoh relasi yang sering digunakan
    });
  }

  // Method khusus untuk user -- semua di-scope ke tenant pemanggil.
  async findByEmail(email: string, tenantId?: string) {
    return this.findOneOrNull({ email }, {}, tenantId);
  }

  async findByUsername(username: string, tenantId?: string) {
    return this.findOneOrNull({ username }, {}, tenantId);
  }

  async findByRole(role: string, tenantId?: string) {
    return this.findMany({ role }, {}, tenantId);
  }

  /**
   * Dipakai internal (jwt.strategy dsb) untuk mengambil semua user milik
   * satu tenant. TIDAK dipakai lagi lewat endpoint publik biasa -- lihat
   * endpoint '/users/tenant/:tenantId' di controller, yang sekarang
   * mengabaikan param URL dan selalu memakai tenant pemanggil sendiri.
   */
  async findByTenantId(tenantId: string) {
    return this.findMany({ tenant_id: tenantId }, {}, tenantId);
  }

  async updatePermissions(userId: string, permissions: string[], tenantId?: string) {
    return this.update(userId, { permissions }, tenantId);
  }

  async hasPermission(userId: string, permission: string, tenantId?: string) {
    const user = await this.findById(userId, {}, tenantId) as any;
    if (!user || !user.permissions) return false;

    const permissions = Array.isArray(user.permissions)
      ? user.permissions
      : JSON.parse(user.permissions as string);

    return permissions.includes(permission);
  }

  /**
   * Edit user profile dengan validasi lengkap
   * Update: username, email, password, role, permissions
   */
  async editUser(userId: string, userData: {
    username?: string;
    email?: string;
    password?: string;
    role?: string;
    permissions?: string[];
  }, tenantId?: string) {
    // Cek apakah user ada DAN milik tenant ini (throw 404 kalau tidak)
    const existingUser = await this.findById(userId, {}, tenantId) as any;

    // Validasi username unik jika diubah (dicek dalam tenant yang sama)
    if (userData.username && userData.username !== existingUser.username) {
      const usernameExists = await this.findByUsername(userData.username, tenantId);
      if (usernameExists) {
        throw new Error('Username sudah digunakan oleh user lain');
      }
    }

    // Validasi email unik jika diubah (dicek dalam tenant yang sama)
    if (userData.email && userData.email !== existingUser.email) {
      const emailExists = await this.findByEmail(userData.email, tenantId);
      if (emailExists) {
        throw new Error('Email sudah digunakan oleh user lain');
      }
    }

    const updateData: any = {};

    if (userData.username) updateData.username = userData.username;
    if (userData.email) updateData.email = userData.email;
    if (userData.password) updateData.password = userData.password; // Password akan di-hash di repository jika needed
    if (userData.role) updateData.role = userData.role;
    if (userData.permissions) updateData.permissions = userData.permissions;

    return this.update(userId, updateData, tenantId);
  }

  /**
   * Update user permissions dengan merge strategy
   */
  async updatePermissionsWithMerge(userId: string, permissions: {
    add?: string[];
    remove?: string[];
    set?: string[];
  }, tenantId?: string) {
    const user = await this.findById(userId, {}, tenantId) as any;

    let currentPermissions: string[] = [];

    if (user.permissions) {
      currentPermissions = Array.isArray(user.permissions)
        ? user.permissions
        : JSON.parse(user.permissions as string);
    }

    if (permissions.set) {
      currentPermissions = permissions.set;
    } else {
      if (permissions.add) {
        permissions.add.forEach(perm => {
          if (!currentPermissions.includes(perm)) {
            currentPermissions.push(perm);
          }
        });
      }

      if (permissions.remove) {
        currentPermissions = currentPermissions.filter(
          perm => !permissions.remove!.includes(perm)
        );
      }
    }

    return this.update(userId, { permissions: currentPermissions }, tenantId);
  }

  /**
   * Get user dengan detail lengkap untuk edit form
   */
  async getUserForEdit(userId: string, tenantId?: string) {
    return this.findById(userId, { relations: ['jemaat', 'pelayan'] }, tenantId);
  }
}
