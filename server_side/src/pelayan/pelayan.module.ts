import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pelayan } from '../entity/pelayan.entity';
import { PelayanService } from './pelayan.service';
import { PelayanController } from './pelayan.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pelayan])],
  controllers: [PelayanController],
  providers: [PelayanService],
  exports: [PelayanService],
})
export class PelayanModule {}
