import {
  Controller,
  Get,
  Query,
  UnauthorizedException,
  Post,
  Body,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { BotService } from './bot.service';
import { TokenService } from './token.service';

@Controller('wa')
export class BotController {
  constructor(
    private readonly botService: BotService,
    private readonly tokenService: TokenService,
  ) {}

  @Get('login-url')
  getLoginUrl(): { loginUrl: string } {
    const token = this.tokenService.getToken();
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    return { loginUrl: `${frontendUrl}/bot-login?token=${token}` };
  }

  @Get('login')
  redirectToLogin(@Res() res: Response) {
    const token = this.tokenService.getToken();
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    res.redirect(`${frontendUrl}/bot-login?token=${token}`);
  }

  @Get('qr-string')
  async getQrString(@Query('token') token: string): Promise<{ qr: string | null }> {
    if (!token || !(await this.tokenService.validateToken(token))) {
      throw new UnauthorizedException('Token tidak valid');
    }
    return { qr: this.botService.getQrString() };
  }

  @Post('request-pairing-code')
  async requestPairingCode(
    @Body('phoneNumber') phoneNumber: string,
    @Body('token') token: string,
  ) {
    if (!token || !(await this.tokenService.validateToken(token))) {
      throw new UnauthorizedException('Token tidak valid');
    }
    if (!phoneNumber || !/^62\d{8,14}$/.test(phoneNumber)) {
      throw new UnauthorizedException('Nomor tidak valid (format 62xxx)');
    }
    const code = await this.botService.requestPairingCode(phoneNumber);
    return { code };
  }

  @Post('regenerate-token')
  async regenerateToken(@Body('token') token: string): Promise<{ newToken: string }> {
    if (!token || !(await this.tokenService.validateToken(token))) {
      throw new UnauthorizedException('Token lama tidak valid');
    }
    const newToken = await this.tokenService.regenerateToken();
    return { newToken };
  }
}