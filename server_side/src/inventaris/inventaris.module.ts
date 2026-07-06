import { Module } from '@nestjs/common';
import { InventarisService } from './inventaris.service';
import { InventarisController } from './inventaris.controller';

@Module({
  controllers: [InventarisController],
  providers: [InventarisService],
  exports: [InventarisService],
})
export class InventarisModule {}
