import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventaris } from '../entity/inventaris.entity';
import { InventarisService } from './inventaris.service';
import { InventarisController } from './inventaris.controller';
import { InventarisTypeOrmAdapter } from '../adapters/inventaris-typeorm.adapter';
import { InventarisSupabaseAdapter } from '../adapters/inventaris-supabase.adapter';

@Module({})
export class InventarisModule {
  static register(): DynamicModule {
    const useTypeOrm = process.env.FITUR_DB === 'true';
    return {
      module: InventarisModule,
      imports: useTypeOrm ? [TypeOrmModule.forFeature([Inventaris])] : [],
      controllers: [InventarisController],
      providers: [
        { provide: 'IInventarisRepository', useClass: useTypeOrm ? InventarisTypeOrmAdapter : InventarisSupabaseAdapter },
        InventarisService,
      ],
      exports: [InventarisService],
    };
  }
}