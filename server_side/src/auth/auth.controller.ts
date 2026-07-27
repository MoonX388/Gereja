import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
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
    // 🚀 Meneruskan email, password, dan subdomain ke service
    return this.authService.login(dto.email, dto.password, dto.subdomain);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req) {
    const { password, ...user } = req.user;
    
    // Kirim informasi subdomain gereja induk untuk validasi layout frontend
    const churchSubdomain = await this.authService.getChurchSubdomain(user.userId);
    
    return {
      ...user,
      churchSubdomain,
    };
  }
}