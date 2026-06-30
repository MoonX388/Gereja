import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // 1. Ambil semua data User
  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ order: { id: 'DESC' } });
  }

  // 2. Tambah User Baru
  async create(userData: Partial<User>): Promise<User> {
    // Beri nilai default jika saat input jemaat biasa tidak mengisi email/password
    if (!userData.email) {
      // Buat email otomatis unik berdasarkan nama & timestamp jika jemaat biasa tidak punya akun
      userData.email = `jemaat_${Date.now()}@gereja.local`;
      userData.password = 'password_default_123'; 
    }
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  // 3. Update User / Ganti Jabatan (Role)
  async update(id: number, userData: Partial<User>): Promise<void> {
  // Jika ada password, hash dulu
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }
  await this.usersRepository.update(id, userData);
  }

  // 4. Hapus User
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  // Fungsi pencarian bawaan auth kamu (jangan dihapus)
  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
}