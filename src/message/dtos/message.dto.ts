import { IsOptional, IsString, IsUUID, UUIDVersion } from 'class-validator';

export class MessageDto {
  @IsOptional()
  file: string;

  @IsString()
  message: string;

  @IsUUID()
  friend: UUIDVersion;
}
