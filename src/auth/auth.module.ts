import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/user/entities/user.entity'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService  } from '@nestjs/config'

@Module({
  imports: [

    // TypeOrmModule.forFeature([User]) là một phương thức của TypeORM cho phép bạn sử dụng repository cho entity User trong module này
    // Nó sẽ tự động tạo ra một repository cho entity User và tiêm vào AuthService
    TypeOrmModule.forFeature([User]),

    // JwtModule.registerAsync là một phương thức của NestJS cho phép bạn cấu hình JWT một cách bất đồng bộ
    // Nó cho phép bạn sử dụng các biến môi trường để cấu hình JWT
    JwtModule.registerAsync({

      // ConfigModule là một module của NestJS cho phép bạn sử dụng các biến môi trường
      // Nó cho phép bạn sử dụng các biến môi trường trong ứng dụng
      imports: [ConfigModule],

      // ConfigService là một lớp của NestJS cho phép bạn truy cập vào các biến môi trường
      // Nó cho phép bạn lấy các giá trị từ file .env hoặc từ các biến môi trường khác
      inject: [ConfigService],

      // global: true là một thuộc tính cho phép bạn sử dụng JwtModule trong toàn bộ ứng dụng
      global: true,

      // useFactory là một phương thức cho phép bạn cấu hình JWT một cách bất đồng bộ
      
      useFactory: (configService: ConfigService) => ({

        // secret là một thuộc tính cho phép bạn cấu hình JWT
        secret: configService.get<string>('SECRET'),

        // signOptions là một thuộc tính cho phép bạn cấu hình JWT
        signOptions: {
          
          // expiresIn là một thuộc tính cho phép bạn cấu hình thời gian hết hạn của JWT
          expiresIn: configService.get<string>('EXP_IN_REFRESH_TOKEN') 
        },
      }),
    }),
    ConfigModule
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
