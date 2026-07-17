// server_side/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 🚀 FORCE LOAD .ENV: Memaksa file .env dibaca sebelum NestJS melakukan konfigurasi apa pun
dotenv.config({ path: path.join(process.cwd(), '.env') });

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BotModule } from './bot/bot.module';
import { JemaatModule } from './jemaat/jemaat.module';
import { KeuanganModule } from './keuangan/keuangan.module';
import { KeluargaModule } from './keluarga/keluarga.module'; 
import { InventarisModule } from './inventaris/inventaris.module'; 
import { PelayanModule } from './pelayan/pelayan.module'; 
import { JadwalModule } from './jadwal/jadwal.module'; 
import { NotifikasiModule } from './notif/notifikasi.module'; 

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(process.cwd(), '..', '.env'),
    }),
    
    // 🔌 KITA HIDUPKAN KEMBALI TYPEORM DENGAN KONEKSI SUPABASE POSTGRES
    TypeOrmModule.forRoot({
      type: 'postgres',
      // Mengambil langsung dari process.env yang sudah di-force load di atas
      host: process.env.DB_HOST || 'aws-1-ap-southeast-1.pooler.supabase.com',
      port: parseInt(process.env.DB_PORT || '6543', 10),
      username: process.env.DB_USERNAME || 'postgres.kvbxdziwtvrbqiwsseen',
      password: process.env.DB_PASSWORD || 'ZtnEPO1zG7eLRZp7',
      database: process.env.DB_NAME || 'postgres',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Biarkan true agar tabel otomatis terbuat di Supabase kamu
      ssl: process.env.DB_SSL === 'true' || true ? { rejectUnauthorized: false } : false,
    }),

    AuthModule,
    UsersModule,
    BotModule,
    JemaatModule,
    KeuanganModule,
    KeluargaModule,
    InventarisModule,
    PelayanModule,
    JadwalModule,
    NotifikasiModule,
  ],
})
export class AppModule {}