import { Injectable } from '@nestjs/common';
import { User } from '../entity/data.entity';
import * as bcrypt from 'bcrypt';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class UsersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<User[]> {
    return this.supabaseService.findAll<User>('users', 'id', false);
  }

  async create(userData: Partial<User>): Promise<User> {
    if (!userData.email) {
      userData.email = `jemaat_${Date.now()}@gereja.local`;
      userData.password = 'password_default_123';
    }
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    return this.supabaseService.create<User>('users', userData);
  }

  async update(id: number, userData: Partial<User>): Promise<void> {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    await this.supabaseService.update<User>('users', id, userData);
  }

  async remove(id: number): Promise<void> {
    await this.supabaseService.remove('users', id);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.supabaseService.findOneByField<User>('users', 'username', username);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.supabaseService.findOneByField<User>('users', 'email', email);
  }

  async findById(id: number): Promise<User | null> {
    return this.supabaseService.findById<User>('users', id);
  }
}
