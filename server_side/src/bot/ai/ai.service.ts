import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entity/user.entity';

@Injectable()
export class AiService {
  private generator: any;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService, // 👈 inject
  ) {}

  async generate(prompt: string, nomorHP: string): Promise<string> {
    if (!this.generator) {
      console.log('⏳ Memuat Model AI...');
      const { pipeline } = await import('@xenova/transformers');
      const modelName = this.configService.get<string>('AI_MODEL') || 'Xenova/Qwen1.5-0.5B-Chat';
      const quantized = this.configService.get<boolean>('AI_QUANTIZED') ?? true;
      this.generator = await pipeline('text-generation', modelName, { quantized });
      console.log('✅ Model AI siap');
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