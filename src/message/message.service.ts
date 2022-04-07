import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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
        let date = new Date().toISOString().split('T')[0];
        return `./files/${username}/${date}/${f}`;
      })
      .join(', ');

    message.sentBy = id as UUIDVersion;
    message.date = new Date();

    const newFile = this.message.create(message);

    const savedMessage = await this.message.save(newFile);

    if (!savedMessage) {
      savedMessage.file.split(',').forEach((f) => {
        const date = f.split('/')[3];
        const file = f.split('/')[4];
        fs.promises.rmdir(`./files/${username}/${date}/${file}`);
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

  async viewMessages(userId: UUIDVersion, friendId: UUIDVersion, page: number) {
    /* 
      This route must send 50 messages with a specific user
      and pagination.
     */

    return this.message
      .createQueryBuilder('messages')
      .where('messages.sentBy.id = :userId', { userId })
      .andWhere('messages.sentTo.id = :friendId', { friendId })
      .orderBy('messages.date', 'DESC')
      .take(50)
      .skip((page - 1) * 50)
      .getMany();
  }

  async editMessage(messageId: UUIDVersion, message: string) {
    console.log('message', message, '\n', 'messageId', messageId);
    const { affected } = await this.message
      .createQueryBuilder('messages')
      .update()
      .set({
        message,
      })
      .where('id= :messageId', { messageId })
      .execute();

    return affected ? 'update successful' : 'update unsuccessful';
  }

  async deleteMessage(username: string, messageId: UUIDVersion[]) {
    const messages = await this.message.find({ id: In(messageId) });
    messages.forEach((m) => {
      m.file.split(',').forEach(async (f) => {
        const date = f.split('/')[3];
        const file = f.split('/')[4];
        await fs.promises.rm(`./files/${username}/${date}/${file}`, {
          recursive: true,
          force: true,
        });
      });
    });
    const { affected } = await this.message.delete({ id: In(messageId) });

    return affected ? 'delete successful' : 'delete unsuccessful';
  }
}
