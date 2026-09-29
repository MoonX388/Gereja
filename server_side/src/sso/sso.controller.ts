import { Controller, Get, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { SsoService } from './sso.service';

@Controller('auth/v1/secure')
export class SsoController {
  constructor(
    private readonly ssoService: SsoService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Endpoint tujuan dari link SSO landing-page:
   * /auth/v1/secure/sso-verification?session_id=&auth_token=&expires=&sign=&next=
   *
   * Setelah verifikasi sukses, redirect ke frontend gpanel membawa token
   * lokal lewat query param sekali-pakai. Frontend WAJIB langsung simpan
   * token itu (mis. ke memory/localStorage) lalu bersihkan dari URL —
   * jangan biarkan token nampang di address bar setelah initial load.
   */
  @Get('sso-verification')
  async verify(
    @Query('session_id') sessionId: string,
    @Query('auth_token') authToken: string,
    @Query('expires') expires: string,
    @Query('sign') sign: string,
    @Query('next') next: string = '/dashboard',
    @Res() res: Response,
  ) {
    try {
      console.log('[SSO] Verification request received:', { sessionId, expires, next });
      
      const result = await this.ssoService.verifyAndIssueLocalToken({
        sessionId,
        authToken,
        expires: Number(expires),
        sign,
        next,
      });

      console.log('[SSO] Verification successful, redirecting to frontend');

      // Use hardcoded client URL for development
      const clientUrl = this.configService.get<string>('GPANEL_CLIENT_URL') || 'http://localhost:3002';
      const redirectUrl = new URL(result.next, clientUrl);
      redirectUrl.searchParams.set('sso_token', result.localToken);

      return res.redirect(302, redirectUrl.toString());
    } catch (err: any) {
      console.error('[SSO] Verification failed:', err.message);
      console.error('[SSO] Error details:', err);
      
      const clientUrl = this.configService.get<string>('GPANEL_CLIENT_URL') || 'http://localhost:3002';
      const errorUrl = new URL('/login', clientUrl);
      errorUrl.searchParams.set('sso_error', encodeURIComponent(err.message || 'SSO gagal.'));
      return res.redirect(302, errorUrl.toString());
    }
  }
}
