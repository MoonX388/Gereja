import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Jalankan validasi JWT dulu
    const isValid = (await super.canActivate(context)) as boolean;
    if (!isValid) return false;

    // 2. Kalau valid, ambil user dari request
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 3. Cek role
    return user?.role === 'admin';
  }
}