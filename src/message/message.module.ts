import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import * as fs from 'fs';

import { AuthModule } from 'src/auth/auth.module';
import { Message } from './entities/Message.Entity';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    MulterModule.register({
      storage: diskStorage({
        destination: async function (req, file, cb) {
          const user = req.user['username'];
          const date = new Date().toISOString().split('T')[0];
          await fs.promises.mkdir(`./files/${user}/${date}`, {
            recursive: true,
          });
          cb(null, `./files/${user}/${date}`);
        },
        filename: (req, file, cb) => {
          const user = req.user['username'];
          let type = file.originalname.split('.');
          cb(null, `${Date.now()}-${user}.${type[type.length - 1]}`);
        },
      }),
      fileFilter: function (req, file, cb) {
        if (file.originalname.match(/\.(zh|exe|bash|sh)$/)) {
          req.fileValidationError =
            'executable or scripting files are not allowed!';
          return cb(null, false);
        }

        cb(null, true);
      },
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
