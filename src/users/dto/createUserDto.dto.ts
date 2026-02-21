import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsStrongPassword, MaxLength } from 'class-validator';
import { Role } from '@/common/enums/role.enum';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsStrongPassword()
  password: string;

  @IsInt()
  @IsPositive({ message: 'Age must be greater than zero! '})
  age: number;

  @IsString()
  @MaxLength(1000)
  description: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
