import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Keluarga } from '../entity/keluarga.entity';

@Injectable()
export class KeluargaService {
  constructor(
    @InjectRepository(Keluarga)
    private keluargaRepo: Repository<Keluarga>,
  ) {}

  async findAll(tenantId: number): Promise<Keluarga[]> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    return this.keluargaRepo.find({
      where: { tenantId },
      order: { id: 'DESC' },
    });
  }

  async create(data: Partial<Keluarga>, tenantId: number): Promise<Keluarga> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    const item = this.keluargaRepo.create({ ...data, tenantId });
    return this.keluargaRepo.save(item);
  }

  async update(id: number, data: Partial<Keluarga>, tenantId: number): Promise<void> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    await this.keluargaRepo.update({ id, tenantId }, data);
  }

  async remove(id: number, tenantId: number): Promise<void> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    await this.keluargaRepo.delete({ id, tenantId });
  }
}
