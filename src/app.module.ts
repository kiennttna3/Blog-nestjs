import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { dataSourceOptions } from 'db/data-source'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { PostModule } from './post/post.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    
    // Import TypeOrmModule để sử dụng các tính năng của TypeORM
    // và kết nối đến cơ sở dữ liệu PostgreSQL
    TypeOrmModule.forRoot(dataSourceOptions),

    // Import UserModule để sử dụng các tính năng của UserModule
    // và các controller, service liên quan đến người dùng
    UserModule,

    // Import AuthModule để sử dụng các tính năng của AuthModule
    // và các controller, service liên quan đến xác thực người dùng
    AuthModule,

    //Import ConfigModule để sử dụng các biến môi trường (environment variables)
    // và cấu hình ứng dụng từ file .env
    ConfigModule.forRoot(),

    PostModule,

    CategoryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
