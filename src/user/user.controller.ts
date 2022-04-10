import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddFriendDto } from './dtos/add-friend.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('searchUser')
  @UseInterceptors(ClassSerializerInterceptor)
  async searchUser(@Query('username') username: string) {
    return this.userService.searchUser(username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('addFriend')
  @UseInterceptors(ClassSerializerInterceptor)
  async addFriend(@Req() req: any, @Body() friend: AddFriendDto) {
    const { id } = req.user;
    return this.userService.addFriend(id, friend);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getFriendRequests')
  async getFriendRequests(@Req() req: any) {
    const requestedTo = req.user.id;
    return this.userService.getFriendRequests(requestedTo);
  }

  @UseGuards(JwtAuthGuard)
  @Post('acceptRequest')
  async acceptRequest(@Req() req: any, @Body() request: any) {
    const userId = req.user.id;
    const { requestId } = request;
    return this.userService.acceptRequest(requestId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('denyRequest')
  async denyRequest(@Body() request: any) {
    const { requestId } = request;
    return this.userService.denyRequest(requestId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('searchFriends')
  async searchFriends(@Query('username') username: string, @Req() req: any) {
    return this.userService.searchFriends(username, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('friends')
  async friends(@Req() req: any) {
    return this.userService.friends(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('removeFriend')
  async removeRequest(@Body() request: any) {
    const { friendId } = request;
    return this.userService.removeFriend(friendId);
  }
}
