import { Module } from '@nestjs/common';
import { KeluargaService } from './keluarga.service';
import { KeluargaController } from './keluarga.controller';

@Module({
  controllers: [KeluargaController],
  providers: [KeluargaService],
  exports: [KeluargaService],
})
export class KeluargaModule {}
