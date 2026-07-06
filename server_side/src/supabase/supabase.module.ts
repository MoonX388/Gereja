import { Global, Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { SchemaBootstrapService } from './schema-bootstrap.service';

@Global()
@Module({
  providers: [SupabaseService, SchemaBootstrapService],
  exports: [SupabaseService, SchemaBootstrapService],
})
export class SupabaseModule {}
