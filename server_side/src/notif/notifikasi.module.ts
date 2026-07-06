import { Module } from '@nestjs/common';
import { NotifikasiService } from './notifikasi.service';
import { NotifikasiController } from './notifikasi.controller';
import { BotModule } from '../bot/bot.module';

@Module({
  imports: [BotModule],
  controllers: [NotifikasiController],
  providers: [NotifikasiService],
  exports: [NotifikasiService],
})
export class NotifikasiModule {}
