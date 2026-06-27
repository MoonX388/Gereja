import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User as Jemaat } from '../entity/user.entity';

@Injectable()
export class JemaatService {
  constructor(
    @InjectRepository(Jemaat)
    private jemaatRepository: Repository<Jemaat>,
  ) {}

  async findAll(): Promise<Jemaat[]> {
    return this.jemaatRepository.find({ order: { id: 'DESC' } });
  }

  async create(data: Partial<Jemaat>): Promise<Jemaat> {
    const jemaat = this.jemaatRepository.create(data);
    return this.jemaatRepository.save(jemaat);
  }

  async update(id: number, data: Partial<Jemaat>): Promise<void> {
    await this.jemaatRepository.update(id, data);
  }

  async remove(id: number): Promise<void> {
    await this.jemaatRepository.delete(id);
  }
}