import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtAuthService } from '../jwt-auth.service';
import { User } from '../User.Entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private jwtAuthService: JwtAuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    const user = await this.jwtAuthService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}