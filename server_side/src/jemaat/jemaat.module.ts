// C:\Users\User\Desktop\peter\Gereja-main\server_side\src\jemaat\jemaat.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JemaatController } from './jemaat.controller';
import { JemaatService } from './jemaat.service';
import { Jemaat } from '../entity/jemaat.entity';
import { User } from '../entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Jemaat]), // 🚀 Hanya menggunakan entity data
    TypeOrmModule.forFeature([User]), // 🚀 Injeksi entity User agar bisa digunakan di service
  ],
  controllers: [JemaatController],
  providers: [JemaatService],
})
export class JemaatModule {}