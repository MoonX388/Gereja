import { Injectable } from '@nestjs/common';
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

  async getDashboardData(subownerId: number) {
    // 1. Mengintip langsung ke tabel 'users' menggunakan Raw Query
    const rawUser = await this.jemaatRepository.query(
      `SELECT id, "namaGereja", "namaAdmin", email FROM users WHERE id = $1`,
      [subownerId]
    );
    const subownerInfo = rawUser[0] || null;

    // 2. Ambil jemaat beserta data akun (user) miliknya
    const daftarJemaat = await this.jemaatRepository.find({
      relations: { user: true }, // 🚀 Menggunakan format object boolean
      order: { id: 'DESC' },
    });

    return {
      subowner: subownerInfo,
      jemaat: daftarJemaat,
    };
  }

  async findAll(subownerId: number): Promise<Jemaat[]> {
    return this.jemaatRepository.find({
      relations: { user: true }, // 🚀 Menggunakan format object boolean
      order: { id: 'DESC' },
    });
  }

  async create(dto: any, subownerId: number): Promise<Jemaat> {
    // Pisahkan data profil Jemaat dengan data kredensial User
    const { email, password, role, ...dataJemaat } = dto;

    // 1. Simpan profil Jemaat terlebih dahulu
    const jemaatBaru = this.jemaatRepository.create({
      ...dataJemaat,
      userId: subownerId,
    } as Partial<Jemaat>); // 🚀 Penegasan tipe sebagai satu objek parsial

    // 🚀 Penegasan tipe hasil save sebagai entitas tunggal Jemaat
    const savedJemaat = await this.jemaatRepository.save(jemaatBaru) as Jemaat;

    // 2. Siapkan data akun login (User)
    const finalEmail = email || `jemaat_${Date.now()}_${Math.floor(Math.random() * 100000)}_sub_${subownerId}@gereja.local`;
    const finalPassword = password || `no_login_access_${Math.random()}_${Date.now()}`;
    const hashedPassword = await bcrypt.hash(finalPassword, 10);

    // 3. Simpan akun User dan kaitkan dengan jemaatId yang baru dibuat
    const newUser = this.userRepository.create({
      email: finalEmail,
      password: hashedPassword,
      role: role || 'jemaat',
      jemaatId: savedJemaat.id, 
    });
    await this.userRepository.save(newUser);

    return savedJemaat;
  }

  async update(id: number, dto: any, subownerId: number): Promise<void> {
    const { email, password, role, ...dataJemaat } = dto;

    // 1. Update tabel Jemaat jika ada data profil yang berubah
    if (Object.keys(dataJemaat).length > 0) {
      await this.jemaatRepository.update({ id }, dataJemaat);
    }

    // 2. Update tabel User jika ada perubahan kredensial
    if (email || password || role) {
      const updateDataUser: any = {};
      
      if (email) updateDataUser.email = email;
      if (role) updateDataUser.role = role;
      if (password) {
        updateDataUser.password = await bcrypt.hash(password, 10);
      }
      
      // Update berdasarkan Foreign Key jemaatId
      await this.userRepository.update({ jemaatId: id }, updateDataUser);
    }
  }

  async remove(id: number, subownerId: number): Promise<void> {
    // 🚀 Hapus dari tabel anak (User) dulu agar tidak terjadi konflik Foreign Key
    await this.userRepository.delete({ jemaatId: id });
    
    // Baru hapus dari tabel induk (Jemaat)
    await this.jemaatRepository.delete({ id });
  }
}