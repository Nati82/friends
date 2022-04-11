import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  access_token: string;

  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  bio: string;

  @Expose()
  profile: string;
}
