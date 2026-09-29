import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserSupabaseAdapter implements IUserRepository {
  constructor(private supabaseService: SupabaseService) {}

  private get client() {
    return this.supabaseService.getClient();
  }

  // Helper untuk memetakan snake_case dari Database ke camelCase di NestJS
  private mapToUser(data: any): User | null {
    if (!data) return null;
    return {
      ...data,
      tenantId: data.tenant_id || data.tenantId,
      jemaatId: data.jemaat_id || data.jemaatId,
      createdAt: data.created_at || data.createdAt,
    } as User;
  }

  async findAll(tenantId: string): Promise<User[]> {
    const { data, error } = await this.client
      .from('user')
      .select('*, jemaat(*)')
      .eq('tenant_id', tenantId)
      .order('id', { ascending: false });

    if (error) {
      console.error('❌ [Supabase findAll] GAGAL:', error.message);
      throw new Error(error.message);
    }
    return data ? data.map(d => this.mapToUser(d) as User) : [];
  }

  async findById(id: string): Promise<User | null> {
    const { data, error } = await this.client
      .from('user')
      .select('*, jemaat(*)')
      .eq('id', id)
      .maybeSingle();

    if (!error && data) return this.mapToUser(data);

    const { data: churchUser } = await this.client
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    return this.mapToUser(churchUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.client
      .from('user')
      .select('*, jemaat(*)')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('❌ [Supabase findByEmail] GAGAL:', error.message);
      return null;
    }
    return this.mapToUser(data);
  }

  async findByUsername(username: string): Promise<User | null> {
    const { data, error } = await this.client
      .from('user')
      .select('*, jemaat(*)')
      .eq('username', username)
      .maybeSingle();

    if (error) {
      console.error('❌ [Supabase findByUsername] GAGAL:', error.message);
      return null;
    }
    return this.mapToUser(data);
  }

  async create(data: Partial<User>): Promise<User> {
    if (!data.email) {
      data.email = `jemaat_${Date.now()}@gereja.local`;
      data.password = 'password_default_123';
    }

    const dbPayload: any = { ...data };
    if (data.tenantId !== undefined) { dbPayload.tenant_id = data.tenantId; delete dbPayload.tenantId; }
    if (data.jemaatId !== undefined) { dbPayload.jemaat_id = data.jemaatId; delete dbPayload.jemaatId; }

    const { data: inserted, error } = await this.client
      .from('user')
      .insert(dbPayload)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return this.mapToUser(inserted) as User;
  }

  async update(id: string, data: Partial<User>, tenantId?: string): Promise<void> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const dbPayload: any = { ...data };
    if (data.tenantId !== undefined) { dbPayload.tenant_id = data.tenantId; delete dbPayload.tenantId; }
    if (data.jemaatId !== undefined) { dbPayload.jemaat_id = data.jemaatId; delete dbPayload.jemaatId; }

    let query = this.client.from('user').update(dbPayload).eq('id', id);
    if (tenantId) query = query.eq('tenant_id', tenantId);
    
    const { error } = await query;
    if (error) {
      console.error('❌ [Supabase update] GAGAL:', error.message);
      throw new Error(error.message);
    }
  }

  async remove(id: string, tenantId?: string): Promise<void> {
    let query = this.client.from('user').delete().eq('id', id);
    if (tenantId) query = query.eq('tenant_id', tenantId);
    
    const { error } = await query;
    if (error) throw new Error(error.message);
  }

  async findMasterUserByEmailOrUsername(identifier: string): Promise<any | null> {
    const { data: churchUsers, error: churchError } = await this.client
      .from('users')
      .select('*')
      .or(`email.eq.${identifier},username.eq.${identifier}`)
      .limit(1);
    if (!churchError && churchUsers?.length) return this.mapToUser(churchUsers[0]);

    const { data, error } = await this.client
      .from('user')
      .select('*')
      .or(`email.eq.${identifier},username.eq.${identifier}`)
      .limit(1);
    if (error) return null;
    return data?.length ? this.mapToUser(data[0]) : null;
  }

  async findChurchBySubdomain(subdomain: string): Promise<any | null> {
    const { data, error } = await this.client
      .from('tenants')
      .select('*')
      .eq('subdomain', subdomain)
      .maybeSingle();
      
    if (error) {
      console.error('❌ [Supabase findChurchBySub] GAGAL:', error.message);
      return null;
    }
    return data;
  }

  async findChurchById(id: string): Promise<any | null> {
    const { data, error } = await this.client
      .from('tenants')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) {
      console.error('❌ [Supabase findChurchById] GAGAL:', error.message);
      return null;
    }
    return data;
  }
}