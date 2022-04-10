import { Expose } from 'class-transformer';
import { UserDto } from 'src/auth/dtos/user.dto';

export class FriendReqDto {
  @Expose()
  id: string;

  @Expose()
  addedBy: UserDto;

  @Expose()
  requestedTo: UserDto;
}
