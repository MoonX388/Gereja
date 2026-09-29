import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { JemaatModule } from '../../jemaat/jemaat.module'; // Sesuaikan path ini jika perlu

@Module({
  imports: [
    JemaatModule.register(), // 👈 GUNAKAN INI SEBAGAI GANTI TypeOrmModule
  ],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}