import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventaris } from '../entity/inventaris.entity';
import { IInventarisRepository } from '../interfaces/inventaris-repository.interface';

@Injectable()
export class InventarisTypeOrmAdapter implements IInventarisRepository {
  constructor(@InjectRepository(Inventaris) private repo: Repository<Inventaris>) {}
  async findAll(tenantId: string) { return this.repo.find({ where: { tenantId }, order: { tahun: 'DESC' } }); }
  async create(data: Partial<Inventaris>, tenantId: string) { const item = this.repo.create({ ...data, tenantId }); return this.repo.save(item); }
  async update(id: string, data: Partial<Inventaris>, tenantId: string) { await this.repo.update({ id, tenantId }, data); }
  async remove(id: string, tenantId: string) { await this.repo.delete({ id, tenantId }); }
}