import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jadwal } from '../entity/jadwal.entity';
import { JadwalService } from './jadwal.service';
import { JadwalController } from './jadwal.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Jadwal])],
  controllers: [JadwalController],
  providers: [JadwalService],
  exports: [JadwalService],
})
export class JadwalModule {}