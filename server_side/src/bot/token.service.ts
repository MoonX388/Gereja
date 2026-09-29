import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import * as crypto from 'crypto';

@Injectable()
export class TokenService {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get client() {
    return this.supabaseService.getClient();
  }

  private async loadOrGenerateToken(tenantId: string): Promise<string> {
    const { data: activeToken, error } = await this.client
      .from('tokens')
      .select('token')
      .eq('tenant_id', tenantId)
      .eq('isActive', true)
      .order('createdAt', { ascending: false })
      .maybeSingle();

    if (error) throw new Error(`Gagal membaca token bot: ${error.message}`);
    if (activeToken) return activeToken.token;
    return this.generateNewToken(tenantId);
  }

  private async generateNewToken(tenantId: string): Promise<string> {
    const newToken = crypto.randomBytes(16).toString('hex');

    const { error } = await this.client.from('tokens').insert({
      token: newToken,
      tenant_id: tenantId,
      isActive: true,
    });
    if (error) throw new Error(`Gagal membuat token bot: ${error.message}`);
    return newToken;
  }

  async getToken(tenantId: string): Promise<string> {
    return this.loadOrGenerateToken(tenantId);
  }

  async validateToken(input: string, tenantId: string): Promise<boolean> {
    const { data, error } = await this.client
      .from('tokens')
      .select('id')
      .eq('token', input)
      .eq('tenant_id', tenantId)
      .eq('isActive', true)
      .maybeSingle();
    if (error) throw new Error(`Gagal memvalidasi token bot: ${error.message}`);
    return !!data;
  }

  async regenerateToken(tenantId: string): Promise<string> {
    const { error: deactivateError } = await this.client
      .from('tokens')
      .update({ isActive: false })
      .eq('tenant_id', tenantId)
      .eq('isActive', true);
    if (deactivateError) throw new Error(`Gagal menonaktifkan token bot: ${deactivateError.message}`);

    const newToken = crypto.randomBytes(16).toString('hex');
    const { error } = await this.client.from('tokens').insert({
      token: newToken,
      tenant_id: tenantId,
      isActive: true,
    });
    if (error) throw new Error(`Gagal membuat token bot: ${error.message}`);
    return newToken;
  }
}
