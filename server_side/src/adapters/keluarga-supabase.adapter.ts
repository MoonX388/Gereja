import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { IKeluargaRepository } from '../interfaces/keluarga-repository.interface';
import { Keluarga } from '../entity/keluarga.entity';

@Injectable()
export class KeluargaSupabaseAdapter implements IKeluargaRepository {
  constructor(private supabaseService: SupabaseService) {}
  private get client() { return this.supabaseService.getClient(); }

  async findAll(tenantId: string): Promise<Keluarga[]> {
    const { data, error } = await this.client
      .from('keluarga')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('id', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }

  async create(data: Partial<Keluarga>, tenantId: string): Promise<Keluarga> {
    const { data: inserted, error } = await this.client
      .from('keluarga')
      .insert({ ...data, tenant_id: tenantId })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return inserted;
  }

  async update(id: string, data: Partial<Keluarga>, tenantId: string): Promise<void> {
    const { error } = await this.client
      .from('keluarga')
      .update(data)
      .eq('id', id)
      .eq('tenant_id', tenantId);
    if (error) throw new Error(error.message);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const { error } = await this.client
      .from('keluarga')
      .delete()
      .eq('id', id)
      .eq('tenant_id', tenantId);
    if (error) throw new Error(error.message);
  }
}
