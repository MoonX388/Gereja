import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifikasi } from '../entity/notifikasi.entity';
import { NotifikasiService } from './notifikasi.service';
import { NotifikasiController } from './notifikasi.controller';
import { NotifikasiTypeOrmAdapter } from '../adapters/notifikasi-typeorm.adapter';
import { NotifikasiSupabaseAdapter } from '../adapters/notifikasi-supabase.adapter';
import { BotModule } from '../bot/bot.module';

@Module({})
export class NotifikasiModule {
  static register(): DynamicModule {
    const useTypeOrm = process.env.FITUR_DB === 'true';
    return {
      module: NotifikasiModule,
      imports: [
        ...(useTypeOrm ? [TypeOrmModule.forFeature([Notifikasi])] : []),
        BotModule.register(),
      ],
      controllers: [NotifikasiController],
      providers: [
        { provide: 'INotifikasiRepository', useClass: useTypeOrm ? NotifikasiTypeOrmAdapter : NotifikasiSupabaseAdapter },
        NotifikasiService,
      ],
      exports: [NotifikasiService],
    };
  }
}