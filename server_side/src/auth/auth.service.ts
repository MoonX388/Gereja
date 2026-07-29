// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new UnauthorizedException('Email sudah terdaftar');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });

    // 🚀 PERBAIKAN: Tentukan referenceChurchId dan panggil generateToken dengan 3 parameter
    const referenceChurchId = user.jemaatId ? user.jemaatId : user.id;
    const churchSubdomain = user.subdomain || ''; // Ambil subdomain jika ada di DTO saat register

    return this.generateToken(user, churchSubdomain, referenceChurchId);
  }

  async login(emailOrUsername: string, password: string, subdomain?: string) {
    console.log('=================================');
    console.log('🔍 INFO LOGIN MASUK:');
    console.log('Email/User:', emailOrUsername);
    console.log('Subdomain yg dikirim:', subdomain);
    console.log('=================================');

    let user = await this.usersService.findByEmail(emailOrUsername);
    console.log('1. Cek DB by Email:', user ? '✅ KETEMU (ID: ' + user.id + ')' : '❌ TIDAK KETEMU');

    if (!user) {
      user = await this.usersService.findByUsername(emailOrUsername);
      console.log('2. Cek DB by Username:', user ? '✅ KETEMU' : '❌ TIDAK KETEMU');
    }

    if (!user) {
      console.log('🚨 ERROR: Akun benar-benar tidak ada di database!');
      throw new UnauthorizedException('Email/Username atau password salah');
    }

    // Cek Password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log('3. Cek Password bcrypt:', isPasswordMatch ? '✅ COCOK' : '❌ SALAH PASSWORD');

    if (!isPasswordMatch) {
      console.log('🚨 ERROR: Password salah saat di-compare bcrypt!');
      throw new UnauthorizedException('Email/Username atau password salah');
    }

    // Pagar Subdomain
    if (subdomain && subdomain !== '') {
      const church = await this.usersService.findChurchBySubdomain(subdomain);
      console.log('4. Cari Gereja by Subdomain:', church ? '✅ KETEMU (ID: ' + church.id + ')' : '❌ TIDAK KETEMU');
      
      if (!church) {
        console.log('🚨 ERROR: Subdomain tidak ada di database');
        throw new UnauthorizedException('Gereja dengan subdomain ini tidak terdaftar.');
      }

      const isOwner = user.id === church.id;
      const isStaff = user.jemaatId === church.id;
      
      console.log('5. Apakah dia Owner/Super Admin?', isOwner);
      console.log('6. Apakah dia Staff?', isStaff);

      if (!isOwner && !isStaff && user.role !== 'super_admin') {
        console.log('🚨 ERROR: Dia bukan owner dan bukan staff di gereja ini!');
        throw new UnauthorizedException('Akun Anda tidak terdaftar di lingkup gereja subdomain ini.');
      }
    }

    console.log('🎉 STATUS: LOGIN BERHASIL DIIZINKAN!');
    
    const referenceChurchId = user.jemaatId ? user.jemaatId : user.id;
    const currentChurch = await this.usersService.findChurchById(referenceChurchId);
    
    return this.generateToken(user, currentChurch?.subdomain || '', referenceChurchId);
  }

    // 🚀 PERBAIKAN REFERENSI ID: 
    // Jika dia Staf, ambil gereja dari `jemaatId`. Jika dia Owner, ambil dari `id` dia sendiri.
    const referenceChurchId = user.jemaatId ? user.jemaatId : user.id;
    const currentChurch = await this.usersService.findChurchById(referenceChurchId);
    
    return this.generateToken(user, currentChurch?.subdomain || '', referenceChurchId);
  }
  async getChurchSubdomain(userId: number): Promise<string> {
    if (!userId) return '';
    const church = await this.usersService.findChurchById(userId);
    return church?.subdomain || '';
  }

  private generateToken(user: any, churchSubdomain: string = '', referenceChurchId: number) {
    // 🚀 PERBAIKAN PAYLOAD: userId di token sekarang menggunakan ID Gereja yang tepat
    const payload = { sub: user.id, email: user.email, role: user.role, userId: referenceChurchId };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role, 
        username: user.username, 
        churchSubdomain,
      },
    };
  }
}
