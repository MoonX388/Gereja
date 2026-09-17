import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pelayan } from '../entity/pelayan.entity';

@Injectable()
export class PelayanService {
  constructor(
    @InjectRepository(Pelayan)
    private pelayanRepo: Repository<Pelayan>,
  ) {}

  async findAll(tenantId: number): Promise<Pelayan[]> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    return this.pelayanRepo.find({
      where: { tenantId },
      order: { id: 'DESC' },
    });
  }

  async create(data: Partial<Pelayan>, tenantId: number): Promise<Pelayan> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    const item = this.pelayanRepo.create({ ...data, tenantId });
    return this.pelayanRepo.save(item);
  }

  async update(id: number, data: Partial<Pelayan>, tenantId: number): Promise<void> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    await this.pelayanRepo.update({ id, tenantId }, data);
  }

  async remove(id: number, tenantId: number): Promise<void> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    await this.pelayanRepo.delete({ id, tenantId });
  }
}
