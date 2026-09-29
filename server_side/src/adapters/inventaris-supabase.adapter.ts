import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { IInventarisRepository } from '../interfaces/inventaris-repository.interface';
import { Inventaris } from '../entity/inventaris.entity';

@Injectable()
export class InventarisSupabaseAdapter implements IInventarisRepository {
  constructor(private supabaseService: SupabaseService) {}
  private get client() { return this.supabaseService.getClient(); }

  async findAll(tenantId: string): Promise<Inventaris[]> {
    const { data, error } = await this.client
      .from('inventaris')
      .select('*')
      .eq('tenant_id', tenantId);
    if (error) throw new Error(error.message);
    return data || [];
  }

  async create(data: Partial<Inventaris>, tenantId: string): Promise<Inventaris> {
    const payload: any = { ...data, tenant_id: tenantId };
    delete payload.tenantId; // Hapus versi camelCase agar Supabase tidak bingung

    const { data: inserted, error } = await this.client
      .from('inventaris')
      .insert(payload)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return inserted;
  }

  async update(id: string, data: Partial<Inventaris>, tenantId: string): Promise<void> {
    const payload: any = { ...data };
    delete payload.tenantId;

    const { error } = await this.client
      .from('inventaris')
      .update(payload)
      .eq('id', id)
      .eq('tenant_id', tenantId);
    if (error) throw new Error(error.message);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const { error } = await this.client
      .from('inventaris')
      .delete()
      .eq('id', id)
      .eq('tenant_id', tenantId);
    if (error) throw new Error(error.message);
  }
}