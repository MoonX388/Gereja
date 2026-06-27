import { Injectable, OnModuleInit } from '@nestjs/common';
import { AiService } from './ai/ai.service'; // Sesuaikan path jika berbeda
import * as fs from 'fs';

const { Boom } = require('@hapi/boom');
const {
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
} = require('baileys');
const pino = require('pino');
const chalk = require('chalk');

@Injectable()
export class BotService implements OnModuleInit {
  private sock: any;
  private prefix = '!';
  private adminBot = ['6282158024074@s.whatsapp.net'];

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

  private async startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./BotSession');
    const { version, isLatest } = await fetchLatestBaileysVersion();

    this.sock = makeWASocket({
      logger: pino({ level: 'silent' }),
      printQRInTerminal: false,
      auth: state,
      browser: ['Ubuntu', 'Chrome', '20.0.04'],
      version,
      syncFullHistory: true,
      generateHighQualityLinkPreview: true,
    });

    this.sock.ev.on('creds.update', saveCreds);

    this.sock.ev.on('connection.update', (update: any) => {
      const { connection, lastDisconnect, qr } = update;
      
      if (qr) {
        this.currentQrString = qr;
      }

      if (connection === 'close') {
        this.currentQrString = null;
        
        const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

        if (shouldReconnect) {
          setTimeout(() => {
            this.startBot();
          }, 3000);
        } else {
          if (fs.existsSync('./BotSession')) {
            fs.rmSync('./BotSession', { recursive: true, force: true });
          }
          this.startBot(); 
        }
      } else if (connection === 'open') {
        this.currentQrString = null;
      }
    });

    this.sock.ev.on('messages.upsert', async (m: any) => {
      const msg = m.messages[0];
      if (!msg.message) return;

      const body = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
      const remoteJid = msg.key.remoteJid;
      const isGroup = remoteJid.endsWith('@g.us');
      const userId = isGroup ? msg.key.participant : remoteJid;
      const pushname = msg.pushName || 'User';

      if (!body.startsWith(this.prefix)) return;

      const args = body.slice(this.prefix.length).trim().split(/\s+/);
      const command = args.shift()?.toLowerCase();
      const query = args.join(' ');

      const reply = (teks: string) => this.sock.sendMessage(remoteJid, { text: teks }, { quoted: msg });

      switch (command) {
        case 'menu':
          reply(this.getMenu());
          break;
        case 'ai':
          if (!query) return reply('☘️ *Contoh:* !ai Apa itu kasih?');
          const nomorHP = userId.split('@')[0];
          await this.sock.sendPresenceUpdate('composing', remoteJid);
          await reply(this.mess.wait);
          try {
            const hasil = await this.aiService.generate(query, nomorHP);
            await reply(`*🤖 AI Gereja*\n\n${hasil}`);
          } catch (err) {
            await reply(this.mess.error);
          }
          break;
        default:
          reply(this.mess.default);
      }
    });
  }

  async requestPairingCode(phoneNumber: string): Promise<string> {
    if (!this.sock) throw new Error('Bot belum diinisialisasi');
    const code = await this.sock.requestPairingCode(phoneNumber.trim());
    return code;
  }

  getQrString(): string | null {
    return this.currentQrString;
  }

  private getMenu(): string {
    return `*🤖 Bot Gereja - Menu*\n\n*!menu* - Tampilkan menu ini\n*!ai* <pertanyaan> - Tanya jawab AI\n\n*Powered by NestJS + Baileys*`;
  }
}