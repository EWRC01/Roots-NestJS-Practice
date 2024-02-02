import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import {TypeOrmModule} from '@nestjs/typeorm'
import { User } from './users/user.entity';
import { PostsService } from './posts/posts.service';
import { PostsController } from './posts/posts.controller';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'usbw',
    database: 'users-test',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,

  }),
  UsersModule,
  PostsModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class AppModule {}
