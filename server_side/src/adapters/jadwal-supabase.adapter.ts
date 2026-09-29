import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { IJadwalRepository } from '../interfaces/jadwal-repository.interface';
import { Jadwal } from '../entity/jadwal.entity';

@Injectable()
export class JadwalSupabaseAdapter implements IJadwalRepository {
  constructor(private supabaseService: SupabaseService) {}
  private get client() { return this.supabaseService.getClient(); }

  async findAll(tenantId: string): Promise<Jadwal[]> {
    const { data, error } = await this.client
      .from('jadwal')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('tanggal', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }

  async create(data: Partial<Jadwal>, tenantId: string): Promise<Jadwal> {
    const payload: any = { ...data, tenant_id: tenantId };
    delete payload.tenantId;

    const { data: inserted, error } = await this.client
      .from('jadwal')
      .insert(payload)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return inserted;
  }

  async update(id: string, data: Partial<Jadwal>, tenantId: string): Promise<void> {
    const payload: any = { ...data };
    delete payload.tenantId;

    const { error } = await this.client
      .from('jadwal')
      .update(payload)
      .eq('id', id)
      .eq('tenant_id', tenantId);
    if (error) throw new Error(error.message);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const { error } = await this.client
      .from('jadwal')
      .delete()
      .eq('id', id)
      .eq('tenant_id', tenantId);
    if (error) throw new Error(error.message);
  }
}