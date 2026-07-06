import { Injectable } from '@nestjs/common';
import { Pelayan } from '../entity/pelayan.entity';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class PelayanService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<Pelayan[]> {
    return this.supabaseService.findAll<Pelayan>('pelayan', 'id', false);
  }

  async create(data: Partial<Pelayan>): Promise<Pelayan> {
    return this.supabaseService.create<Pelayan>('pelayan', data);
  }

  async update(id: number, data: Partial<Pelayan>): Promise<void> {
    await this.supabaseService.update<Pelayan>('pelayan', id, data);
  }

  async remove(id: number): Promise<void> {
    await this.supabaseService.remove('pelayan', id);
  }
}
