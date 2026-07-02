import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Keuangan } from '../entity/keuangan.entity';

@Injectable()
export class KeuanganService {
  constructor(
    @InjectRepository(Keuangan)
    private keuanganRepo: Repository<Keuangan>,
  ) {}

  async findAll(): Promise<Keuangan[]> {
    return this.keuanganRepo.find({ order: { tanggal: 'DESC' } });
  }

  async create(data: Partial<Keuangan>): Promise<Keuangan> {
    const item = this.keuanganRepo.create(data);
    return this.keuanganRepo.save(item);
  }

  async update(id: number, data: Partial<Keuangan>): Promise<void> {
    await this.keuanganRepo.update(id, data);
  }

  async remove(id: number): Promise<void> {
    await this.keuanganRepo.delete(id);
  }
}
