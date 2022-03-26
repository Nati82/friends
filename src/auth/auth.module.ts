import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './User.Entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { jwtConstants } from './constants';
import { JwtAuthService } from './jwt-auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '120000s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
