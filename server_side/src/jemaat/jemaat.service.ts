// C:\Users\User\Desktop\peter\Gereja-main\server_side\src\jemaat\jemaat.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { data as Jemaat } from '../entity/data.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class JemaatService {
  constructor(
    @InjectRepository(Jemaat)
    private readonly jemaatRepository: Repository<Jemaat>,
  ) {}

  async getDashboardData(subownerId: number) {
    // 1. 🚀 TRIK UTAMA: Mengintip langsung ke tabel 'users' menggunakan Raw Query
    // Karena PostgreSQL case-sensitive, nama kolom menggunakan tanda petik dua ""
    const rawUser = await this.jemaatRepository.query(
      `SELECT id, "namaGereja", "namaAdmin", email FROM users WHERE id = $1`,
      [subownerId]
    );
    
    // Ambil baris pertama dari hasil query database
    const subownerInfo = rawUser[0] || null;

    // 2. Ambil semua jemaat dari tabel 'data' yang diisi oleh subownerId ini
    const daftarJemaat = await this.jemaatRepository.find({
      where: { 
        userId: subownerId,
        role: 'jemaat',
      },
      order: { id: 'DESC' },
    });

    // 3. Gabungkan hasilnya untuk dilempar ke Frontend
    return {
      subowner: subownerInfo,
      jemaat: daftarJemaat,
    };
  }

  // --- Fungsi Kelola Jemaat ---
  async findAll(subownerId: number): Promise<Jemaat[]> {
    return this.jemaatRepository.find({
      where: { userId: subownerId, role: 'jemaat' },
      order: { id: 'DESC' },
    });
  }

  async create(data: Partial<Jemaat>, subownerId: number): Promise<Jemaat> {
    data.userId = subownerId;
    data.role = 'jemaat';

    if (!data.email) {
  // 🚀 Kunci Perbaikan: Tambahkan kode acak Math.random() agar email dummy benar-benar 100% selalu unik!
  data.email = `jemaat_${Date.now()}_${Math.floor(Math.random() * 100000)}_sub_${subownerId}@gereja.local`;
}
    if (!data.password) {
      data.password = `no_login_access_${Math.random()}_${Date.now()}`;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    const jemaat = this.jemaatRepository.create(data);
    return this.jemaatRepository.save(jemaat);
  }

  async update(id: number, data: Partial<Jemaat>, subownerId: number): Promise<void> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    await this.jemaatRepository.update({ id, userId: subownerId, role: 'jemaat' }, data);
  }

  async remove(id: number, subownerId: number): Promise<void> {
    await this.jemaatRepository.delete({ id, userId: subownerId, role: 'jemaat' });
  }
}