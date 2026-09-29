import { Injectable } from '@nestjs/common';
import { GenericService, ServiceConfig } from '../common/base/generic-service';
import { GenericRepository } from '../common/base/generic-repository';

@Injectable()
export class KeuanganGenericService extends GenericService {
  constructor(repository: GenericRepository) {
    super(repository, {
      tableName: 'keuangan',
      defaultSelect: '*',
      defaultRelations: ['user']
    });
  }

  async findByTipe(tipe: string, tenantId?: string) {
    return this.findMany({ tipe }, {}, tenantId);
  }

  async findByTanggalRange(startDate: string, endDate: string, tenantId?: string) {
    return this.findMany(
      { tanggal: { gte: startDate, lte: endDate } },
      {},
      tenantId
    );
  }

  async findPemasukan(tenantId?: string) {
    return this.findMany({ tipe: 'pemasukan' }, {}, tenantId);
  }

  async findPengeluaran(tenantId?: string) {
    return this.findMany({ tipe: 'pengeluaran' }, {}, tenantId);
  }
}
