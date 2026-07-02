// server_side/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(process.cwd(), '..', '.env'), // karena backend di server_side, naik satu folder
    }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.sqlite', // bisa juga ambil dari .env nanti
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
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
  ],
})
export class AppModule {}
