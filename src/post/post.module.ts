import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Post } from './entities/post.entity';

@Module({
  imports: [

    // Import TypeOrmModule để sử dụng các tính năng của TypeORM
    TypeOrmModule.forFeature([Post, User]),
    
    // Import ConfigModule để sử dụng các biến môi trường (environment variables)
    ConfigModule
  ],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
