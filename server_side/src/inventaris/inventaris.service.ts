import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventaris } from '../entity/inventaris.entity';

@Injectable()
export class InventarisService {
  constructor(
    @InjectRepository(Inventaris)
    private inventarisRepo: Repository<Inventaris>,
  ) {}

  async findAll(tenantId: number): Promise<Inventaris[]> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    return this.inventarisRepo.find({
      where: { tenantId },
      order: { id: 'DESC' },
    });
  }

  async create(data: Partial<Inventaris>, tenantId: number): Promise<Inventaris> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    const item = this.inventarisRepo.create({ ...data, tenantId });
    return this.inventarisRepo.save(item);
  }

  async update(id: number, data: Partial<Inventaris>, tenantId: number): Promise<void> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    await this.inventarisRepo.update({ id, tenantId }, data);
  }

  async remove(id: number, tenantId: number): Promise<void> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    await this.inventarisRepo.delete({ id, tenantId });
  }
}
