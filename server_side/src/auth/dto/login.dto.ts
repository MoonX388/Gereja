import { IsEmail, IsString, IsOptional } from 'class-validator';

export class LoginDto {
  @IsString()
  email!: string; // identifier (email/username)

  @IsString()
  password!: string;

  @IsString()
  @IsOptional()
  subdomain?: string; // 🚀 Menerima kiriman teks subdomain lokasi login
}