import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Jemaat } from '../entity/jemaat.entity';
import { User } from '../entity/user.entity';
import { IJemaatRepository } from '../interfaces/jemaat-repository.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class JemaatTypeOrmAdapter implements IJemaatRepository {
  constructor(
    @InjectRepository(Jemaat) private jemaatRepo: Repository<Jemaat>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async getDashboardData(tenantId: string) {
    const rawUser = await this.jemaatRepo.query(
      `SELECT id, "namaGereja", "namaAdmin", email FROM users WHERE id = $1`,
      [tenantId],
    );
    const tenantInfo = rawUser[0] || null;
    const daftarJemaat = await this.jemaatRepo.find({
      where: { tenantId },
      relations: { user: true },
      order: { id: 'DESC' },
    });
    return { tenant: tenantInfo, jemaat: daftarJemaat };
  }

  async findAll(tenantId: string): Promise<Jemaat[]> {
    try {
      return this.jemaatRepo.find({
        where: { tenantId },
        relations: { user: true },
        order: { id: 'DESC' },
      });
    } catch (error) {
      console.error('Error in findAll jemaat (TypeORM):', error);
      throw error;
    }
  }

  async findByPhone(nomorHP: string): Promise<Jemaat | null> {
    return this.jemaatRepo.findOne({
      where: { telepon: nomorHP },
      relations: { user: true },
    });
  }

  async create(dto: any, tenantId: string): Promise<Jemaat> {
    const jenisKelaminValue = dto.jenisKelamin || dto.jenis_kelamin || dto.gender || 'Laki-laki';
    const { email, password, role, jenis_kelamin, jenisKelamin, gender, ...dataJemaat } = dto;
    const jemaatBaru = this.jemaatRepo.create({
      ...dataJemaat,
      jenisKelamin: jenisKelaminValue,
      tenantId,
    } as Partial<Jemaat>);
    const savedJemaat = await this.jemaatRepo.save(jemaatBaru) as Jemaat;
    const finalEmail = email || `jemaat_${Date.now()}_${Math.floor(Math.random() * 100000)}_tenant_${tenantId}@gereja.local`;
    const finalPassword = password || `no_login_access_${Math.random()}_${Date.now()}`;
    const hashedPassword = await bcrypt.hash(finalPassword, 10);
    const newUser = this.userRepo.create({
      email: finalEmail,
      password: hashedPassword,
      role: role || 'jemaat',
      jemaatId: savedJemaat.id,
      tenantId,
    });
    await this.userRepo.save(newUser);
    return savedJemaat;
  }

  async update(id: string, dto: any, tenantId: string): Promise<void> {
    const { email, password, role, jenis_kelamin, jenisKelamin, gender, ...rest } = dto;
    const normalizedData: Record<string, any> = { ...rest };
    if (jenisKelamin || jenis_kelamin || gender) {
      normalizedData.jenisKelamin = jenisKelamin || jenis_kelamin || gender;
    }
    if (Object.keys(normalizedData).length > 0) {
      await this.jemaatRepo.update({ id, tenantId }, normalizedData);
    }
    if (email || password || role) {
      const updateDataUser: any = {};
      if (email) updateDataUser.email = email;
      if (role) updateDataUser.role = role;
      if (password) {
        updateDataUser.password = await bcrypt.hash(password, 10);
      }
      await this.userRepo.update({ jemaatId: id, tenantId }, updateDataUser);
    }
  }

  async remove(id: string, tenantId: string): Promise<void> {
    await this.userRepo.delete({ jemaatId: id, tenantId });
    await this.jemaatRepo.delete({ id, tenantId });
  }
}