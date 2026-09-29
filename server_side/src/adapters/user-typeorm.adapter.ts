import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { IUserRepository } from '../interfaces/user-repository.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserTypeOrmAdapter implements IUserRepository {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findAll(tenantId: string): Promise<User[]> {
    console.log('[TypeORM] User.findAll');
    return this.repo.find({
      where: { tenantId },
      order: { id: 'DESC' },
      relations: { jemaat: true },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id }, relations: { jemaat: true } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email }, relations: { jemaat: true } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.repo.findOne({ where: { username }, relations: { jemaat: true } });
  }

  async create(data: Partial<User>): Promise<User> {
    if (!data.email) {
      data.email = `jemaat_${Date.now()}@gereja.local`;
      data.password = 'password_default_123';
    }
    const user = this.repo.create(data);
    const saved = await this.repo.save(user);
    return saved;
  }

  async update(id: string, data: Partial<User>, tenantId?: string): Promise<void> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    if (tenantId) {
      await this.repo.update({ id, tenantId }, data);
    } else {
      await this.repo.update(id, data);
    }
  }

  async remove(id: string, tenantId?: string): Promise<void> {
    if (tenantId) {
      await this.repo.delete({ id, tenantId });
    } else {
      await this.repo.delete(id);
    }
  }

  // 🚀 PERBAIKAN: Gunakan fitur bawaan TypeORM agar lebih aman dari SQL Injection
  // dan otomatis mengatasi masalah nama tabel / reserved keyword.

  async findMasterUserByEmailOrUsername(identifier: string): Promise<any | null> {
    return this.repo.findOne({
      where: [
        { email: identifier },
        { username: identifier }
      ]
    });
  }

  async findChurchBySubdomain(subdomain: string): Promise<any | null> {
    // Karena 'subdomain' sepertinya tidak ada di User entity, kita pakai Raw Query yang aman:
    // Pastikan menggunakan "user" (pakai kutip) karena user adalah reserved keyword di Postgres.
    const result = await this.repo.query(
      'SELECT * FROM "user" WHERE subdomain = $1 LIMIT 1',
      [subdomain],
    );
    return result?.length ? result[0] : null;
  }

  async findChurchById(id: string): Promise<any | null> {
    const result = await this.repo.query(
      'SELECT * FROM tenants WHERE id = $1 LIMIT 1',
      [id],
    );
    return result?.length ? result[0] : null;
  }
}