import { Module } from '@nestjs/common';
import { PelayanService } from './pelayan.service';
import { PelayanController } from './pelayan.controller';

@Module({
  controllers: [PelayanController],
  providers: [PelayanService],
  exports: [PelayanService],
})
export class PelayanModule {}
