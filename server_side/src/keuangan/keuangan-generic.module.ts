import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { KeuanganGenericService } from './keuangan-generic.service';
import { KeuanganGenericController } from './keuangan-generic.controller';

@Module({
  imports: [CommonModule],
  controllers: [KeuanganGenericController],
  providers: [KeuanganGenericService],
  exports: [KeuanganGenericService],
})
export class KeuanganGenericModule {}
