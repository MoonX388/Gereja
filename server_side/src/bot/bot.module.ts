import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiModule } from './ai/ai.module';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { TokenService } from './token.service';
import { TokenEntity } from '../entity/token.entity';

@Module({
  imports: [
    AiModule,
    TypeOrmModule.forFeature([TokenEntity]), // <-- daftarkan entity
  ],
  controllers: [BotController],
  providers: [BotService, TokenService],
  exports: [BotService, TokenService], // opsional, jika mau dipakai modul lain
})
export class BotModule {}