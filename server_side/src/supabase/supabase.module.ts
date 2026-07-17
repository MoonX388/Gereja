import { Module, Global } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Global() // 🌐 Membuat modul ini bisa langsung dipakai di modul lain tanpa perlu import ulang
@Module({
  providers: [SupabaseService],
  exports: [SupabaseService], // 🔑 Wajib di-export agar service-nya bisa di-inject
})
export class SupabaseModule {}