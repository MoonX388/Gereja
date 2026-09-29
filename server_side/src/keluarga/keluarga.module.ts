import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Keluarga } from '../entity/keluarga.entity';
import { KeluargaService } from './keluarga.service';
import { KeluargaController } from './keluarga.controller';
import { KeluargaTypeOrmAdapter } from '../adapters/keluarga-typeorm.adapter';
import { KeluargaSupabaseAdapter } from '../adapters/keluarga-supabase.adapter';

@Module({})
export class KeluargaModule {
  static register(): DynamicModule {
    const useTypeOrm = process.env.FITUR_DB === 'true';
    return {
      module: KeluargaModule,
      imports: useTypeOrm ? [TypeOrmModule.forFeature([Keluarga])] : [],
      controllers: [KeluargaController],
      providers: [
        { provide: 'IKeluargaRepository', useClass: useTypeOrm ? KeluargaTypeOrmAdapter : KeluargaSupabaseAdapter },
        KeluargaService,
      ],
      exports: [KeluargaService],
    };
  }
}