import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jemaat } from '../entity/jemaat.entity';
import { User } from '../entity/user.entity';
import { JemaatService } from './jemaat.service';
import { JemaatController } from './jemaat.controller';
import { JemaatTypeOrmAdapter } from '../adapters/jemaat-typeorm.adapter';
import { JemaatSupabaseAdapter } from '../adapters/jemaat-supabase.adapter';

@Module({})
export class JemaatModule {
  static register(): DynamicModule {
    const useTypeOrm = process.env.FITUR_DB === 'true';
    return {
      module: JemaatModule,
      imports: useTypeOrm ? [TypeOrmModule.forFeature([Jemaat, User])] : [],
      controllers: [JemaatController],
      providers: [
        { provide: 'IJemaatRepository', useClass: useTypeOrm ? JemaatTypeOrmAdapter : JemaatSupabaseAdapter },
        JemaatService,
      ],
      exports: ['IJemaatRepository', JemaatService],
    };
  }
}