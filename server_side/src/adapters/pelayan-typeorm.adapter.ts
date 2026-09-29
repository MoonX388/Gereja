import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pelayan } from '../entity/pelayan.entity';
import { IPelayanRepository } from '../interfaces/pelayan-repository.interface';

@Injectable()
export class PelayanTypeOrmAdapter implements IPelayanRepository {
  constructor(@InjectRepository(Pelayan) private repo: Repository<Pelayan>) {}

  async findAll(tenantId: string): Promise<Pelayan[]> {
    return this.repo.find({ where: { tenantId }, order: { id: 'DESC' } });
  }
  async create(data: Partial<Pelayan>, tenantId: string): Promise<Pelayan> {
    const item = this.repo.create({ ...data, tenantId });
    return this.repo.save(item);
  }
  async update(id: string, data: Partial<Pelayan>, tenantId: string): Promise<void> {
    await this.repo.update({ id, tenantId }, data);
  }
  async remove(id: string, tenantId: string): Promise<void> {
    await this.repo.delete({ id, tenantId });
  }
}