import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  email!: string; // Kita tetap gunakan nama property 'email' agar tidak mengubah sisi Next.js, tapi isinya bisa email/username.
  username?: string; // Tambahkan property username untuk menerima input username juga

  @IsString()
  @IsNotEmpty()
  password!: string;
}
