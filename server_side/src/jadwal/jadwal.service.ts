import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Jadwal } from '../entity/jadwal.entity';

@Injectable()
export class JadwalService {
  constructor(
    @InjectRepository(Jadwal)
    private jadwalRepo: Repository<Jadwal>,
  ) {}

  async findAll(tenantId: number): Promise<Jadwal[]> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    return this.jadwalRepo.find({
      where: { tenantId },
      order: { tanggal: 'DESC' },
    });
  }

  async create(data: Partial<Jadwal>, tenantId: number): Promise<Jadwal> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    const item = this.jadwalRepo.create({ ...data, tenantId });
    return this.jadwalRepo.save(item);
  }

  async update(id: number, data: Partial<Jadwal>, tenantId: number): Promise<void> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    await this.jadwalRepo.update({ id, tenantId }, data);
  }

  async remove(id: number, tenantId: number): Promise<void> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    await this.jadwalRepo.delete({ id, tenantId });
  }
}
