import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  email!: string; // Kita tetap gunakan nama property 'email' agar tidak mengubah sisi Next.js, tapi isinya bisa email/username.

  @IsString()
  @IsNotEmpty()
  password!: string;
}
