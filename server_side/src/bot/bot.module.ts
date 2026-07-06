import { Module } from '@nestjs/common';
import { AiModule } from './ai/ai.module';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { TokenService } from './token.service';

@Module({
  imports: [AiModule],
  controllers: [BotController],
  providers: [BotService, TokenService],
  exports: [BotService, TokenService],
})
export class BotModule {}
