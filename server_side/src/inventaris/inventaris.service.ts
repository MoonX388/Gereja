import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventaris } from '../entity/inventaris.entity';

@Injectable()
export class InventarisService {
  constructor(
    @InjectRepository(Inventaris)
    private inventarisRepo: Repository<Inventaris>,
  ) {}

  async findAll(): Promise<Inventaris[]> {
    return this.inventarisRepo.find({ order: { id: 'DESC' } });
  }

  async create(data: Partial<Inventaris>): Promise<Inventaris> {
    const item = this.inventarisRepo.create(data);
    return this.inventarisRepo.save(item);
  }

  async update(id: number, data: Partial<Inventaris>): Promise<void> {
    await this.inventarisRepo.update(id, data);
  }

  async remove(id: number): Promise<void> {
    await this.inventarisRepo.delete(id);
  }
}
