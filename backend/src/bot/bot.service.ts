import { Injectable, OnModuleInit } from '@nestjs/common';
import { AiService } from './ai/ai.service';

const {
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} = require('baileys');
const pino = require('pino');
const chalk = require('chalk');
const readline = require('readline');

function question(prompt: string): Promise<string> {
  process.stdout.write(prompt);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question('', (ans) => {
      rl.close();
      resolve(ans);
    }),
  );
}

@Injectable()
export class BotService implements OnModuleInit {
  private sock: any;
  private usePairingCode = false; // false = QR mode

  // Konfigurasi Bot
  private prefix = '!';
  private adminBot = ['6282158024074@s.whatsapp.net']; // Ganti dengan nomor admin

  private currentQrString: string | null = null;
  private groupCache = new Map<string, any>();

  private mess = {
    wait: '☕ *One Moment, Please*',
    error: '⚠ *Gagal Saat Melakukan Proses*',
    default: '📑 *Perintah Tidak Dikenali*',
    adminOnly: '⚠ *Perintah Ini Hanya Bisa Digunakan Oleh Admin Bot*',
    groupOnly: '⚠ *Perintah Ini Hanya Bisa Digunakan Di Dalam Grup*',
    adminGroupOnly: '⚠ *Perintah Ini Hanya Bisa Digunakan Oleh Admin Grup*',
  };

  constructor(private readonly aiService: AiService) {}

  async onModuleInit() {
    await this.startBot();
  }

