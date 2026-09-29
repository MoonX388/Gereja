import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jadwal } from '../entity/jadwal.entity';
import { JadwalService } from './jadwal.service';
import { JadwalController } from './jadwal.controller';
import { JadwalTypeOrmAdapter } from '../adapters/jadwal-typeorm.adapter';
import { JadwalSupabaseAdapter } from '../adapters/jadwal-supabase.adapter';

@Module({})
export class JadwalModule {
  static register(): DynamicModule {
    const useTypeOrm = process.env.FITUR_DB === 'true';
    return {
      module: JadwalModule,
      imports: useTypeOrm ? [TypeOrmModule.forFeature([Jadwal])] : [],
      controllers: [JadwalController],
      providers: [
        { provide: 'IJadwalRepository', useClass: useTypeOrm ? JadwalTypeOrmAdapter : JadwalSupabaseAdapter },
        JadwalService,
      ],
      exports: [JadwalService],
    };
  }
}