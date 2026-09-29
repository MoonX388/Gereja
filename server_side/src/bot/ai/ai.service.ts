import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { IJemaatRepository } from '../../interfaces/jemaat-repository.interface';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    @Inject('IJemaatRepository')
    private readonly jemaatRepository: IJemaatRepository,
    private readonly configService: ConfigService,
  ) {}

  async generate(prompt: string, nomorHP: string): Promise<string> {
    try {
      // 1. Cek Data Jemaat dari Database/Supabase
      const userGereja = await this.jemaatRepository.findByPhone(nomorHP);

      let infoUser = `User ini belum terdaftar di database Jemaat resmi.`;
      if (userGereja) {
        infoUser = `User terdaftar di database Jemaat. Nama: ${userGereja.nama}, Alamat: ${userGereja.alamat || 'Belum diisi'}.`;
      }

      // 2. Siapkan Instruksi Sistem
      const systemPrompt = `Kamu adalah AI asisten WhatsApp Gereja yang ramah, sopan, dan menjawab singkat.\n\nData Pengirim:\n${infoUser}`;

      // 3. Ambil URL dan Key dari .env (Bisa disesuaikan dengan provider-mu)
      const apiUrl = this.configService.get<string>('AI_API_URL') || 'https://api.provider-kamu.com/v1/chat/completions';
      const apiKey = this.configService.get<string>('AI_API_KEY') || 'KODE_RAHASIA_API';
      const modelName = this.configService.get<string>('AI_MODEL') || 'nama-model-di-hostingmu';

      // 4. Hit API menggunakan Fetch bawaan Node.js
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`, // Hapus baris ini jika hostingmu tidak butuh otorisasi
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          max_tokens: 150,
          temperature: 0.4,
        }),
      });

      if (!response.ok) {
        throw new Error(`API AI Error: ${response.statusText}`);
      }

      // 5. Parse JSON dari response API
      const result = await response.json();
      
      // Mengambil teks jawaban (Struktur ini standar untuk hampir semua provider AI saat ini)
      const jawaban = result.choices[0].message.content.trim();

      return jawaban || 'Ada yang bisa saya bantu?';

    } catch (error) {
      this.logger.error('Gagal menghubungi API AI:', error);
      return 'Mohon maaf, asisten AI saat ini sedang mengalami kendala jaringan. Silakan coba beberapa saat lagi.';
    }
  }
}