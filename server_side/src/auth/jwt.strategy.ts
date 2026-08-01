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
    const userId = Number(payload.sub);
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException();

    if (!user.tenantId && user.jemaat?.tenantId) {
      user.tenantId = user.jemaat.tenantId;
      await this.usersService.update(user.id, { tenantId: user.tenantId });
    }

    if (!user.tenantId && user.role === 'admin') {
      user.tenantId = user.id;
      await this.usersService.update(user.id, { tenantId: user.id });
    }

    return user;
  }
}
