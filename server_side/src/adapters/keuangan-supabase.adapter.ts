import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { IKeuanganRepository } from '../interfaces/keuangan-repository.interface';
import { Keuangan } from '../entity/keuangan.entity';

@Injectable()
export class KeuanganSupabaseAdapter implements IKeuanganRepository {
  constructor(private supabaseService: SupabaseService) {}
  private get client() { return this.supabaseService.getClient(); }

  async findAll(tenantId: string): Promise<Keuangan[]> {
    const { data, error } = await this.client
      .from('keuangan')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('tanggal', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }

  async create(data: Partial<Keuangan>, tenantId: string): Promise<Keuangan> {
    const payload: any = { ...data, tenant_id: tenantId };
    delete payload.tenantId;

    const { data: inserted, error } = await this.client
      .from('keuangan')
      .insert(payload)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return inserted;
  }

  async update(id: string, data: Partial<Keuangan>, tenantId: string): Promise<void> {
    const payload: any = { ...data };
    delete payload.tenantId;

    const { error } = await this.client
      .from('keuangan')
      .update(payload)
      .eq('id', id)
      .eq('tenant_id', tenantId);
    if (error) throw new Error(error.message);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const { error } = await this.client
      .from('keuangan')
      .delete()
      .eq('id', id)
      .eq('tenant_id', tenantId);
    if (error) throw new Error(error.message);
  }
}