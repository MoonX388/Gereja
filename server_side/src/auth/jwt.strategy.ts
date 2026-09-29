// server_side/src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const userId = String(payload.sub);
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException();

    if (!user.tenantId && user.jemaat?.tenantId) {
      user.tenantId = user.jemaat.tenantId;
      await this.usersService.update(user.id, { tenantId: user.tenantId });
    }

    // FIXED: removed `tenantsService.create({ namaGereja: undefined, subdomain: undefined })`
    // auto-provision — see full explanation in auth.service.ts. This is a
    // read path (runs on EVERY authenticated request), so the old bug was
    // actually worse here: it risked creating a new blank tenant on every
    // request until tenantId got set, and then never fixing itself.
    // A tenant-scoped account with no tenantId is now just left as-is;
    // TenantGuard (see tenant.guard.ts) rejects those requests explicitly
    // with a clear message instead of the strategy silently mutating data.

    // Normalize role to lowercase for case-insensitive comparison in guards
    if (user.role) {
      user.role = user.role.toLowerCase();
    }

    return user;
  }
}
