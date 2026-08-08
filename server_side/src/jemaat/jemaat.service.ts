import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Jemaat } from '../entity/jemaat.entity';
import { User } from '../entity/user.entity'; 
import * as bcrypt from 'bcrypt';

@Injectable()
export class JemaatService {
  constructor(
    @InjectRepository(Jemaat)
    private readonly jemaatRepository: Repository<Jemaat>,
    
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,
  ) {}

  private validateTenant(tenantId: number) {
    if (!tenantId) {
      throw new UnauthorizedException('Tenant tidak valid');
    }
  }

  async getDashboardData(tenantId: number) {
    this.validateTenant(tenantId);
    // 1. Ambil informasi tenant/gereja master dari tabel users
    const rawUser = await this.jemaatRepository.query(
      `SELECT id, "namaGereja", "namaAdmin", email FROM users WHERE id = $1`,
      [tenantId]
    );
    const tenantInfo = rawUser[0] || null;

    // 2. Ambil jemaat yang terkait dengan tenant ini
    const daftarJemaat = await this.jemaatRepository.find({
      where: { tenantId },
      relations: { user: true },
      order: { id: 'DESC' },
    });

    return {
      tenant: tenantInfo,
      jemaat: daftarJemaat,
    };
  }

  async findAll(tenantId: number): Promise<Jemaat[]> {
    this.validateTenant(tenantId);
    return this.jemaatRepository.find({
      where: { tenantId },
      relations: { user: true },
      order: { id: 'DESC' },
    });
  }

  async create(dto: any, tenantId: number): Promise<Jemaat> {
    this.validateTenant(tenantId);
    const jenisKelaminValue = dto.jenisKelamin || dto.jenis_kelamin || dto.gender || 'Laki-laki';
    const { email, password, role, jenis_kelamin, jenisKelamin, gender, ...dataJemaat } = dto;

    const jemaatBaru = this.jemaatRepository.create({
      ...dataJemaat,
      jenisKelamin: jenisKelaminValue,
      tenantId,
    } as Partial<Jemaat>);

    const savedJemaat = await this.jemaatRepository.save(jemaatBaru) as Jemaat;

    const finalEmail = email || `jemaat_${Date.now()}_${Math.floor(Math.random() * 100000)}_tenant_${tenantId}@gereja.local`;
    const finalPassword = password || `no_login_access_${Math.random()}_${Date.now()}`;
    const hashedPassword = await bcrypt.hash(finalPassword, 10);

    const newUser = this.userRepository.create({
      email: finalEmail,
      password: hashedPassword,
      role: role || 'jemaat',
      jemaatId: savedJemaat.id,
      tenantId,
    });
    await this.userRepository.save(newUser);

    return savedJemaat;
  }

  async update(id: number, dto: any, tenantId: number): Promise<void> {
    this.validateTenant(tenantId);
    const { email, password, role, jenis_kelamin, jenisKelamin, gender, ...rest } = dto;

    const normalizedData: Record<string, any> = { ...rest };
    if (jenisKelamin || jenis_kelamin || gender) {
      normalizedData.jenisKelamin = jenisKelamin || jenis_kelamin || gender;
    }

    if (Object.keys(normalizedData).length > 0) {
      await this.jemaatRepository.update({ id, tenantId }, normalizedData);
    }

    if (email || password || role) {
      const updateDataUser: any = {};
      
      if (email) updateDataUser.email = email;
      if (role) updateDataUser.role = role;
      if (password) {
        updateDataUser.password = await bcrypt.hash(password, 10);
      }
      
      await this.userRepository.update({ jemaatId: id, tenantId }, updateDataUser);
    }
  }

  async remove(id: number, tenantId: number): Promise<void> {
    this.validateTenant(tenantId);
    await this.userRepository.delete({ jemaatId: id, tenantId });
    await this.jemaatRepository.delete({ id, tenantId });
  }
}