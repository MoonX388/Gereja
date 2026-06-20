import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';

@Injectable()
export class JemaatService {
  constructor(
    @InjectRepository(User)
    private jemaatRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.jemaatRepository.find({ order: { id: 'DESC' } });
  }

  async create(data: Partial<User>): Promise<User> {
    const jemaat = this.jemaatRepository.create(data);
    return this.jemaatRepository.save(jemaat);
  }

  async update(id: number, data: Partial<User>): Promise<void> {
    await this.jemaatRepository.update(id, data);
  }

  async remove(id: number): Promise<void> {
    await this.jemaatRepository.delete(id);
  }
}