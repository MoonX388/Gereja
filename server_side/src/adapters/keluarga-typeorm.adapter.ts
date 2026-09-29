import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Keluarga } from '../entity/keluarga.entity';
import { IKeluargaRepository } from '../interfaces/keluarga-repository.interface';

@Injectable()
export class KeluargaTypeOrmAdapter implements IKeluargaRepository {
  constructor(@InjectRepository(Keluarga) private repo: Repository<Keluarga>) {}
  async findAll(tenantId: string) { return this.repo.find({ where: { tenantId }, order: { id: 'DESC' } }); }
  async create(data: Partial<Keluarga>, tenantId: string) { const item = this.repo.create({ ...data, tenantId }); return this.repo.save(item); }
  async update(id: string, data: Partial<Keluarga>, tenantId: string) { await this.repo.update({ id, tenantId }, data); }
  async remove(id: string, tenantId: string) { await this.repo.delete({ id, tenantId }); }
}