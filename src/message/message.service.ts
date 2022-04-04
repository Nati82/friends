import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UUIDVersion } from 'class-validator';
import * as fs from 'fs';

import { User } from 'src/auth/entities/User.Entity';
import { UserService } from 'src/user/user.service';

import { MessageDto } from './dtos/message.dto';
import { Message } from './entities/Message.Entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private message: Repository<Message>,
    private userService: UserService,
  ) {}

  async sendMessage(
    fileValidationError: string,
    user: Partial<User>,
    files: Array<Express.Multer.File>,
    message: MessageDto,
  ) {
    const { id, username } = user;

    if (fileValidationError && fileValidationError.length) {
      throw new BadRequestException({
        message: fileValidationError,
      });
    }

    const friend = await this.userService.friendsWithMessage(
      id as UUIDVersion,
      message.sentTo,
    );

    if (!friend) {
      throw new BadRequestException({
        message: 'You can only send messages to your friends!',
      });
    }

    let fileName: string[] = [];
    files.forEach((f) => {
      fileName.push(f.filename);
    });
    message.file = fileName
      .map((f) => {
        let userName = f.split('-')[1].split('.')[0];
        let date = new Date(parseInt(f.split('-')[0]))
          .toISOString()
          .split('T')[0];
        return `./files/${userName}/${date}/${f}`;
      })
      .join(', ');
    message.sentBy = id as UUIDVersion;
    message.date = new Date();

    const newFile = this.message.create(message);

    const savedMessage = await this.message.save(newFile);

    if (!savedMessage) {
      savedMessage.file.split(',').forEach((f) => {
        let date = new Date(parseInt(f.split('-')[0]))
          .toISOString()
          .split('T')[0];
        fs.promises.rmdir(`./files/${username}/${date}/${f}`);
      });
      throw new BadRequestException({
        message: 'message not sent. please try again',
      });
    }

    return savedMessage;
  }

  async viewFriendsWithMessage(userId: UUIDVersion, page: number) {
    return this.message
      .createQueryBuilder('messages')
      .distinctOn(['messages.sentBy', 'messages.sentTo'])
      .leftJoinAndSelect('messages.sentBy', 'sentBy')
      .leftJoinAndSelect('messages.sentTo', 'sentTo')
      .where('sentBy.id = :userId', { userId })
      .orWhere('sentTo.id = :userId', { userId })
      .take(50)
      .skip((page - 1) * 50)
      .getMany();
  }

  async viewMessages(friendId: UUIDVersion) {
    /* 
      This route must send 50 messages with a specific user
      and pagination.
     */
  }
}
