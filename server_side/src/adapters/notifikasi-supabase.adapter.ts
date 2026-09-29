import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { INotifikasiRepository } from '../interfaces/notifikasi-repository.interface';
import { Notifikasi } from '../entity/notifikasi.entity';

@Injectable()
export class NotifikasiSupabaseAdapter implements INotifikasiRepository {
  constructor(private supabaseService: SupabaseService) {}
  private get client() { return this.supabaseService.getClient(); }

  async findAll(tenantId: string): Promise<Notifikasi[]> {
    const { data, error } = await this.client
      .from('notifikasi')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('id', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }

  async create(data: Partial<Notifikasi>, tenantId: string): Promise<Notifikasi> {
    const payload: any = { ...data, tenant_id: tenantId };
    delete payload.tenantId;

    const { data: inserted, error } = await this.client
      .from('notifikasi')
      .insert(payload)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return inserted;
  }

  async update(id: string, data: Partial<Notifikasi>, tenantId: string): Promise<void> {
    const payload: any = { ...data };
    delete payload.tenantId;

    const { error } = await this.client
      .from('notifikasi')
      .update(payload)
      .eq('id', id)
      .eq('tenant_id', tenantId);
    if (error) throw new Error(error.message);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const { error } = await this.client
      .from('notifikasi')
      .delete()
      .eq('id', id)
      .eq('tenant_id', tenantId);
    if (error) throw new Error(error.message);
  }
}