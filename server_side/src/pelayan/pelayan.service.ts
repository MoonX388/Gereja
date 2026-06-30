import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pelayan } from '../entity/pelayan.entity';

@Injectable()
export class PelayanService {
  constructor(
    @InjectRepository(Pelayan)
    private pelayanRepo: Repository<Pelayan>,
  ) {}

  async findAll(): Promise<Pelayan[]> {
    return this.pelayanRepo.find({ order: { id: 'DESC' } });
  }

  async create(data: Partial<Pelayan>): Promise<Pelayan> {
    const item = this.pelayanRepo.create(data);
    return this.pelayanRepo.save(item);
  }

  async update(id: number, data: Partial<Pelayan>): Promise<void> {
    await this.pelayanRepo.update(id, data);
  }

  async remove(id: number): Promise<void> {
    await this.pelayanRepo.delete(id);
  }
}