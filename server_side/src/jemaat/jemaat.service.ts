import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { Jemaat } from '../entity/jemaat.entity';
import type { IJemaatRepository } from '../interfaces/jemaat-repository.interface';

@Injectable()
export class JemaatService {
  constructor(@Inject('IJemaatRepository') private repo: IJemaatRepository) {}

  async getDashboardData(tenantId: string) {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    return this.repo.getDashboardData(tenantId);
  }

  async findAll(tenantId: string): Promise<Jemaat[]> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    return this.repo.findAll(tenantId);
  }

  async create(dto: any, tenantId: string): Promise<Jemaat> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    return this.repo.create(dto, tenantId);
  }

  async update(id: string, dto: any, tenantId: string): Promise<void> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    await this.repo.update(id, dto, tenantId);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    await this.repo.remove(id, tenantId);
  }
}