import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { IJemaatRepository } from '../interfaces/jemaat-repository.interface';
import { Jemaat } from '../entity/jemaat.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class JemaatSupabaseAdapter implements IJemaatRepository {
  constructor(private supabaseService: SupabaseService) {}
  private get client() { return this.supabaseService.getClient(); }

  async getDashboardData(tenantId: string) {
    // Ambil tenant info (dari tabel users, pakai ID)
    const { data: tenantInfo, error: e1 } = await this.client
      .from('users')
      .select('id, namaGereja, namaAdmin, email')
      .eq('id', tenantId)
      .maybeSingle();
    if (e1) throw new Error(e1.message);

    // Ambil daftar jemaat
    const { data: jemaat, error: e2 } = await this.client
      .from('jemaat')
      .select('*, user(*)')
      .eq('tenant_id', tenantId)
      .order('id', { ascending: false });
    if (e2) throw new Error(e2.message);
    
    return { tenant: tenantInfo, jemaat: jemaat || [] };
  }

  async findAll(tenantId: string): Promise<Jemaat[]> {
    try {
      const { data, error } = await this.client
        .from('jemaat')
        .select('*, user(*)')
        .eq('tenant_id', tenantId)
        .order('id', { ascending: false });
      if (error) throw new Error(error.message);
      return data || [];
    } catch (error) {
      console.error('Error in findAll jemaat:', error);
      throw error;
    }
  }

  async findByPhone(nomorHP: string): Promise<Jemaat | null> {
    const { data, error } = await this.client
      .from('jemaat')
      .select('*, user(*)')
      .eq('nomorHP', nomorHP) // pastikan ini sesuai dengan nama kolom di DB
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data || null;
  }

  async create(dto: any, tenantId: string): Promise<Jemaat> {
    const jenisKelaminValue = dto.jenisKelamin || dto.jenis_kelamin || dto.gender || 'Laki-laki';
    const { email, password, role, jenis_kelamin, jenisKelamin, gender, ...dataJemaat } = dto;
    
    // Insert jemaat
    const jemaatPayload: any = { ...dataJemaat, jenisKelamin: jenisKelaminValue, tenant_id: tenantId };
    delete jemaatPayload.tenantId;

    const { data: savedJemaat, error: e1 } = await this.client
      .from('jemaat')
      .insert(jemaatPayload)
      .select()
      .single();
    if (e1) throw new Error(e1.message);
    
    // Insert user
    const finalEmail = email || `jemaat_${Date.now()}_${Math.floor(Math.random() * 100000)}_tenant_${tenantId}@gereja.local`;
    const finalPassword = password || `no_login_access_${Math.random()}_${Date.now()}`;
    const hashedPassword = await bcrypt.hash(finalPassword, 10);
    
    const { error: e2 } = await this.client
      .from('users')
      .insert({
        email: finalEmail,
        password: hashedPassword,
        role: role || 'jemaat',
        jemaat_id: savedJemaat.id, // Sesuaikan dengan DB
        tenant_id: tenantId,       // Sesuaikan dengan DB
      });
    if (e2) throw new Error(e2.message);
    
    return savedJemaat;
  }

  async update(id: string, dto: any, tenantId: string): Promise<void> {
    const { email, password, role, jenis_kelamin, jenisKelamin, gender, ...rest } = dto;
    const normalizedData: Record<string, any> = { ...rest };
    
    if (jenisKelamin || jenis_kelamin || gender) {
      normalizedData.jenisKelamin = jenisKelamin || jenis_kelamin || gender;
    }
    delete normalizedData.tenantId;

    // Update jemaat
    if (Object.keys(normalizedData).length > 0) {
      const { error } = await this.client
        .from('jemaat')
        .update(normalizedData)
        .eq('id', id)
        .eq('tenant_id', tenantId);
      if (error) throw new Error(error.message);
    }
    
    // Update user jika ada perubahan
    if (email || password || role) {
      const updateDataUser: any = {};
      if (email) updateDataUser.email = email;
      if (role) updateDataUser.role = role;
      if (password) {
        updateDataUser.password = await bcrypt.hash(password, 10);
      }
      const { error } = await this.client
        .from('users')
        .update(updateDataUser)
        .eq('jemaat_id', id)
        .eq('tenant_id', tenantId);
      if (error) throw new Error(error.message);
    }
  }

  async remove(id: string, tenantId: string): Promise<void> {
    // Hapus user dulu
    await this.client
      .from('users')
      .delete()
      .eq('jemaat_id', id)
      .eq('tenant_id', tenantId);
      
    // Hapus jemaat
    const { error } = await this.client
      .from('jemaat')
      .delete()
      .eq('id', id)
      .eq('tenant_id', tenantId);
    if (error) throw new Error(error.message);
  }
}