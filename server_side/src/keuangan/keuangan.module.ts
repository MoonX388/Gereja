import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Keuangan } from '../entity/keuangan.entity';
import { KeuanganService } from './keuangan.service';
import { KeuanganController } from './keuangan.controller';
import { KeuanganTypeOrmAdapter } from '../adapters/keuangan-typeorm.adapter';
import { KeuanganSupabaseAdapter } from '../adapters/keuangan-supabase.adapter';

@Module({})
export class KeuanganModule {
  static register(): DynamicModule {
    const useTypeOrm = process.env.FITUR_DB === 'true';
    return {
      module: KeuanganModule,
      imports: useTypeOrm ? [TypeOrmModule.forFeature([Keuangan])] : [],
      controllers: [KeuanganController],
      providers: [
        { provide: 'IKeuanganRepository', useClass: useTypeOrm ? KeuanganTypeOrmAdapter : KeuanganSupabaseAdapter },
        KeuanganService,
      ],
    };
  }
}