import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { JemaatGenericService } from './jemaat-generic.service';
import { JemaatGenericController } from './jemaat-generic.controller';

@Module({
  imports: [CommonModule],
  controllers: [JemaatGenericController],
  providers: [JemaatGenericService],
  exports: [JemaatGenericService],
})
export class JemaatGenericModule {}
