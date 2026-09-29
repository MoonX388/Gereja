import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { SsoController } from './sso.controller';
import { SsoService } from './sso.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule,
    SupabaseModule,
  ],
  controllers: [SsoController],
  providers: [SsoService],
})
export class SsoModule {}
