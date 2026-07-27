import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiService } from './ai.service';
import { Jemaat } from '../../entity/jemaat.entity'; // Pastikan path mundur 2 tingkat sudah benar

@Module({
  imports: [
    TypeOrmModule.forFeature([Jemaat]), // 👈 WAJIB ADA: Mengenalkan tabel jemaat ke modul ini
  ],
  providers: [AiService],
  exports: [AiService], // Diekspor agar bisa dibaca dari luar
})
export class AiModule {}
