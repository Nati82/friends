import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageDto } from './dtos/message.dto';

import { Message } from './entities/Message.Entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private message: Repository<Message>,
  ) {}

  async sendMessage(
    fileValidationError: any,
    files: Array<Express.Multer.File>,
    message: MessageDto,
  ) {
    if (fileValidationError && fileValidationError.length) {
      throw new BadRequestException({
        message: fileValidationError,
      });
    }
    let fileName: string[] = [];
    files.forEach((f) => {
      fileName.push(f.filename);
    });
    message.file = fileName.join(', ');

    const newFile = this.message.create(message);

    return this.message.save(newFile);
  }
}
