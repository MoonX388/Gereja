import { Injectable } from '@nestjs/common';
import { Inventaris } from '../entity/inventaris.entity';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class InventarisService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<Inventaris[]> {
    return this.supabaseService.findAll<Inventaris>('inventaris', 'id', false);
  }

  async create(data: Partial<Inventaris>): Promise<Inventaris> {
    return this.supabaseService.create<Inventaris>('inventaris', data);
  }

  async update(id: number, data: Partial<Inventaris>): Promise<void> {
    await this.supabaseService.update<Inventaris>('inventaris', id, data);
  }

  async remove(id: number): Promise<void> {
    await this.supabaseService.remove('inventaris', id);
  }
}
