import { Module } from '@nestjs/common';
import { KeuanganService } from './keuangan.service';
import { KeuanganController } from './keuangan.controller';

@Module({
  controllers: [KeuanganController],
  providers: [KeuanganService],
})
export class KeuanganModule {}
