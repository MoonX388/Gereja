import { Module, Global } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { GenericRepository } from './base/generic-repository';

@Global()
@Module({
  imports: [SupabaseModule],
  providers: [GenericRepository],
  exports: [GenericRepository],
})
export class CommonModule {}
