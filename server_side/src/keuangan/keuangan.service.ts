import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { Keuangan } from '../entity/keuangan.entity';
// 👇 Pastikan path ke interface ini sudah benar sesuai struktur foldermu
import type { IKeuanganRepository } from '../interfaces/keuangan-repository.interface';

@Injectable()
export class KeuanganService {
  constructor(
    // 👇 Gunakan @Inject dengan token yang didaftarkan di Module
    @Inject('IKeuanganRepository')
    private readonly keuanganRepo: IKeuanganRepository,
  ) {}

  async findAll(tenantId: string): Promise<Keuangan[]> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    // 👇 Panggil fungsi findAll dari adapter
    return this.keuanganRepo.findAll(tenantId);
  }

  async create(data: Partial<Keuangan>, tenantId: string): Promise<Keuangan> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    // 👇 Panggil fungsi create dari adapter
    return this.keuanganRepo.create(data, tenantId);
  }

  async update(id: string, data: Partial<Keuangan>, tenantId: string): Promise<void> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    // 👇 Panggil fungsi update dari adapter
    await this.keuanganRepo.update(id, data, tenantId);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    // 👇 Panggil fungsi remove dari adapter
    await this.keuanganRepo.remove(id, tenantId);
  }
}