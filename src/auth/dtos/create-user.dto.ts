import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { Profile } from '../entities/Profile.Entity';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsPhoneNumber()
  phone: string;

  @IsString()
  bio: string;

  @IsOptional()
  profile: Profile[];
}
