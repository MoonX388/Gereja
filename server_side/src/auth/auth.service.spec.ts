import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Pick<UsersService, 'findByEmail' | 'findByUsername' | 'create'>;
  let jwtService: Pick<JwtService, 'sign'>;

  beforeEach(() => {
    jest.clearAllMocks();

    usersService = {
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      create: jest.fn(),
    } as unknown as Pick<UsersService, 'findByEmail' | 'findByUsername' | 'create'>;

    jwtService = {
      sign: jest.fn().mockReturnValue('jwt-token'),
    } as Pick<JwtService, 'sign'>;

    service = new AuthService(usersService as UsersService, jwtService as JwtService);
  });

  it('menolak kredensial demo dari backend', async () => {
    await expect(service.login('user demo', 'admin123')).rejects.toThrow(UnauthorizedException);
    expect(usersService.findByEmail).not.toHaveBeenCalled();
  });

  it('melanjutkan login normal untuk kredensial lain', async () => {
    (usersService.findByEmail as jest.Mock).mockResolvedValue({
      id: 1,
      nama: 'Admin',
      email: 'admin@example.com',
      username: 'admin',
      role: 'admin',
      password: 'hashed-password',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await service.login('admin@example.com', 'secret123');

    expect(result.access_token).toBe('jwt-token');
    expect(result.user.email).toBe('admin@example.com');
    expect(jwtService.sign).toHaveBeenCalled();
  });
});
