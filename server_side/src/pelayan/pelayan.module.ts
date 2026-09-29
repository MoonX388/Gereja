import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pelayan } from '../entity/pelayan.entity';
import { PelayanService } from './pelayan.service';
import { PelayanController } from './pelayan.controller';
import { PelayanTypeOrmAdapter } from '../adapters/pelayan-typeorm.adapter';
import { PelayanSupabaseAdapter } from '../adapters/pelayan-supabase.adapter';

@Module({})
export class PelayanModule {
  static register(): DynamicModule {
    const useTypeOrm = process.env.FITUR_DB === 'true';
    return {
      module: PelayanModule,
      imports: useTypeOrm ? [TypeOrmModule.forFeature([Pelayan])] : [],
      controllers: [PelayanController],
      providers: [
        { provide: 'IPelayanRepository', useClass: useTypeOrm ? PelayanTypeOrmAdapter : PelayanSupabaseAdapter },
        PelayanService,
      ],
      exports: [PelayanService],
    };
  }
}