import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { BotService } from './bot.service';
import { TokenService } from './token.service';

@Controller('wa')
export class BotController {
  constructor(
    private readonly botService: BotService,
    private readonly tokenService: TokenService,
  ) {}

  @Get('token')
  getToken() {
    const token = this.tokenService.getToken();
    return { token: token };
  }

  // >>> TAMBAHKAN ENDPOINT INI <<<
  @Get('qr')
  getQr() {
    const qr = this.botService.getQrString();
    return { qr: qr || null };
  }

  @Post('request-pairing-code')
  async requestPairingCode(@Body() body: { phoneNumber: string; token: string }) {
    const isValid = await this.tokenService.validateToken(body.token);
    if (!isValid) {
      throw new HttpException('Token tidak valid atau kadaluarsa', HttpStatus.UNAUTHORIZED);
    }

    try {
      const code = await this.botService.requestPairingCode(body.phoneNumber);
      return { code: code };
    } catch (error) {
      throw new HttpException('Gagal memproses kode pairing', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}