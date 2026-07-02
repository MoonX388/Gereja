import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifikasi } from '../entity/notifikasi.entity';
import { User } from '../entity/data.entity';
import { NotifikasiService } from './notifikasi.service';
import { NotifikasiController } from './notifikasi.controller';
import { BotModule } from '../bot/bot.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notifikasi, User]), // tambahkan User
    BotModule,
  ],
  controllers: [NotifikasiController],
  providers: [NotifikasiService],
  exports: [NotifikasiService],
})
export class NotifikasiModule {}
