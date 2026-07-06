import { Injectable } from '@nestjs/common';
import { Jadwal } from '../entity/jadwal.entity';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class JadwalService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<Jadwal[]> {
    return this.supabaseService.findAll<Jadwal>('jadwal', 'tanggal', false);
  }

  async create(data: Partial<Jadwal>): Promise<Jadwal> {
    return this.supabaseService.create<Jadwal>('jadwal', data);
  }

  async update(id: number, data: Partial<Jadwal>): Promise<void> {
    await this.supabaseService.update<Jadwal>('jadwal', id, data);
  }

  async remove(id: number): Promise<void> {
    await this.supabaseService.remove('jadwal', id);
  }
}
