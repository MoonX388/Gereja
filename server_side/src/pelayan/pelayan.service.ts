import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { Pelayan } from '../entity/pelayan.entity';
import type { IPelayanRepository } from '../interfaces/pelayan-repository.interface';

@Injectable()
export class PelayanService {
  constructor(@Inject('IPelayanRepository') private repo: IPelayanRepository) {}

  async findAll(tenantId: string): Promise<Pelayan[]> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    return this.repo.findAll(tenantId);
  }

  async create(data: Partial<Pelayan>, tenantId: string): Promise<Pelayan> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    return this.repo.create(data, tenantId);
  }

  async update(id: string, data: Partial<Pelayan>, tenantId: string): Promise<void> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    await this.repo.update(id, data, tenantId);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    await this.repo.remove(id, tenantId);
  }
}