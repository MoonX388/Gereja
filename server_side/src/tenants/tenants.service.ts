import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

export interface TenantRecord {
  id: string;
  namaGereja: string | null;
  subdomain: string | null;
}

/**
 * TenantsService — sebelumnya TIDAK ADA sama sekali di codebase.
 * Tabel `tenants` (uuid) dibuat lewat migrasi SQL, tapi tidak ada
 * satupun kode NestJS yang membacanya/menulisnya. Service ini adalah
 * satu-satunya sumber kebenaran untuk membuat & mencari tenant,
 * supaya logika "provisioning tenant baru" tidak lagi tersebar/ad-hoc
 * seperti pola lama (`user.tenantId = user.id`) di jwt.strategy.ts.
 */
@Injectable()
export class TenantsService {
  constructor(private supabaseService: SupabaseService) {}

  private get client() {
    return this.supabaseService.getClient();
  }

  async findById(id: string): Promise<TenantRecord | null> {
    const { data, error } = await this.client
      .from('tenants')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Gagal mengambil tenant: ${error.message}`);
    }
    return data ?? null;
  }

  async findBySubdomain(subdomain: string): Promise<TenantRecord | null> {
    const { data, error } = await this.client
      .from('tenants')
      .select('*')
      .eq('subdomain', subdomain)
      .maybeSingle();

    if (error) throw new Error(`Gagal mencari tenant: ${error.message}`);
    return data ?? null;
  }

  /**
   * Buat tenant baru. Dipakai saat admin pertama kali login/register
   * dan belum punya tenant_id (mis. akun lama sebelum migrasi UUID).
   */
  async create(data: { namaGereja?: string | null; subdomain?: string | null }): Promise<TenantRecord> {
    const { data: inserted, error } = await this.client
      .from('tenants')
      .insert({
        namaGereja: data.namaGereja ?? null,
        subdomain: data.subdomain ?? null,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Gagal membuat tenant baru: ${error.message}`);
    }
    return inserted;
  }
}
