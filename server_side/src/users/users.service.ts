// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; // 🚀 TAMBAHKAN IMPORT INI
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ order: { id: 'DESC' } });
  }

  async create(userData: Partial<User>): Promise<User> {
    if (!userData.email) {
      userData.email = `jemaat_${Date.now()}@gereja.local`;
      userData.password = 'password_default_123';
    }
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async update(id: number, userData: Partial<User>): Promise<void> {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    await this.usersRepository.update(id, userData);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findChurchBySubdomain(subdomain: string): Promise<any | null> {
    const result = await this.usersRepository.query(
      'SELECT * FROM users WHERE subdomain = $1 LIMIT 1',
      [subdomain],
    );
    return result && result.length > 0 ? result[0] : null;
  }

  async findChurchById(id: number): Promise<any | null> {
    const result = await this.usersRepository.query(
      'SELECT * FROM users WHERE id = $1 LIMIT 1',
      [id],
    );
    return result && result.length > 0 ? result[0] : null;
  }
}