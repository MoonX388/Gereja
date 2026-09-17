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

  async findAll(tenantId: number): Promise<Notifikasi[]> {
    return this.notifRepo.find({
      where: { tenantId },
      order: { id: 'DESC' },
    });
  }

  async create(data: Partial<Notifikasi>, tenantId: number): Promise<Notifikasi> {
    const item = this.notifRepo.create({ ...data, tenantId });
    const saved = await this.notifRepo.save(item);

    if (data.pesan && data.target) {
      await this.sendBroadcast(data.target, data.pesan, data.judul, tenantId);
    }

    return saved;
  }

  async update(id: number, data: Partial<Notifikasi>, tenantId: number): Promise<void> {
    await this.notifRepo.update({ id, tenantId }, data);
  }

  async remove(id: number, tenantId: number): Promise<void> {
    await this.notifRepo.delete({ id, tenantId });
  }

  // ---------- FUNGSI BROADCAST ----------
  private async sendBroadcast(target: string, message: string, title?: string, tenantId?: number) {
    let users: User[] = [];

    // 🚀 PERBAIKAN UTAMA: Tambahkan relations: { jemaat: true } 
    // agar kita bisa mengakses nomor telepon dan status dari tabel profil Jemaat.
    
    if (target === 'Semua Jemaat') {
      users = await this.userRepo.find({
        where: { tenantId },
        relations: { jemaat: true },
      });
    } else if (target === 'Pelayan') {
      users = await this.userRepo.find({
        where: { role: 'pelayan', tenantId },
        relations: { jemaat: true },
      });
    } else if (target === 'Jemaat Aktif') {
      users = await this.userRepo.find({
        where: { tenantId, jemaat: { status: 'Aktif' } },
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