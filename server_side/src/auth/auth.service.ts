import { ForbiddenException, Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { TenantsService } from '../tenants/tenants.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tenantsService: TenantsService,
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

    if (!user) {
      const masterUser = await this.usersService.findMasterUserByEmailOrUsername(emailOrUsername);
      if (masterUser) {
        user = {
          id: masterUser.id,
          email: masterUser.email,
          username: masterUser.username || null,
          password: masterUser.password,
          role: masterUser.role,
          tenantId: masterUser.tenantId || null,
        } as any;
      }
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Email/Username atau password salah');
    }

    // 🛡️ PAGAR MULTI-TENANT ISOLATION
    if (!user.tenantId && user.jemaat?.tenantId) {
      user.tenantId = user.jemaat.tenantId;
      await this.usersService.update(user.id, { tenantId: user.tenantId });
    }

    // FIXED: removed the auto-create-blank-tenant hack that used to run here
    // (`tenantsService.create({ namaGereja: (user as any).namaGereja ?? null, ... })`).
    // `user` never actually carries namaGereja/subdomain (those live on
    // `tenants` only), so that call ALWAYS created a tenant with both
    // fields null — spawning junk tenants, and permanently locking the
    // account to that blank tenant (since this block only runs once, while
    // tenantId is still empty). A tenant-admin account without a tenant_id
    // is a data problem to fix explicitly (via TenantsService / the
    // platform-owner "create church" flow), not something to paper over
    // silently at login time.
    if (!user.tenantId && this.isTenantScopedRole(user.role)) {
      throw new ForbiddenException(
        'Akun ini belum terhubung ke gereja manapun. Hubungi admin platform untuk aktivasi.',
      );
    }

    // 🛡️ Cross-subdomain check — only meaningful for tenant-scoped roles.
    // owner/admin (platform staff) are exempt: they aren't bound to one church.
    if (subdomain && subdomain !== '' && this.isTenantScopedRole(user.role)) {
      const church = await this.usersService.findChurchBySubdomain(subdomain);

      if (!church) {
        throw new UnauthorizedException('Gereja dengan subdomain ini tidak terdaftar.');
      }

      if (user.tenantId !== church.id) {
        throw new UnauthorizedException('Akun Anda tidak terdaftar di lingkup gereja subdomain ini.');
      }
    }

    const currentChurch = user.tenantId ? await this.usersService.findChurchById(user.tenantId) : null;
    return this.generateToken(user, currentChurch?.subdomain || '');
  }

  /**
   * Role hierarchy (see ROLE_MIGRATION.md for the full rename):
   * - 'owner'        — platform owner, full access, not tied to a church
   * - 'admin'        — platform staff/moderator, not tied to a church
   * - 'admin_tenant' — church admin, tied to exactly one church (tenantId required)
   * - 'user'         — jemaat/pelayan/staff, tied to one church (tenantId required)
   */
  private isTenantScopedRole(role: string): boolean {
    return role === 'admin_tenant' || role === 'user';
  }

  async getChurchSubdomain(tenantId: string): Promise<string> {
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

  async ssoLogin(body: any) {
    const { session_id, sso_token, expires, sign } = body;

    if (!session_id || !sso_token || !expires || !sign) {
      throw new BadRequestException('Parameter SSO tidak lengkap');
    }

    // Validate signature (simplified - in production use HMAC with SSO_SECRET)
    const expectedSign = Buffer.from(`${session_id}:${sso_token}:${expires}`).toString('base64').substring(0, 32);
    if (sign !== expectedSign) {
      throw new BadRequestException('Signature tidak valid');
    }

    // Decode SSO token from landing page backend
    try {
      const decoded = this.jwtService.verify(sso_token);
      
      // Check if token is expired
      if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
        throw new BadRequestException('SSO token sudah kadaluarsa');
      }

      // Check if this is an SSO token
      if (decoded.type !== 'sso') {
        throw new BadRequestException('Token bukan SSO token');
      }

      // Find or create user in GPanel database
      let user = await this.usersService.findByEmail(decoded.email);
      
      if (!user) {
        // Create new user from SSO token data
        const hashedPassword = await bcrypt.hash(Math.random().toString(36), 10);
        // Normalize role to lowercase
        const normalizedRole = (decoded.role || 'user').toLowerCase();
        user = await this.usersService.create({
          email: decoded.email,
          username: decoded.email.split('@')[0],
          password: hashedPassword,
          role: normalizedRole,
          tenantId: decoded.tenantId,
          permissions: ['akses_gpanel'], // Give default permission for SSO users
        });
      } else {
        // Update existing user if role doesn't match
        const normalizedRole = (decoded.role || 'user').toLowerCase();
        if (user.role !== normalizedRole) {
          await this.usersService.update(user.id, { role: normalizedRole });
        }
        // Ensure permissions array exists
        if (!user.permissions || (Array.isArray(user.permissions) && user.permissions.length === 0)) {
          await this.usersService.update(user.id, { permissions: ['akses_gpanel'] });
        }
      }

      // Generate GPanel token
      const currentChurch = user.tenantId ? await this.usersService.findChurchById(user.tenantId) : null;
      return this.generateToken(user, currentChurch?.subdomain || '');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new BadRequestException('SSO token tidak valid: ' + errorMessage);
    }
  }
}
