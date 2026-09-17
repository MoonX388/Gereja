import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsOptional()
  @IsString()
  email?: string;

  // 🚀 Tambahkan username agar frontend React Anda bisa mengirim data
  @IsOptional()
  @IsString()
  username?: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  // 🚀 Tambahkan subdomain untuk multi-tenant
  @IsOptional()
  @IsString()
  subdomain?: string;
}