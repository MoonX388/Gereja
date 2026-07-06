import { Injectable, OnModuleInit } from '@nestjs/common';
import { TokenEntity } from '../entity/token.entity';
import * as crypto from 'crypto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class TokenService implements OnModuleInit {
  private currentToken!: string;

  constructor(private readonly supabaseService: SupabaseService) {}

  async onModuleInit() {
    this.currentToken = await this.loadOrGenerateToken();
  }

  private async loadOrGenerateToken(): Promise<string> {
    const activeTokens = await this.supabaseService.findWhere<TokenEntity>('tokens', { isActive: true }, 'createdAt', false);
    const activeToken = activeTokens[0] ?? null;

    if (activeToken) {
      // LOG DIHAPUS AGAR TOKEN TIDAK BOCOR DI TERMINAL
      return activeToken.token;
    }

    return this.generateNewToken();
  }

  private async generateNewToken(): Promise<string> {
    const newToken = crypto.randomBytes(16).toString('hex');

    await this.supabaseService.create<TokenEntity>('tokens', {
      token: newToken,
      isActive: true,
    });

    // LOG DIHAPUS AGAR TOKEN TIDAK BOCOR DI TERMINAL
    return newToken;
  }

  getToken(): string {
    return this.currentToken;
  }

  async validateToken(input: string): Promise<boolean> {
    const token = await this.supabaseService.findOneByField<TokenEntity>('tokens', 'token', input);
    return !!token;
  }

  async regenerateToken(): Promise<string> {
    const activeTokens = await this.supabaseService.findWhere<TokenEntity>('tokens', { isActive: true }, 'createdAt', false);
    for (const token of activeTokens) {
      await this.supabaseService.update<TokenEntity>('tokens', token.id, { isActive: false });
    }

    const newToken = crypto.randomBytes(16).toString('hex');
    await this.supabaseService.create<TokenEntity>('tokens', {
      token: newToken,
      isActive: true,
    });

    this.currentToken = newToken;
    // LOG DIHAPUS AGAR TOKEN TIDAK BOCOR DI TERMINAL
    return newToken;
  }
}
