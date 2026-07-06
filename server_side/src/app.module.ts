// server_side/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BotModule } from './bot/bot.module';
import { JemaatModule } from './jemaat/jemaat.module';
import { KeuanganModule } from './keuangan/keuangan.module';
import { KeluargaModule } from './keluarga/keluarga.module'; // tambahkan
import { InventarisModule } from './inventaris/inventaris.module'; // tambahkan
import { PelayanModule } from './pelayan/pelayan.module'; // tambahkan
import { JadwalModule } from './jadwal/jadwal.module'; // tambahkan
import { NotifikasiModule } from './notif/notifikasi.module'; // tambahkan (sesuai nama folder)
import { SupabaseModule } from './supabase/supabase.module';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(process.cwd(), '..', '.env'), // karena backend di server_side, naik satu folder
    }),
    AuthModule,
    UsersModule,
    BotModule,
    JemaatModule,
    KeuanganModule,
    KeluargaModule, // tambahkan
    InventarisModule, // tambahkan
    PelayanModule, // tambahkan
    JadwalModule, // tambahkan
    NotifikasiModule, // tambahkan
    SupabaseModule,
  ],
})
export class AppModule {}
