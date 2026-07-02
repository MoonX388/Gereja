import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Keluarga } from '../entity/keluarga.entity';
import { KeluargaService } from './keluarga.service';
import { KeluargaController } from './keluarga.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Keluarga])],
  controllers: [KeluargaController],
  providers: [KeluargaService],
  exports: [KeluargaService],
})
export class KeluargaModule {}
