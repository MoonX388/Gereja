import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Jemaat } from '../../entity/jemaat.entity';

@Injectable()
export class AiService {
  private generator: any;

  constructor(
    @InjectRepository(Jemaat)
    private readonly jemaatRepository: Repository<Jemaat>,
    private readonly configService: ConfigService, // 👈 inject
  ) {}

  async generate(prompt: string, nomorHP: string): Promise<string> {
    const userGereja = await this.jemaatRepository.findOne({
      where: { telepon: nomorHP },
    });

    let infoUser = `User ini belum terdaftar di database Jemaat resmi.`;
    if (userGereja) {
      infoUser = `User terdaftar di database Jemaat. Nama: ${userGereja.nama}, Alamat: ${userGereja.alamat || 'Belum diisi'}.`;
    }

    const pembatas = '===JAWABAN_AI===';
    const chatPrompt = `Instruksi: Kamu adalah AI asisten WhatsApp Gereja yang ramah, sopan, dan menjawab singkat.\n\nData Pengirim:\n${infoUser}\n\nUser: ${prompt}\n\n${pembatas}\n`;

    const aiApiUrl = this.configService.get<string>('AI_API_URL');
    const aiApiKey = this.configService.get<string>('AI_API_KEY');
    const aiModel = this.configService.get<string>('AI_MODEL') || 'gpt-4o-mini';

    if (!aiApiUrl) {
      return 'AI belum dikonfigurasi. Silakan set AI_API_URL di environment.';
    }

    const response = await fetch(aiApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(aiApiKey ? { Authorization: `Bearer ${aiApiKey}` } : {}),
      },
      body: JSON.stringify({
        model: aiModel,
        prompt: chatPrompt,
        max_tokens: 60,
        temperature: 0.4,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI API error: ${response.status} ${errorText}`);
    }

    const data = (await response.json()) as {
      text?: string;
      content?: string;
      reply?: string;
      output?: string;
      choices?: Array<{
        text?: string;
        message?: { content?: string };
      }>;
    };

    let jawaban =
      data.text ||
      data.content ||
      data.reply ||
      data.output ||
      data.choices?.[0]?.text ||
      data.choices?.[0]?.message?.content ||
      '';

    if (jawaban.includes(pembatas)) {
      jawaban = jawaban.split(pembatas)[1].trim();
    } else {
      jawaban = jawaban.replace(chatPrompt, '').trim();
    }

    return jawaban || 'Ada yang bisa saya bantu?';
  }
}
