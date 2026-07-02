import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User as Jemaat } from '../entity/data.entity';
import * as bcrypt from 'bcrypt';

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
    // 🔹 1. Jika email tidak dikirim, buat otomatis (unik)
    if (!data.email) {
      data.email = `jemaat_${Date.now()}@gereja.local`;
    }
    // 🔹 2. Jika password tidak dikirim, set default
    if (!data.password) {
      data.password = 'password_default_123';
    }
    // 🔹 3. Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    const jemaat = this.jemaatRepository.create(data);
    return this.jemaatRepository.save(jemaat);
  }

  async update(id: number, data: Partial<Jemaat>): Promise<void> {
    // Jika ada password yang dikirim, hash ulang
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    await this.jemaatRepository.update(id, data);
  }

  async remove(id: number): Promise<void> {
    await this.jemaatRepository.delete(id);
  }
}
