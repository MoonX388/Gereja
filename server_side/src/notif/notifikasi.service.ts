// src/notif/notifikasi.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notifikasi } from '../entity/notifikasi.entity';
import { User } from '../entity/user.entity';
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

  async findAll(): Promise<Notifikasi[]> {
    return this.notifRepo.find({ order: { id: 'DESC' } });
  }

  async create(data: Partial<Notifikasi>): Promise<Notifikasi> {
    const item = this.notifRepo.create(data);
    const saved = await this.notifRepo.save(item);

    if (data.pesan && data.target) {
      await this.sendBroadcast(data.target, data.pesan, data.judul);
    }

    return saved;
  }

  async update(id: number, data: Partial<Notifikasi>): Promise<void> {
    await this.notifRepo.update(id, data);
  }

  async remove(id: number): Promise<void> {
    await this.notifRepo.delete(id);
  }

  // ---------- FUNGSI BROADCAST ----------
  private async sendBroadcast(target: string, message: string, title?: string) {
    let users: User[] = [];

    // 🚀 PERBAIKAN UTAMA: Tambahkan relations: { jemaat: true } 
    // agar kita bisa mengakses nomor telepon dan status dari tabel profil Jemaat.
    
    if (target === 'Semua Jemaat') {
      users = await this.userRepo.find({
        relations: { jemaat: true },
      });
    } else if (target === 'Pelayan') {
      users = await this.userRepo.find({
        where: { role: 'pelayan' },
        relations: { jemaat: true },
      });
    } else if (target === 'Jemaat Aktif') {
      users = await this.userRepo.find({
        // Karena status ada di tabel jemaat, kita filter dari relasinya
        where: { jemaat: { status: 'Aktif' } },
        relations: { jemaat: true },
      });
    }

    // 🚀 PERBAIKAN: Ambil no telepon lewat objek jemaat (u.jemaat?.telepon)
    const phoneNumbers = users
      .map((u) => u.jemaat?.telepon)
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