import { Injectable } from '@nestjs/common';
import { Notifikasi } from '../entity/notifikasi.entity';
import { User } from '../entity/data.entity';
import { BotService } from '../bot/bot.service';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class NotifikasiService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private botService: BotService,
  ) {}

  async findAll(): Promise<Notifikasi[]> {
    return this.supabaseService.findAll<Notifikasi>('notifikasi', 'id', false);
  }

  async create(data: Partial<Notifikasi>): Promise<Notifikasi> {
    const saved = await this.supabaseService.create<Notifikasi>('notifikasi', data);

    if (data.pesan && data.target) {
      await this.sendBroadcast(data.target, data.pesan, data.judul);
    }

    return saved;
  }

  async update(id: number, data: Partial<Notifikasi>): Promise<void> {
    await this.supabaseService.update<Notifikasi>('notifikasi', id, data);
  }

  async remove(id: number): Promise<void> {
    await this.supabaseService.remove('notifikasi', id);
  }

  private async sendBroadcast(target: string, message: string, title?: string) {
    let users: User[] = [];

    if (target === 'Semua Jemaat') {
      users = await this.supabaseService.findAll<User>('users', 'id', false);
    } else if (target === 'Pelayan') {
      users = await this.supabaseService.findWhere<User>('users', { role: 'pelayan' }, 'id', false);
    } else if (target === 'Jemaat Aktif') {
      users = await this.supabaseService.findWhere<User>('users', { status: 'Aktif' }, 'id', false);
    }

    const phoneNumbers = users
      .map((u) => u.telepon)
      .filter((tel): tel is string => !!tel && tel.length > 0);

    if (phoneNumbers.length === 0) {
      console.log('⚠️ Tidak ada nomor HP yang valid untuk dikirim.');
      return;
    }

    const fullMessage = `📢 *${title || 'Notifikasi'}*\n\n${message}`;

    try {
      await this.botService.sendBroadcast(phoneNumbers, fullMessage);
      console.log(`✅ Broadcast berhasil dikirim ke ${phoneNumbers.length} penerima.`);
    } catch (error) {
      console.error('❌ Gagal mengirim broadcast:', error);
    }
  }
}
