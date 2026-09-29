import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';
import { verifySsoSignature } from './sso.util';

interface SsoVerifyInput {
  sessionId: string;
  authToken: string;
  expires: number;
  sign: string;
  next: string;
}

@Injectable()
export class SsoService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly supabaseService: SupabaseService,
  ) {}

  /**
   * Verifies an incoming SSO link from landing-page and, if valid, issues a
   * gpanel-local JWT (signed with gpanel's OWN JWT_SECRET, not the shared
   * SSO secret) so the rest of gpanel's auth machinery works unchanged.
   */
  async verifyAndIssueLocalToken(input: SsoVerifyInput): Promise<{ localToken: string; next: string }> {
    const ssoSecret = this.configService.get<string>('SSO_SHARED_SECRET');
    if (!ssoSecret) throw new Error('SSO_SHARED_SECRET tidak diset.');

    const now = Math.floor(Date.now() / 1000);
    if (input.expires < now) {
      throw new UnauthorizedException('Link SSO sudah kadaluwarsa.');
    }

    const validSignature = verifySsoSignature(
      input.sessionId,
      input.authToken,
      input.expires,
      input.next,
      input.sign,
      ssoSecret,
    );
    if (!validSignature) {
      throw new UnauthorizedException('Tanda tangan SSO tidak valid — link mungkin telah dimodifikasi.');
    }

    // Replay protection — session_id hanya boleh dipakai sekali
    const supabase = this.supabaseService.getClient();
    const { data: existing } = await supabase
      .from('sso_sessions')
      .select('session_id')
      .eq('session_id', input.sessionId)
      .maybeSingle();

    if (existing) {
      throw new UnauthorizedException('Link SSO ini sudah pernah dipakai.');
    }

    let payload: { sub: string; email: string; role: string; tenantId: string | null };
    try {
      payload = this.jwtService.verify(input.authToken, { secret: ssoSecret });
    } catch {
      throw new UnauthorizedException('Token SSO tidak valid atau telah dimanipulasi.');
    }

    // Auto-create or update user in GPanel database if not exists
    await this.ensureUserExists(payload);

    await supabase.from('sso_sessions').insert({
      session_id: input.sessionId,
      user_id: payload.sub,
      target: 'gpanel',
      expires_at: new Date(input.expires * 1000).toISOString(),
    });

    // Issue gpanel's own local session token — same shape as normal login.
    const localToken = this.jwtService.sign(
      { sub: payload.sub, email: payload.email, role: payload.role, tenantId: payload.tenantId },
      { secret: this.configService.get<string>('JWT_SECRET') },
    );

    return { localToken, next: input.next };
  }

  /**
   * Ensures user exists in GPanel database. Auto-creates if not found.
   * This is important for platform roles (owner, admin) that may not exist
   * in tenant-specific GPanel database.
   */
  private async ensureUserExists(payload: { sub: string; email: string; role: string; tenantId: string | null }) {
    const supabase = this.supabaseService.getClient();
    
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', payload.sub)
      .maybeSingle();

    if (existingUser) {
      // Update role and tenantId if changed
      await supabase
        .from('users')
        .update({
          role: payload.role,
          tenant_id: payload.tenantId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', payload.sub);
    } else {
      // Create new user
      await supabase
        .from('users')
        .insert({
          id: payload.sub,
          email: payload.email,
          role: payload.role,
          tenant_id: payload.tenantId,
          username: payload.email.split('@')[0], // Default username from email
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
    }
  }
}
