import { IsEmail, IsOptional, IsString, IsArray, MinLength, IsEnum, IsUUID } from 'class-validator';

export class EditUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  @IsEnum(['admin', 'admin_gereja', 'jemaat', 'pelayan', 'superadmin'])
  role?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}

export class UpdatePermissionsDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  add?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  remove?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  set?: string[];
}

export class UserIdDto {
  @IsUUID('4')
  userId: string;
}
