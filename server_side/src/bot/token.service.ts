import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenEntity } from '../entity/token.entity';
import * as crypto from 'crypto';

@Injectable()
export class TokenService implements OnModuleInit {
  private currentToken!: string;

  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepo: Repository<TokenEntity>,
  ) {}

  async onModuleInit() {
    this.currentToken = await this.loadOrGenerateToken();
  }

  private async loadOrGenerateToken(): Promise<string> {
    const activeToken = await this.tokenRepo.findOne({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });

    if (activeToken) {
      // LOG DIHAPUS AGAR TOKEN TIDAK BOCOR DI TERMINAL
      return activeToken.token;
    }

    return this.generateNewToken();
  }

  private async generateNewToken(): Promise<string> {
    const newToken = crypto.randomBytes(16).toString('hex');

    const tokenEntity = this.tokenRepo.create({
      token: newToken,
      isActive: true,
    });
    await this.tokenRepo.save(tokenEntity);

    // LOG DIHAPUS AGAR TOKEN TIDAK BOCOR DI TERMINAL
    return newToken;
  }

  getToken(): string {
    return this.currentToken;
  }

  async validateToken(input: string): Promise<boolean> {
    const token = await this.tokenRepo.findOne({
      where: { token: input, isActive: true },
    });
    return !!token;
  }

  async regenerateToken(): Promise<string> {
    await this.tokenRepo.update({ isActive: true }, { isActive: false });

    const newToken = crypto.randomBytes(16).toString('hex');
    const tokenEntity = this.tokenRepo.create({
      token: newToken,
      isActive: true,
    });
    await this.tokenRepo.save(tokenEntity);

    this.currentToken = newToken;
    // LOG DIHAPUS AGAR TOKEN TIDAK BOCOR DI TERMINAL
    return newToken;
  }
}
