import { Injectable } from '@nestjs/common';
import { GenericService, ServiceConfig } from '../common/base/generic-service';
import { GenericRepository } from '../common/base/generic-repository';

@Injectable()
export class JemaatGenericService extends GenericService {
  constructor(repository: GenericRepository) {
    super(repository, {
      tableName: 'jemaat',
      defaultSelect: '*',
      defaultRelations: ['user', 'keluarga'] // Contoh relasi yang sering digunakan
    });
  }

  // Semua method khusus WAJIB terima & teruskan tenantId -- kalau tidak,
  // filter tenant_id otomatis dari GenericService tidak akan jalan dan
  // request akan ditolak (ForbiddenException) alih-alih diam-diam bocor.
  async findByStatus(status: string, tenantId?: string) {
    return this.findMany({ status }, {}, tenantId);
  }

  async findByJenisKelamin(jenisKelamin: string, tenantId?: string) {
    return this.findMany({ jenis_kelamin: jenisKelamin }, {}, tenantId);
  }

  async findActiveJemaat(tenantId?: string) {
    return this.findMany({ status: 'aktif' }, {}, tenantId);
  }
}
