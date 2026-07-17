import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notifikasi } from '../entity/notifikasi.entity';
import { data as User } from '../entity/data.entity';
import { BotService } from '../bot/bot.service';

@Injectable()
export class NotifikasiService {
  constructor(
    @InjectRepository(Notifikasi)
    private notifRepo: Repository<Notifikasi>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private botService: BotService,
  ) {}

  // ✅ Ambil semua notifikasi
  async findAll(): Promise<Notifikasi[]> {
    return this.notifRepo.find({ order: { id: 'DESC' } });
  }

  // ✅ Buat notifikasi dan kirim broadcast
  async create(data: Partial<Notifikasi>): Promise<Notifikasi> {
    const item = this.notifRepo.create(data);
    const saved = await this.notifRepo.save(item);

    // Kirim broadcast jika ada pesan dan target
    if (data.pesan && data.target) {
      await this.sendBroadcast(data.target, data.pesan, data.judul);
    }

    return saved;
  }

  // ✅ Update (hanya satu)
  async update(id: number, data: Partial<Notifikasi>): Promise<void> {
    await this.notifRepo.update(id, data);
  }

  // ✅ Delete (hanya satu)
  async remove(id: number): Promise<void> {
    await this.notifRepo.delete(id);
  }

  // ---------- FUNGSI BROADCAST ----------
  private async sendBroadcast(target: string, message: string, title?: string) {
    let users: User[] = [];

    // Gunakan select dengan object { telepon: true } agar TypeORM tidak protes
    if (target === 'Semua Jemaat') {
      users = await this.userRepo.find({ select: { telepon: true } });
    } else if (target === 'Pelayan') {
      users = await this.userRepo.find({
        where: { role: 'pelayan' },
        select: { telepon: true },
      });
    } else if (target === 'Jemaat Aktif') {
      users = await this.userRepo.find({
        where: { status: 'Aktif' },
        select: { telepon: true },
      });
    }

    // Filter nomor HP yang valid
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
      console.log(
        `✅ Broadcast berhasil dikirim ke ${phoneNumbers.length} penerima.`,
      );
    } catch (error) {
      console.error('❌ Gagal mengirim broadcast:', error);
    }
  }
}
