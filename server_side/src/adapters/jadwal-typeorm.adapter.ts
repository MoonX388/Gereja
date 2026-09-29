import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Jadwal } from '../entity/jadwal.entity';
import { IJadwalRepository } from '../interfaces/jadwal-repository.interface';

@Injectable()
export class JadwalTypeOrmAdapter implements IJadwalRepository {
  constructor(@InjectRepository(Jadwal) private repo: Repository<Jadwal>) {}
  async findAll(tenantId: string) { return this.repo.find({ where: { tenantId }, order: { tanggal: 'DESC' } }); }
  async create(data: Partial<Jadwal>, tenantId: string) { const item = this.repo.create({ ...data, tenantId }); return this.repo.save(item); }
  async update(id: string, data: Partial<Jadwal>, tenantId: string) { await this.repo.update({ id, tenantId }, data); }
  async remove(id: string, tenantId: string) { await this.repo.delete({ id, tenantId }); }
}