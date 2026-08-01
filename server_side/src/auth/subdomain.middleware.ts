import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class SubdomainValidationMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const host = req.hostname;
    const subdomainMatch = host.match(/^([^.]+)\.gerejapintar\.id$/i);

    if (!subdomainMatch) {
      return next();
    }

    const subdomain = subdomainMatch[1];
    if (!subdomain || subdomain.toLowerCase() === 'www') {
      return next();
    }

    const church = await this.usersService.findChurchBySubdomain(subdomain);

    if (!church) {
      return next(new NotFoundException('Subdomain gereja tidak terdaftar'));
    }

    return next();
  }
}
