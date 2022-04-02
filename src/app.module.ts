import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/User.Entity';
import { UserModule } from './user/user.module';
import { Friend } from './user/entities/Friend.Entity';
import { FriendRequest } from './user/entities/FriendRequest.Entity';
import { MessageModule } from './message/message.module';
import { Message } from './message/entities/Message.Entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'friends',
      entities: [User, Friend, FriendRequest, Message],
      synchronize: true,
    }),
    UserModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
