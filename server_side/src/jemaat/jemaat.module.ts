import { Module } from '@nestjs/common';
import { JemaatService } from './jemaat.service';
import { JemaatController } from './jemaat.controller';

@Module({
  controllers: [JemaatController],
  providers: [JemaatService],
  exports: [JemaatService],
})
export class JemaatModule {}
