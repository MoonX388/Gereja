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

  /**
   * Load token aktif dari database, atau generate baru
   */
  private async loadOrGenerateToken(): Promise<string> {
    // Cari token yang masih aktif
    const activeToken = await this.tokenRepo.findOne({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });

    if (activeToken) {
      console.log(`🔑 Token QR (dari DB): ${activeToken.token}`);
      return activeToken.token;
    }

    // Generate token baru
    return this.generateNewToken();
  }

  /**
   * Generate token random 32 karakter dan simpan ke database
   */
  private async generateNewToken(): Promise<string> {
    const newToken = crypto.randomBytes(16).toString('hex'); // 32 karakter
    
    // Simpan ke database
    const tokenEntity = this.tokenRepo.create({
      token: newToken,
      isActive: true,
    });
    await this.tokenRepo.save(tokenEntity);

    console.log('═══════════════════════════════════');
    console.log(`🔑 TOKEN BARU: ${newToken}`);
    console.log('⚠  Simpan token ini! Digunakan untuk akses halaman QR.');
    console.log('═══════════════════════════════════');

    return newToken;
  }

  /**
   * Ambil token saat ini
   */
  getToken(): string {
    return this.currentToken;
  }

  /**
   * Validasi token
   */
  async validateToken(input: string): Promise<boolean> {
    // Cek di database
    const token = await this.tokenRepo.findOne({
      where: { token: input, isActive: true },
    });
    return !!token;
  }

  /**
   * Regenerate token baru (nonaktifkan yang lama, buat baru)
   */
  async regenerateToken(): Promise<string> {
    // Nonaktifkan semua token lama
    await this.tokenRepo.update({ isActive: true }, { isActive: false });

    // Generate baru
    const newToken = crypto.randomBytes(16).toString('hex');
    const tokenEntity = this.tokenRepo.create({
      token: newToken,
      isActive: true,
    });
    await this.tokenRepo.save(tokenEntity);

    this.currentToken = newToken;

    console.log('═══════════════════════════════════');
    console.log(`🔑 TOKEN BARU (regenerated): ${newToken}`);
    console.log('⚠  Token lama sudah tidak berlaku.');
    console.log('═══════════════════════════════════');

    return newToken;
  }
}