import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { IPelayanRepository } from '../interfaces/pelayan-repository.interface';
import { Pelayan } from '../entity/pelayan.entity';

@Injectable()
export class PelayanSupabaseAdapter implements IPelayanRepository {
  constructor(private supabaseService: SupabaseService) {}
  private get client() { return this.supabaseService.getClient(); }

  async findAll(tenantId: string): Promise<Pelayan[]> {
    const { data, error } = await this.client
      .from('pelayan')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('id', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }

  async create(data: Partial<Pelayan>, tenantId: string): Promise<Pelayan> {
    const payload: any = { ...data, tenant_id: tenantId };
    delete payload.tenantId;

    const { data: inserted, error } = await this.client
      .from('pelayan')
      .insert(payload)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return inserted;
  }

  async update(id: string, data: Partial<Pelayan>, tenantId: string): Promise<void> {
    const payload: any = { ...data };
    delete payload.tenantId;

    const { error } = await this.client
      .from('pelayan')
      .update(payload)
      .eq('id', id)
      .eq('tenant_id', tenantId);
    if (error) throw new Error(error.message);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const { error } = await this.client
      .from('pelayan')
      .delete()
      .eq('id', id)
      .eq('tenant_id', tenantId);
    if (error) throw new Error(error.message);
  }
}