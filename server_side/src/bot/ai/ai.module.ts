import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiService } from './ai.service';
import { User } from '../../entity/user.entity'; // Pastikan path mundur 2 tingkat sudah benar

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // 👈 WAJIB ADA: Mengenalkan tabel User ke modul ini
  ],
  providers: [AiService],
  exports: [AiService], // Diekspor agar bisa dibaca dari luar
})
export class AiModule {}