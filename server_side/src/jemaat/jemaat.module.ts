import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User as Jemaat } from '../entity/data.entity';
import { JemaatService } from './jemaat.service';
import { JemaatController } from './jemaat.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Jemaat])],
  controllers: [JemaatController],
  providers: [JemaatService],
  exports: [JemaatService],
})
export class JemaatModule {}
