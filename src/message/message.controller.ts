import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MessageDto } from './dtos/message.dto';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post('sendMessage')
  @UseInterceptors(
    FilesInterceptor(
      'file',
      // , 20, {
      //   storage: diskStorage({
      //     destination: path.resolve(__dirname, './files'),
      //   }),
      // }
    ),
  )
  @UseGuards(JwtAuthGuard)
  async sendMessage(
    @Req() req: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() request: MessageDto,
  ) {
    const { fileValidationError } = req;
    return this.messageService.sendMessage(fileValidationError, files, request);
  }
}
