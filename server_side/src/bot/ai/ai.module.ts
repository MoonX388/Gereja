import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiService } from './ai.service';
import { data } from '../../entity/data.entity'; // Pastikan path mundur 2 tingkat sudah benar

@Module({
  imports: [
    TypeOrmModule.forFeature([data]), // 👈 WAJIB ADA: Mengenalkan tabel data ke modul ini
  ],
  providers: [AiService],
  exports: [AiService], // Diekspor agar bisa dibaca dari luar
})
export class AiModule {}
