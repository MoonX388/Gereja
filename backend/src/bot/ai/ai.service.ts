import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // Sesuai ORM kamu
import { Repository } from 'typeorm';
import { DataGereja } from './entities/data-gereja.entity'; // Contoh entity kamu

@Injectable()
export class AiService implements OnModuleInit {
  private generator: any;

  constructor(
    @InjectRepository(DataGereja)
    private readonly dataGerejaRepository: Repository<DataGereja>, // Inject DB
  ) {}

  async onModuleInit() {
    const { pipeline } = await import('@xenova/transformers');
    this.generator = await pipeline(
      'text-generation',
      'Xenova/Qwen1.5-0.5B-Chat',
      { quantized: true }
    );
    console.log('✅ Model AI Lokal + Database Siap!');
  }

  async generate(prompt: string, nomorHP: string): Promise<string> {
    if (!this.generator) throw new Error('Model AI belum siap');

    // 1. AMBIL DATA DARI DATABASE (Contoh: Mengambil jadwal kegiatan terdekat)
    const jadwalKegiatan = await this.dataGerejaRepository.find({
      take: 3,
      order: { tanggal: 'ASC' }
    });

    // 2. Ubah data DB menjadi teks string agar bisa dibaca AI
    const teksDataDB = jadwalKegiatan.map(
      (data) => `- ${data.namaKegiatan}: Jam ${data.jam}, Tanggal ${data.tanggal}`
    ).join('\n');

    const pembatas = '===JAWABAN_AI===';

    // 3. Masukkan data dari DB tersebut ke dalam Instruksi AI (Context Injection)
    const chatPrompt = `Instruksi: Kamu adalah AI asisten WhatsApp Gereja yang ramah dan sopan. Kamu tahu nomor WhatsApp user adalah ${nomorHP}.
    
Gunakan DATA INTERNAL dari database di bawah ini untuk menjawab pertanyaan jika relevan:
${teksDataDB}

User: ${prompt}

${pembatas}\n`;

    const result = await this.generator(chatPrompt, {
      max_new_tokens: 60, 
      temperature: 0.4, // Diturunkan agar AI lebih patuh pada data DB dan tidak mengarang
      do_sample: true,
      repetition_penalty: 1.2,
    });

    let jawaban = result[0].generated_text;

    if (jawaban.includes(pembatas)) {
      jawaban = jawaban.split(pembatas)[1].trim();
    } else {
      jawaban = jawaban.replace(chatPrompt, '').trim();
    }

    if (!jawaban || jawaban.includes('User:')) {
      jawaban = 'Halo! Ada yang bisa saya bantu terkait informasi gereja?';
    }

    return jawaban;
  }
}