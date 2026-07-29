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
    return this.generateToken(user);
  }

  async login(emailOrUsername: string, password: string, subdomain?: string) {
    let user = await this.usersService.findByEmail(emailOrUsername);

    if (!user) {
      user = await this.usersService.findByUsername(emailOrUsername);
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Email/Username atau password salah');
    }

    // 🛡️ PAGAR MULTI-TENANT ISOLATION
    if (subdomain && subdomain !== '') {
      const church = await this.usersService.findChurchBySubdomain(subdomain);
      
      if (!church) {
        throw new UnauthorizedException('Gereja dengan subdomain ini tidak terdaftar.');
      }

      // 🚀 PERBAIKAN UTAMA: Cek apakah dia Pemilik ATAU Staf Jemaat
      const isOwner = user.id === church.id; // Dia adalah pemilik gereja itu sendiri
      const isStaff = user.jemaatId === church.id; // Dia adalah staf/jemaat di bawah gereja itu

      // Jika role-nya super_admin, izinkan juga (opsional untuk keamanan tambahan)
      if (!isOwner && !isStaff && user.role !== 'super_admin') {
        throw new UnauthorizedException('Akun Anda tidak terdaftar di lingkup gereja subdomain ini.');
      }
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
