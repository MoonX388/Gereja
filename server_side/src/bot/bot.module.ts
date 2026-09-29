import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiModule } from './ai/ai.module';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { TokenService } from './token.service';
import { DialogflowController } from './dialogflow.controller';
import { TenantsModule } from '../tenants/tenants.module';

@Module({})
export class BotModule {
  static register(): DynamicModule {
    const useTypeOrm = process.env.FITUR_DB === 'true';

    return {
      module: BotModule,
      imports: [
        AiModule,
        TenantsModule,
        ...(useTypeOrm ? [TypeOrmModule.forFeature([])] : []),
      ],
      controllers: [BotController, DialogflowController],
      providers: [BotService, TokenService],
      exports: [BotService, TokenService],
    };
  }
}