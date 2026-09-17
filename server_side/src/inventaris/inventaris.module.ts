import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventaris } from '../entity/inventaris.entity';
import { InventarisService } from './inventaris.service';
import { InventarisController } from './inventaris.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Inventaris])],
  controllers: [InventarisController],
  providers: [InventarisService],
  exports: [InventarisService],
})
export class InventarisModule {}
