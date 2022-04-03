import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUIDVersion } from 'class-validator';
import { User } from 'src/auth/entities/User.Entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
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
    message.file = fileName.join(', ');
    message.sentBy = id as UUIDVersion;
    message.date = new Date();

    const newFile = this.message.create(message);

    return this.message.save(newFile);
  }

  async viewMessages(userId: UUIDVersion, page: number) {
    /*
      load a hundred messages sorted in the order latest to old.
      use a custom serializer to properly format the response object.
      the object must show friends the user has chatted with with the latest message
      included and it must be sorted latest to old.
     */
    let messages = await this.message.find({
      order: {
        date: 'DESC',
      },
      where: [
        {
          sentBy: userId,
        },
        {
          sentTo: userId,
        },
      ],
      take: 50,
      skip: page * 50,
    });

    const friendsWithMessage = messages.map((m) => {
      let files = m.file.split(',');
      const file = files.map((f) => {
        let username = f.split('-')[1].split('.')[0];
        let date = new Date(parseInt(f.split('-')[0]))
          .toISOString()
          .split('T')[0];
        return `./files/${username}/${date}/${f}`;
      });
      return { ...m, file };
    });

    return friendsWithMessage;
  }
}
