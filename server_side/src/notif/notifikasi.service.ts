import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { Notifikasi } from '../entity/notifikasi.entity';
import type { INotifikasiRepository } from '../interfaces/notifikasi-repository.interface';
import { BotService } from '../bot/bot.service';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class NotifikasiService {
  constructor(
    @Inject('INotifikasiRepository') private repo: INotifikasiRepository,
    private readonly botService: BotService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async findAll(tenantId: string): Promise<Notifikasi[]> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    return this.repo.findAll(tenantId);
  }

  async create(data: Partial<Notifikasi>, tenantId: string): Promise<Notifikasi> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    return this.repo.create(data, tenantId);
  }

  async send(data: Partial<Notifikasi> & { sendNow?: boolean }, tenantId: string) {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');

    const notification = await this.repo.create(data, tenantId);
    if (data.via?.toLowerCase() !== 'whatsapp' || data.sendNow === false) {
      return { notification, sent: 0 };
    }

    const client = this.supabaseService.getClient();
    let query = client.from('jemaat').select('telepon').eq('tenant_id', tenantId);
    if (data.target && !['Semua Jemaat', 'Jemaat Aktif'].includes(data.target)) {
      if (/^\+?[0-9]{8,15}$/.test(data.target)) {
        await this.botService.sendMessageToContact(data.target, data.pesan ?? '');
        return { notification, sent: 1 };
      }
    }
    if (data.target === 'Jemaat Aktif') query = query.eq('status', 'Aktif');

    const { data: recipients, error } = await query;
    if (error) throw new Error(`Gagal mengambil penerima notifikasi: ${error.message}`);

    const phoneNumbers = (recipients ?? [])
      .map((recipient: any) => recipient.telepon)
      .filter((phone: any): phone is string => Boolean(phone));
    await this.botService.sendBroadcast(phoneNumbers, data.pesan ?? '');
    return { notification, sent: phoneNumbers.length };
  }

  async update(id: string, data: Partial<Notifikasi>, tenantId: string): Promise<void> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    await this.repo.update(id, data, tenantId);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    await this.repo.remove(id, tenantId);
  }
}