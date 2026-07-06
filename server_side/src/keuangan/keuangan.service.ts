import { Injectable } from '@nestjs/common';
import { Keuangan } from '../entity/keuangan.entity';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class KeuanganService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<Keuangan[]> {
    return this.supabaseService.findAll<Keuangan>('keuangan', 'tanggal', false);
  }

  async create(data: Partial<Keuangan>): Promise<Keuangan> {
    return this.supabaseService.create<Keuangan>('keuangan', data);
  }

  async update(id: number, data: Partial<Keuangan>): Promise<void> {
    await this.supabaseService.update<Keuangan>('keuangan', id, data);
  }

  async remove(id: number): Promise<void> {
    await this.supabaseService.remove('keuangan', id);
  }
}
