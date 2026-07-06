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

  async login(emailOrUsername: string, password: string) {
    const normalizedIdentifier = emailOrUsername.toLowerCase().trim();
    if (normalizedIdentifier === 'user demo' || normalizedIdentifier === 'demo' || normalizedIdentifier === 'demo@gereja.local') {
      throw new UnauthorizedException('Mode demo hanya tersedia pada aplikasi klien');
    }

    // Cari berdasarkan email dulu, kalau gak ketemu cari berdasarkan username
    let user = await this.usersService.findByEmail(emailOrUsername);

    if (!user) {
      user = await this.usersService.findByUsername(emailOrUsername);
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Email/Username atau password salah');
    }
    return this.generateToken(user);
  }
  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role, // ← tambahkan ini
        username: user.username, // ← tambahkan ini
      },
    };
  }
}
