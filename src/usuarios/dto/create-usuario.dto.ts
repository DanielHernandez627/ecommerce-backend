import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUsuarioDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 255)
  password_hash: string;
}
