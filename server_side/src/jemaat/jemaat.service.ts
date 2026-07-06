import { Injectable } from '@nestjs/common';
import { User as Jemaat } from '../entity/data.entity';
import * as bcrypt from 'bcrypt';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class JemaatService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<Jemaat[]> {
    return this.supabaseService.findAll<Jemaat>('jemaat', 'id', false);
  }

  async create(data: Partial<Jemaat>): Promise<Jemaat> {
    if (!data.email) {
      data.email = `jemaat_${Date.now()}@gereja.local`;
    }
    if (!data.password) {
      data.password = 'password_default_123';
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.supabaseService.create<Jemaat>('jemaat', { ...data, password: hashedPassword });
  }

  async update(id: number, data: Partial<Jemaat>): Promise<void> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    await this.supabaseService.update<Jemaat>('jemaat', id, data);
  }

  async remove(id: number): Promise<void> {
    await this.supabaseService.remove('jemaat', id);
  }
}
