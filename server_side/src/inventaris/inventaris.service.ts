import { Injectable, Inject, Request } from '@nestjs/common';
import { Inventaris } from '../entity/inventaris.entity';
import type { IInventarisRepository } from '../interfaces/inventaris-repository.interface';
import { BaseService } from '../common/base.service';

@Injectable()
export class InventarisService extends BaseService {
  constructor(
    @Inject('IInventarisRepository') private repo: IInventarisRepository,
  ) {
    super();
  }

  async findAll(tenantId: string | null, @Request() req?: any): Promise<Inventaris[]> {
    this.validateTenantAccess(tenantId, req?.user);
    if (!tenantId) return [];
    return this.repo.findAll(tenantId);
  }

  async create(data: Partial<Inventaris>, tenantId: string | null, @Request() req?: any): Promise<Inventaris> {
    this.validateTenantAccess(tenantId, req?.user);
    if (!tenantId) throw new Error('Platform users cannot create tenant resources');
    return this.repo.create(data, tenantId);
  }

  async update(id: string, data: Partial<Inventaris>, tenantId: string | null, @Request() req?: any): Promise<void> {
    this.validateTenantAccess(tenantId, req?.user);
    if (!tenantId) throw new Error('Platform users cannot update tenant resources');
    await this.repo.update(id, data, tenantId);
  }

  async remove(id: string, tenantId: string | null, @Request() req?: any): Promise<void> {
    this.validateTenantAccess(tenantId, req?.user);
    if (!tenantId) throw new Error('Platform users cannot delete tenant resources');
    await this.repo.remove(id, tenantId);
  }
}