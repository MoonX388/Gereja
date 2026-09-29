// server_side/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

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
import { CommonModule } from './common/common.module';
import { SettingsModule } from './settings/settings.module';
import { SsoModule } from './sso/sso.module';

// Generic modules (sistem baru tanpa entity/interface)
import { UsersGenericModule } from './users/users-generic.module';
import { JemaatGenericModule } from './jemaat/jemaat-generic.module';
import { KeuanganGenericModule } from './keuangan/keuangan-generic.module';

const useTypeOrm = process.env.FITUR_DB === 'true';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(process.cwd(), '..', '.env'),
    }),

    // 🔥 HANYA aktif jika FITUR_DB=true
    ...(useTypeOrm ? [
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT ?? '5432', 10),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        // ⚠️ MASIH `true` — sudah pernah diflag sebelumnya: database ini
        // dipakai bareng gpanel/landing-page/glive, auto-sync bisa diam-diam
        // ubah/hapus kolom kapan saja salah satu app di-restart. Belum
        // diubah di snapshot ini — ganti ke `false` kalau sempat, terpisah
        // dari fix SSO ini.
        synchronize: true,
        ssl: { rejectUnauthorized: false },
      }),
    ] : []),

    SupabaseModule, // global
    CommonModule, // Generic system (base repository, service, controller)
    SettingsModule,

    // 🔥 PANGGIL .register() untuk semua module yang bergantung pada database
    AuthModule,
    UsersModule.register(),
    BotModule.register(),
    JemaatModule.register(),
    KeuanganModule.register(),
    KeluargaModule.register(),
    InventarisModule.register(),
    PelayanModule.register(),
    JadwalModule.register(),
    NotifikasiModule.register(),

    // 🚀 Generic modules (sistem baru tanpa entity/interface)
    UsersGenericModule,
    JemaatGenericModule,
    KeuanganGenericModule,

    SsoModule, // ⭐ FIXED — sebelumnya tidak terdaftar sama sekali
  ],
})
export class AppModule {}