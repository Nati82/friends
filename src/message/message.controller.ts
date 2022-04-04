import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
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

  @UseGuards(JwtAuthGuard)
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
  async sendMessage(
    @Req() req: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() request: MessageDto,
  ) {
    const { fileValidationError, user } = req;
    return this.messageService.sendMessage(
      fileValidationError,
      user,
      files,
      request,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('viewFriendsWithMessage/:page')
  async viewFriendsWithMessage(@Req() req: any, @Param('page') page: number) {
    const { id } = req.user;

    if (isNaN(page)) {
      throw new BadRequestException({
        message: 'page must be a number!',
      });
    }

    return this.messageService.viewFriendsWithMessage(id, page);
  }
}