  // ==================== BOT INIT ====================
  private async startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./LenwySesi');
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`WA v${version.join('.')}, latest: ${isLatest}`);

    this.sock = makeWASocket({
      logger: pino({ level: 'silent' }),
      printQRInTerminal: false,
      auth: state,
      browser: ['Ubuntu', 'Chrome', '20.0.04'],
      version,
      syncFullHistory: true,
      generateHighQualityLinkPreview: true,
    });

    // Jika sesi belum terdaftar, tampilkan QR
    if (!this.sock.authState.creds.registered) {
      console.log('Bot belum login. QR akan tersedia di endpoint /wa/qr-string');
    }

    this.sock.ev.on('creds.update', saveCreds);

    this.sock.ev.on('connection.update', (update) => {
      const { connection, qr } = update;
      if (qr) {
        this.currentQrString = qr;
        console.log('📱 QR tersedia. Akses /wa/login untuk melihat.');
      }
      if (connection === 'close') {
        console.log(chalk.red('❌ Koneksi terputus, reconnect...'));
        this.currentQrString = null;
        this.startBot();
      } else if (connection === 'open') {
        console.log(chalk.green('✔ Bot terhubung'));
        this.currentQrString = null;
      }
    });

    // ==================== HANDLER PESAN MASUK ====================
    this.sock.ev.on('messages.upsert', async (m) => {
      const msg = m.messages[0];
      if (!msg.message) return;

      const body =
        msg.message.conversation || msg.message.extendedTextMessage?.text || '';
      const remoteJid = msg.key.remoteJid;
      const isGroup = remoteJid.endsWith('@g.us');
      const userId = isGroup ? msg.key.participant : remoteJid;
      const pushname = msg.pushName || 'User';

      // Log pesan
      const colors = ['red', 'green', 'yellow', 'magenta', 'cyan', 'white', 'blue'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      console.log(
        chalk.yellow.bold('Bot'),
        chalk.green.bold('[WA]'),
        chalk[randomColor](pushname),
        chalk[randomColor](':'),
        chalk.white(body),
      );

      // Hanya proses jika diawali prefix
      if (!body.startsWith(this.prefix)) return;

      const args = body.slice(this.prefix.length).trim().split(/\s+/);
      const command = args.shift()?.toLowerCase();
      const query = args.join(' ');

      // Helper reply
      const reply = (teks: string) =>
        this.sock.sendMessage(remoteJid, { text: teks }, { quoted: msg });

      // ================== COMMAND HANDLER ==================
      switch (command) {
        // ---------- MENU ----------
        case 'menu':
          reply(this.getMenu());
          break;

        // ---------- ADMIN BOT ----------
        case 'admin':
          if (!this.adminBot.includes(userId))
            return reply(this.mess.adminOnly);
          reply('🎁 *Kamu adalah Admin Bot*');
          break;

        // ---------- HANYA GRUP ----------
        case 'group':
          if (!isGroup) return reply(this.mess.groupOnly);
          reply('🎁 *Perintah ini hanya bisa digunakan di dalam grup*');
          break;

        // ---------- AI TANYA JAWAB ----------
        case 'ai':
          if (!query) return reply('☘️ *Contoh:* !ai Apa itu kasih?');

          // 1. Ekstrak nomor HP murni dari user pengirim (memotong JID @s.whatsapp.net)
          const nomorHP = userId.split('@')[0];

          // 2. Beri tahu WhatsApp bahwa bot sedang mengetik agar koneksi tidak dianggap mati (Anti-Timeout)
          await this.sock.sendPresenceUpdate('composing', remoteJid);
          
          // 3. Kirim pesan tunggu awal ke user
          await reply(this.mess.wait);

          try {
            // 4. Panggil AiService dengan membawa teks pertanyaan DAN nomor HP pengirim
            const hasil = await this.aiService.generate(query, nomorHP);
            
            // 5. Kirim jawaban akhir AI ke WhatsApp
            await reply(`*🤖 AI Gereja*\n\n${hasil}`);
          } catch (err) {
            console.error('AI error:', err);
            await reply(this.mess.error);
          }
          break;

        // ---------- QUOTE ----------
        case 'quote':
          const quotes = [
            'Jangan menyerah, hari buruk akan berlalu.',
            'Kesempatan tidak datang dua kali.',
            'Kamu lebih kuat dari yang kamu kira.',
            'Hidup ini singkat, jangan sia-siakan.',
            'Tuhan adalah gembalaku, takkan kekurangan aku.',
            'Percayalah kepada TUHAN dengan segenap hatimu.',
          ];
          const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
          reply(`*📖 Quote Hari Ini*\n\n_"${randomQuote}"_`);
          break;

        // ---------- DOA (contoh fitur rohani) ----------
        case 'doa':
          const doaList = [
            'Tuhan Yesus, berkatilah kami semua. Amin.',
            'Bapa di sorga, tuntunlah langkah kami hari ini. Amin.',
            'Tuhan, berikanlah kami damai sejahtera-Mu. Amin.',
          ];
          const randomDoa = doaList[Math.floor(Math.random() * doaList.length)];
          reply(`*🙏 Doa*\n\n${randomDoa}`);
          break;

        // ---------- AYAT (contoh fitur rohani) ----------
        case 'ayat':
          const ayatList = [
            'Yohanes 3:16 - Karena begitu besar kasih Allah akan dunia ini...',
            'Mazmur 23:1 - TUHAN adalah gembalaku, takkan kekurangan aku.',
            'Filipi 4:13 - Segala perkara dapat kutanggung di dalam Dia yang memberi kekuatan kepadaku.',
          ];
          const randomAyat = ayatList[Math.floor(Math.random() * ayatList.length)];
          reply(`*📖 Ayat Hari Ini*\n\n${randomAyat}`);
          break;

        // ---------- KICK (ADMIN GRUP) ----------
        case 'kick':
          if (!isGroup) return reply(this.mess.groupOnly);
          if (!(await this.isGroupAdmin(remoteJid, userId)))
            return reply(this.mess.adminGroupOnly);
          
          const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid;
          if (!mentioned?.[0]) return reply('❌ Tag anggota yang ingin dikick.');
          
          try {
            await this.sock.groupParticipantsUpdate(remoteJid, [mentioned[0]], 'remove');
            reply(`✅ Berhasil mengeluarkan @${mentioned[0].split('@')[0]}`);
          } catch {
            reply(this.mess.error);
          }
          break;

        // ---------- DEFAULT ----------
        default:
          reply(this.mess.default);
      }
    });
  }

  // ==================== CEK ADMIN GRUP ====================
  private async isGroupAdmin(groupId: string, userId: string): Promise<boolean> {
    try {
      const metadata = await this.getGroupMetadata(groupId);
      const participant = metadata.participants.find((p) => p.id === userId);
      return participant?.admin === 'admin' || participant?.admin === 'superadmin';
    } catch {
      return false;
    }
  }

  // ==================== CACHE METADATA GRUP ====================
  private async getGroupMetadata(groupId: string) {
    if (!this.groupCache.has(groupId)) {
      const meta = await this.sock.groupMetadata(groupId);
      this.groupCache.set(groupId, meta);
      setTimeout(() => this.groupCache.delete(groupId), 300000); // 5 menit
    }
    return this.groupCache.get(groupId);
  }

  // ==================== PUBLIC METHODS (untuk controller) ====================
  
  async requestPairingCode(phoneNumber: string): Promise<string> {
    if (!this.sock) throw new Error('Bot belum diinisialisasi');
    const code = await this.sock.requestPairingCode(phoneNumber.trim());
    console.log(`🎁 Pairing Code: ${code}`);
    return code;
  }

  getQrString(): string | null {
    return this.currentQrString;
  }

  // ==================== MENU TEKS ====================
  private getMenu(): string {
    return `*🤖 Bot Gereja - Menu*

*!menu* - Tampilkan menu ini
*!ai* <pertanyaan> - Tanya jawab AI
*!quote* - Dapatkan quote motivasi
*!doa* - Doa singkat
*!ayat* - Ayat Alkitab
*!admin* - Cek admin bot
*!group* - Info grup
*!kick* @user - Kick anggota (admin grup)

*Powered by NestJS + Baileys*`;
  }
}