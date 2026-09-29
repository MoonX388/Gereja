import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { Jadwal } from '../entity/jadwal.entity';
import type { IJadwalRepository } from '../interfaces/jadwal-repository.interface';

@Injectable()
export class JadwalService {
  constructor(@Inject('IJadwalRepository') private repo: IJadwalRepository) {}

  async findAll(tenantId: string): Promise<Jadwal[]> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    return this.repo.findAll(tenantId);
  }

  async create(data: Partial<Jadwal>, tenantId: string): Promise<Jadwal> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    return this.repo.create(data, tenantId);
  }

  async update(id: string, data: Partial<Jadwal>, tenantId: string): Promise<void> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    await this.repo.update(id, data, tenantId);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    await this.repo.remove(id, tenantId);
  }
}