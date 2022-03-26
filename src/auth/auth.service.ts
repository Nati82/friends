import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './User.Entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { isUUID, UUIDVersion } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(params: CreateUserDto): Promise<User> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(params.password, saltOrRounds);
    params.password = hash;
    const user = this.repo.create({ ...params });
    console.log(user);
    return this.repo.save(user);
  }

  async findOne(username: any): Promise<User> {
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

  async login(
    newUser: User,
  ): Promise<{ access_token: string; user: Partial<User> }> {
    const { password, ...user } = newUser;
    const payload = { username: user.username, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async update(
    id: UUIDVersion,
    params: Partial<User>,
  ): Promise<Partial<User> | string> {
    if (params.password) {
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(params.password, saltOrRounds);
      params.password = hash;
    }
    const { affected } = await this.repo.update(id, params);

    if (affected > 0) return this.repo.findOne(id);
    return 'update was unsuccessful';
  }

  async delete(id: UUIDVersion) {
    return this.repo.delete(id);
  }
}
