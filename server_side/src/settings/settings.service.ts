import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class SettingsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get client() {
    return this.supabaseService.getClient();
  }

  async getForTenant(tenantId: string | null) {
    // Platform roles (owner, admin) mungkin tidak punya tenantId
    // Return default settings untuk platform-level users
    if (!tenantId) {
      console.log('[SettingsService] No tenantId, returning default settings for platform user');
      return {
        namaGereja: 'Platform',
        subdomain: '',
        namaAdmin: '',
        noHpAdmin: '',
        alamat: '',
        kota: '',
        provinsi: '',
        deskripsi: '',
        tenantId: null,
        notif: {},
        tampilan: {},
        wa: {},
      };
    }

    const { data: tenant, error: tenantError } = await this.client
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .maybeSingle();

    if (tenantError) throw new Error(`Gagal membaca tenant: ${tenantError.message}`);

    const { data: publicProfile } = await this.client
      .from('users')
      .select('namaGereja, subdomain, namaAdmin, noHpAdmin, alamat, kota, provinsi, deskripsi')
      .eq('tenant_id', tenantId)
      .limit(1)
      .maybeSingle();

    const { data: settings } = await this.client
      .from('settings')
      .select('*')
      .eq('tenant_id', tenantId)
      .maybeSingle();

    return {
      ...(settings ?? {}),
      namaGereja: tenant?.namaGereja ?? publicProfile?.namaGereja ?? settings?.namaGereja ?? '',
      subdomain: tenant?.subdomain ?? publicProfile?.subdomain ?? '',
      ...publicProfile,
      tenantId,
    };
  }

  async updateForTenant(tenantId: string, data: Record<string, any>) {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');

    const { namaGereja, subdomain, ...settingsData } = data;
    let settingsWarning: string | undefined;
    const tenantUpdate: Record<string, any> = {};
    if (namaGereja !== undefined) tenantUpdate.namaGereja = namaGereja;
    if (subdomain !== undefined) tenantUpdate.subdomain = subdomain;

    if (Object.keys(tenantUpdate).length > 0) {
      const { error } = await this.client.from('tenants').update(tenantUpdate).eq('id', tenantId);
      if (error) throw new Error(`Gagal memperbarui tenant: ${error.message}`);
    }

    const publicProfileFields = ['namaGereja', 'subdomain', 'namaAdmin', 'noHpAdmin', 'alamat', 'kota', 'provinsi', 'deskripsi'];
    const publicProfileUpdate = Object.fromEntries(
      Object.entries(data).filter(([key]) => publicProfileFields.includes(key)),
    );
    if (Object.keys(publicProfileUpdate).length > 0) {
      const { error } = await this.client
        .from('users')
        .update(publicProfileUpdate)
        .eq('tenant_id', tenantId);
      if (error) settingsWarning = error.message;
    }

    const allowedSettings = ['notif', 'tampilan', 'wa'];
    const payload = Object.fromEntries(
      Object.entries(settingsData).filter(([key]) => allowedSettings.includes(key)),
    );
    if (namaGereja !== undefined) payload.namaGereja = namaGereja;

    if (Object.keys(payload).length > 0) {
      const { error } = await this.client
        .from('settings')
        .upsert({ ...payload, tenant_id: tenantId }, { onConflict: 'tenant_id' });
      if (error) settingsWarning = error.message;
    }

    const result = await this.getForTenant(tenantId);
    return settingsWarning ? { ...result, settingsWarning } : result;
  }
}
