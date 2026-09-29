import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notifikasi } from '../entity/notifikasi.entity';
import { INotifikasiRepository } from '../interfaces/notifikasi-repository.interface';

@Injectable()
export class NotifikasiTypeOrmAdapter implements INotifikasiRepository {
  constructor(@InjectRepository(Notifikasi) private repo: Repository<Notifikasi>) {}
  async findAll(tenantId: string): Promise<Notifikasi[]> {
    return this.repo.find({ where: { tenantId }, order: { id: 'DESC' } });
  }
  async create(data: Partial<Notifikasi>, tenantId: string): Promise<Notifikasi> {
    const item = this.repo.create({ ...data, tenantId });
    return this.repo.save(item);
  }
  async update(id: string, data: Partial<Notifikasi>, tenantId: string): Promise<void> {
    await this.repo.update({ id, tenantId }, data);
  }
  async remove(id: string, tenantId: string): Promise<void> {
    await this.repo.delete({ id, tenantId });
  }
}