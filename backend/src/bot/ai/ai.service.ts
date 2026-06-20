import { Injectable } from '@nestjs/common'; // Hapus OnModuleInit
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entity/user.entity';

@Injectable()
export class AiService { // Tidak perlu implements OnModuleInit lagi
  private generator: any;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Kita hapus fungsi onModuleInit() lama, dan pindahkan logikanya ke bawah 👇

  async generate(prompt: string, nomorHP: string): Promise<string> {
    // 🌟 TRIK LAZY LOADING: Model baru di-load jika belum siap di memori
    if (!this.generator) {
      console.log('⏳ RAM Aman! Memuat Model AI untuk pertama kalinya...');
      const { pipeline } = await import('@xenova/transformers');
      this.generator = await pipeline(
        'text-generation',
        'Xenova/Qwen1.5-0.5B-Chat',
        { quantized: true }
      );
      console.log('✅ Model AI Lokal Berhasil Masuk Memori!');
    }

    // --- Sisa kode pencarian database di bawah ini tetap sama seperti kemarin ---
    const userGereja = await this.userRepository.findOne({
      where: { telepon: nomorHP },
    });

    let infoUser = `User ini belum terdaftar di database Jemaat resmi.`;
    if (userGereja) {
      infoUser = `User terdaftar di database Jemaat. Nama: ${userGereja.nama}, Role: ${userGereja.role}, Alamat: ${userGereja.alamat || 'Belum diisi'}.`;
    }

    const pembatas = '===JAWABAN_AI===';
    const chatPrompt = `Instruksi: Kamu adalah AI asisten WhatsApp Gereja yang ramah, sopan, dan menjawab singkat.\n\nData Pengirim:\n${infoUser}\n\nUser: ${prompt}\n\n${pembatas}\n`;

    const result = await this.generator(chatPrompt, {
      max_new_tokens: 40, 
      temperature: 0.4,
      do_sample: true,
      repetition_penalty: 1.2,
    });

    let jawaban = result[0].generated_text;
    if (jawaban.includes(pembatas)) {
      jawaban = jawaban.split(pembatas)[1].trim();
    } else {
      jawaban = jawaban.replace(chatPrompt, '').trim();
    }

    return jawaban || 'Ada yang bisa saya bantu?';
  }
}