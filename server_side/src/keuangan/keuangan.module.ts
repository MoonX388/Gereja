import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Keuangan } from '../entity/keuangan.entity';
import { KeuanganService } from './keuangan.service';
import { KeuanganController } from './keuangan.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Keuangan])],
  controllers: [KeuanganController],
  providers: [KeuanganService],
})
export class KeuanganModule {}
