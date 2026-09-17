import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Keuangan } from '../entity/keuangan.entity';

@Injectable()
export class KeuanganService {
  constructor(
    @InjectRepository(Keuangan)
    private keuanganRepo: Repository<Keuangan>,
  ) {}

  async findAll(tenantId: number): Promise<Keuangan[]> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    return this.keuanganRepo.find({
      where: { tenantId },
      order: { tanggal: 'DESC' },
    });
  }

  async create(data: Partial<Keuangan>, tenantId: number): Promise<Keuangan> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    const item = this.keuanganRepo.create({ ...data, tenantId });
    return this.keuanganRepo.save(item);
  }

  async update(id: number, data: Partial<Keuangan>, tenantId: number): Promise<void> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    await this.keuanganRepo.update({ id, tenantId }, data);
  }

  async remove(id: number, tenantId: number): Promise<void> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    await this.keuanganRepo.delete({ id, tenantId });
  }
}
