import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserTypeOrmAdapter } from '../adapters/user-typeorm.adapter';
import { UserSupabaseAdapter } from '../adapters/user-supabase.adapter';

@Module({})
export class UsersModule {
  static register(): DynamicModule {
    const useTypeOrm = process.env.FITUR_DB === 'true';
    
    return {
      module: UsersModule,
      imports: useTypeOrm ? [TypeOrmModule.forFeature([User])] : [],
      controllers: [UsersController],
      providers: [
        {
          provide: 'IUserRepository',
          useClass: useTypeOrm ? UserTypeOrmAdapter : UserSupabaseAdapter,
        },
        UsersService,
      ],
      exports: [UsersService],
    };
  }
}