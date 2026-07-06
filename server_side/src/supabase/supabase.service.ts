import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly client: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SECRET_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Konfigurasi Supabase belum lengkap. Pastikan SUPABASE_URL dan SUPABASE_SECRET_KEY ada di environment.');
    }

    this.client = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  getClient(): SupabaseClient {
    return this.client;
  }

  async findAll<T>(table: string, orderBy = 'id', ascending = false): Promise<T[]> {
    const { data, error } = await this.client.from(table).select('*').order(orderBy, { ascending });
    if (error) throw error;
    return (data ?? []) as T[];
  }

  async findWhere<T>(table: string, filters: Record<string, unknown>, orderBy = 'id', ascending = false): Promise<T[]> {
    let query = this.client.from(table).select('*');

    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value as never);
    });

    const { data, error } = await query.order(orderBy, { ascending });
    if (error) throw error;
    return (data ?? []) as T[];
  }

  async findOneByField<T>(table: string, field: string, value: unknown): Promise<T | null> {
    const { data, error } = await this.client.from(table).select('*').eq(field, value).maybeSingle();
    if (error) throw error;
    return (data as T | null) ?? null;
  }

  async findById<T>(table: string, id: number | string): Promise<T | null> {
    const { data, error } = await this.client.from(table).select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return (data as T | null) ?? null;
  }

  async create<T>(table: string, payload: Partial<T>): Promise<T> {
    const { data, error } = await this.client.from(table).insert(payload as never).select('*').single();
    if (error) throw error;
    return data as T;
  }

  async update<T>(table: string, id: number | string, payload: Partial<T>): Promise<T> {
    const { data, error } = await this.client.from(table).update(payload as never).eq('id', id).select('*').single();
    if (error) throw error;
    return data as T;
  }

  async remove(table: string, id: number | string): Promise<void> {
    const { error } = await this.client.from(table).delete().eq('id', id);
    if (error) throw error;
  }
}
