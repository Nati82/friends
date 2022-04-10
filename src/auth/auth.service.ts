import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/User.Entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { isUUID, UUIDVersion } from 'class-validator';
import * as fs from 'fs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(
    fileValidationError: string,
    file: Express.Multer.File,
    params: CreateUserDto,
  ) {
    const userExists = await this.findOne(params.username);

    if (userExists) {
      throw new BadRequestException({
        message: 'username already exists',
      });
    }
    if (fileValidationError && fileValidationError.length) {
      throw new BadRequestException({
        message: fileValidationError,
      });
    }

    params.profile =
      file && file.filename ? `${file.destination}/${file.filename}` : '';

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(params.password, saltOrRounds);
    params.password = hash;
    const newUser = this.repo.create({ ...params });

    const user = await this.repo.save(newUser);

    if (user) return this.login(user);

    await fs.promises.rm(`./files/${params.username}/profile`, {
      recursive: true,
      force: true,
    });

    throw new BadRequestException({
      message: 'signup unsuccessful',
    });
  }

  async findOne(username: any) {
    if (username.id && isUUID(username.id)) {
      const id = username.id as UUIDVersion;
      return this.repo.findOne(id);
    }
    return this.repo.findOne({ username });
  }

  async find(username: string) {
    return this.repo.find({
      where: {
        username: Like(`%${username}%`),
      },
    });
  }

  async login(newUser: User) {
    const { password, ...user } = newUser;
    const payload = { username: user.username, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      ...user,
    };
  }

  async update(
    id: UUIDVersion,
    fileValidationError: string,
    file: Express.Multer.File,
    params: Partial<User>,
  ) {
    const user = await this.repo.findOne(id);

    if (params.password) {
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(params.password, saltOrRounds);
      params.password = hash;
    }

    if (fileValidationError && fileValidationError.length) {
      throw new BadRequestException({
        message: fileValidationError,
      });
    }

    if (file && file.filename) {
      const profile = user.profile.split(',');
      profile.push(`files/${user.username}/${file.filename}`);
      params.profile = profile.join(',');
    }

    const { affected } = await this.repo
      .createQueryBuilder('users')
      .update()
      .set({
        ...params,
      })
      .where('users.id = :id', { id })
      .execute();
    if (affected > 0) return this.login(user);
    throw new BadRequestException({
      message: 'update was unsuccessful',
    });
  }

  async delete(id: UUIDVersion) {
    const user = await this.repo.findOne(id);
    const res = await this.repo.delete(id);
    if (res.affected && res.affected > 0) {
      await fs.promises.rm(`./files/${user.username}/profile`, {
        recursive: true,
        force: true,
      });
      return user;
    }

    throw new NotFoundException({
      message: 'user not found',
    });
  }
}
