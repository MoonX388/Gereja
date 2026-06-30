import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  nama!: string;

  // optional
  alamat?: string;
  telepon?: string;
  jenisKelamin?: string;
  tanggalLahir?: string;
}