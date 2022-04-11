import { Expose, Type } from 'class-transformer';
import { UserDto } from 'src/auth/dtos/user.dto';

export class ViewMessagesDto {
  @Expose()
  id: string;

  @Expose()
  message: string;

  @Expose()
  file: string;

  @Expose()
  date: Date;

  @Expose()
  @Type(() => UserDto)
  sentTo: UserDto;

  @Expose()
  @Type(() => UserDto)
  sentBy: UserDto;
}
