import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { Keluarga } from '../entity/keluarga.entity';
import type { IKeluargaRepository } from '../interfaces/keluarga-repository.interface';

@Injectable()
export class KeluargaService {
  constructor(@Inject('IKeluargaRepository') private repo: IKeluargaRepository) {}
  
  async findAll(tenantId: string): Promise<Keluarga[]> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    return this.repo.findAll(tenantId);
  }

  async create(data: Partial<Keluarga>, tenantId: string): Promise<Keluarga> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    return this.repo.create(data, tenantId);
  }

  async update(id: string, data: Partial<Keluarga>, tenantId: string): Promise<void> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    await this.repo.update(id, data, tenantId);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    await this.repo.remove(id, tenantId);
  }
}