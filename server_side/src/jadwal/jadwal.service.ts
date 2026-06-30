import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Jadwal } from '../entity/jadwal.entity';

@Injectable()
export class JadwalService {
  constructor(
    @InjectRepository(Jadwal)
    private jadwalRepo: Repository<Jadwal>,
  ) {}

  async findAll(): Promise<Jadwal[]> {
    return this.jadwalRepo.find({ order: { tanggal: 'DESC' } });
  }

  async create(data: Partial<Jadwal>): Promise<Jadwal> {
    const item = this.jadwalRepo.create(data);
    return this.jadwalRepo.save(item);
  }

  async update(id: number, data: Partial<Jadwal>): Promise<void> {
    await this.jadwalRepo.update(id, data);
  }

  async remove(id: number): Promise<void> {
    await this.jadwalRepo.delete(id);
  }
}