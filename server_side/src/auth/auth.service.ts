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
    if (!user.tenantId && user.jemaat?.tenantId) {
      user.tenantId = user.jemaat.tenantId;
      await this.usersService.update(user.id, { tenantId: user.tenantId });
    }

    if (!user.tenantId && user.role === 'admin') {
      user.tenantId = user.id;
      await this.usersService.update(user.id, { tenantId: user.id });
    }

    if (subdomain && subdomain !== '') {
      const church = await this.usersService.findChurchBySubdomain(subdomain);
      
      if (!church) {
        throw new UnauthorizedException('Gereja dengan subdomain ini tidak terdaftar.');
      }

      if (!user.tenantId) {
        if (user.id === church.id) {
          user.tenantId = church.id;
          await this.usersService.update(user.id, { tenantId: church.id });
        } else {
          throw new UnauthorizedException('Akun Anda tidak terdaftar di lingkup gereja subdomain ini.');
        }
      } else if (user.tenantId !== church.id) {
        throw new UnauthorizedException('Akun Anda tidak terdaftar di lingkup gereja subdomain ini.');
      }
    }

    const currentChurch = user.tenantId ? await this.usersService.findChurchById(user.tenantId) : null;
    return this.generateToken(user, currentChurch?.subdomain || '');
  }

  async getChurchSubdomain(tenantId: number): Promise<string> {
    if (!tenantId) return '';
    const church = await this.usersService.findChurchById(tenantId);
    return church?.subdomain || '';
  }

  private generateToken(user: any, churchSubdomain: string = '') {
    const payload = { sub: user.id, email: user.email, role: user.role, tenantId: user.tenantId };
    
    return {
      token: this.jwtService.sign(payload), 
      user: {
        id: user.id,
        email: user.email,
        role: user.role, 
        username: user.username, 
        tenantId: user.tenantId,
        churchSubdomain,
      },
    };
  }
}