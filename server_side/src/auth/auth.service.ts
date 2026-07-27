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

      // 🚀 PERBAIKAN: Gunakan jemaatId, bukan userId
      if (user.jemaatId !== church.id) {
        throw new UnauthorizedException('Akun Anda tidak terdaftar di lingkup gereja subdomain ini.');
      }
    }

    // 🚀 PERBAIKAN: Gunakan jemaatId
    const currentChurch = user.jemaatId ? await this.usersService.findChurchById(user.jemaatId) : null;
    return this.generateToken(user, currentChurch?.subdomain || '');
  }

  async getChurchSubdomain(userId: number): Promise<string> {
    if (!userId) return '';
    const church = await this.usersService.findChurchById(userId);
    return church?.subdomain || '';
  }

  private generateToken(user: any, churchSubdomain: string = '') {
    // 🚀 PERBAIKAN: Ganti userId menjadi jemaatId untuk payload
    const payload = { sub: user.id, email: user.email, role: user.role, userId: user.jemaatId };
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