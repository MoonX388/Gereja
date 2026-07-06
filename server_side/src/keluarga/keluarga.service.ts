import { Injectable } from '@nestjs/common';
import { Keluarga } from '../entity/keluarga.entity';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class KeluargaService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<Keluarga[]> {
    return this.supabaseService.findAll<Keluarga>('keluarga', 'id', false);
  }

  async create(data: Partial<Keluarga>): Promise<Keluarga> {
    return this.supabaseService.create<Keluarga>('keluarga', data);
  }

  async update(id: number, data: Partial<Keluarga>): Promise<void> {
    await this.supabaseService.update<Keluarga>('keluarga', id, data);
  }

  async remove(id: number): Promise<void> {
    await this.supabaseService.remove('keluarga', id);
  }
}
