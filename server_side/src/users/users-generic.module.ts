import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { UsersGenericService } from './users-generic.service';
import { UsersGenericController } from './users-generic.controller';

@Module({
  imports: [CommonModule],
  controllers: [UsersGenericController],
  providers: [UsersGenericService],
  exports: [UsersGenericService],
})
export class UsersGenericModule {}
