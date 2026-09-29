import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Keuangan } from '../entity/keuangan.entity';
import { IKeuanganRepository } from '../interfaces/keuangan-repository.interface';

@Injectable()
export class KeuanganTypeOrmAdapter implements IKeuanganRepository {
  constructor(@InjectRepository(Keuangan) private repo: Repository<Keuangan>) {}
  async findAll(tenantId: string) { return this.repo.find({ where: { tenantId }, order: { tanggal: 'DESC' } }); }
  async create(data: Partial<Keuangan>, tenantId: string) { const item = this.repo.create({ ...data, tenantId }); return this.repo.save(item); }
  async update(id: string, data: Partial<Keuangan>, tenantId: string) { await this.repo.update({ id, tenantId }, data); }
  async remove(id: string, tenantId: string) { await this.repo.delete({ id, tenantId }); }
}