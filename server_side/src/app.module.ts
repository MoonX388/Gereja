// server_side/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 🚀 FORCE LOAD .ENV
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
import { SupabaseModule } from './supabase/supabase.module';

// 🔌 SAKLAR: Ubah jadi 'true' untuk aktifkan TypeORM, 'false' untuk matikan total
const useTypeOrm = process.env.FITUR_DB === 'true';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(process.cwd(), '..', '.env'),
    }),
    
    // 🔌 KONDISI SAKLAR TYPEORM: Hanya dimuat jika 'useTypeOrm' bernilai true
    ...(useTypeOrm ? [
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.DB_HOST || 'aws-1-ap-southeast-1.pooler.supabase.com',
        port: parseInt(process.env.DB_PORT || '6543', 10),
        username: process.env.DB_USERNAME || 'postgres.kvbxdziwtvrbqiwsseen',
        password: process.env.DB_PASSWORD || 'ZtnEPO1zG7eLRZp7',
        database: process.env.DB_NAME || 'postgres',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        ssl: process.env.DB_SSL === 'true' || true ? { rejectUnauthorized: false } : false,
      }),
    ] : []),

    SupabaseModule,

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