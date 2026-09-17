// src/users/users.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  async findAll(tenantId?: number): Promise<User[]> {
    if (!tenantId) {
      throw new UnauthorizedException('Tenant tidak valid');
    }

    return this.usersRepository.find({
      where: { tenantId },
      order: { id: 'DESC' },
    });
  }

  async create(userData: Partial<User>): Promise<User> {
    if (!userData.email) {
      userData.email = `jemaat_${Date.now()}@gereja.local`;
      userData.password = 'password_default_123';
    }
    const user = this.usersRepository.create(userData);
    const saved = await this.usersRepository.save(user);

    if (!saved.tenantId) {
      await this.usersRepository.update(saved.id, { tenantId: saved.id });
      saved.tenantId = saved.id;
    }

    return saved;
  }

  async update(id: number, userData: Partial<User>, tenantId?: number): Promise<void> {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    if (tenantId) {
      await this.usersRepository.update({ id, tenantId }, userData);
    } else {
      await this.usersRepository.update(id, userData);
    }
  }

  async remove(id: number, tenantId?: number): Promise<void> {
    if (tenantId) {
      await this.usersRepository.delete({ id, tenantId });
    } else {
      await this.usersRepository.delete(id);
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { username },
      relations: { jemaat: true },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: { jemaat: true },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: { jemaat: true },
    });
  }

  async findMasterUserByEmailOrUsername(identifier: string): Promise<any | null> {
    const result = await this.usersRepository.query(
      'SELECT * FROM users WHERE email = $1 OR username = $1 LIMIT 1',
      [identifier],
    );
    return result && result.length > 0 ? result[0] : null;
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