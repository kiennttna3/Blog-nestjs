import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [

    // Import TypeOrmModule để sử dụng các tính năng của TypeORM
    TypeOrmModule.forFeature([User]),
    
    // Import ConfigModule để sử dụng các biến môi trường (environment variables)
    ConfigModule
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
