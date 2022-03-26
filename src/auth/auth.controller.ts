import { Body, Controller, Delete, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from './User.Entity';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('/signup')
    async signup(@Body() body: CreateUserDto) {
        return this.authService.signup(body);
    }

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Req() req: any) {
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/update')
    async update(@Req() req: any, @Body() params: Partial<User>) {
        const { id } = req.user;
        return this.authService.update(id, params);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/delete')
    async delete(@Req() req: any) {
        const { id } = req.user;
        return this.authService.delete(id);
    }
}
