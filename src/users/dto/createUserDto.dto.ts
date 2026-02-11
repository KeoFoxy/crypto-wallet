import { IsEmail, IsInt, IsNotEmpty, IsPositive, IsString, IsStrongPassword, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  // @IsStrongPassword()
  password: string;

  @IsInt()
  @IsPositive({ message: 'Age must be greater than zero! '})
  age: number;

  @IsString()
  @MaxLength(1000)
  description: string;
}
