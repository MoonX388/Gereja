// C:\Users\User\Desktop\peter\Gereja-main\server_side\src\jemaat\jemaat.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JemaatController } from './jemaat.controller';
import { JemaatService } from './jemaat.service';
import { data as Jemaat } from '../entity/data.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Jemaat]), // 🚀 Hanya menggunakan entity data
  ],
  controllers: [JemaatController],
  providers: [JemaatService],
})
export class JemaatModule {}