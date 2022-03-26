import { IsEmail, IsPhoneNumber, IsString } from "class-validator";

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
  
    @IsString()
    profile: string;
    
  }
  