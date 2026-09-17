import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    // 🚀 PERBAIKAN: Tangkap username dari frontend, atau gunakan email sebagai cadangan
    const identifier = dto.username || dto.email;
    
    if (!identifier) {
      throw new BadRequestException('Username atau Email wajib diisi');
    }

    // Teruskan ke Auth Service
    return this.authService.login(identifier, dto.password, dto.subdomain);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req) {
    const { password, ...user } = req.user;
    
    // Kirim informasi subdomain gereja induk untuk validasi layout frontend
    const churchSubdomain = await this.authService.getChurchSubdomain(user.tenantId);
    
    return {
      ...user,
      churchSubdomain,
    };
  }
}