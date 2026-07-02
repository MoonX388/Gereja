import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Keluarga } from '../entity/keluarga.entity';

@Injectable()
export class KeluargaService {
  constructor(
    @InjectRepository(Keluarga)
    private keluargaRepo: Repository<Keluarga>,
  ) {}

  async findAll(): Promise<Keluarga[]> {
    return this.keluargaRepo.find({ order: { id: 'DESC' } });
  }

  async create(data: Partial<Keluarga>): Promise<Keluarga> {
    const item = this.keluargaRepo.create(data);
    return this.keluargaRepo.save(item);
  }

  async update(id: number, data: Partial<Keluarga>): Promise<void> {
    await this.keluargaRepo.update(id, data);
  }

  async remove(id: number): Promise<void> {
    await this.keluargaRepo.delete(id);
  }
}
