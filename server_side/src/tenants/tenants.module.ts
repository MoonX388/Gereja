import { Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  providers: [TenantsService],
  exports: [TenantsService],
})
export class TenantsModule {}
