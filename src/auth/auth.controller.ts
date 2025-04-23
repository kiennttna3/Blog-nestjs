import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { RegisterUserDto } from './dto/register-user.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { AuthService } from './auth.service'
import { User } from 'src/user/entities/user.entity'


@Controller('auth')
export class AuthController {

    constructor(
        
        // AuthService là một lớp của NestJS cho phép bạn thực hiện các thao tác liên quan đến xác thực người dùng
        // Nó cho phép bạn đăng ký, đăng nhập và xác thực người dùng trong ứng dụng của bạn
        private authService: AuthService
    ) {}




    // Đăng ký người dùng mới
    @Post('register')

    // @body() là một decorator của NestJS cho phép bạn lấy dữ liệu từ body của request
    // RegisterUserDto là một lớp DTO (Data Transfer Object) mà bạn đã định nghĩa để xác thực dữ liệu đầu vào
    register(@Body() registerUserDto: RegisterUserDto): Promise<User> {
        console.log(registerUserDto)

        // Gọi phương thức register của AuthService để thực hiện đăng ký
        return this.authService.register(registerUserDto)
    }


    
    // Đăng nhập người dùng
    @Post('login')
    // @UsePipes là một decorator của NestJS cho phép bạn sử dụng các pipe để xử lý dữ liệu đầu vào
    // ValidationPipe là một lớp của NestJS cho phép bạn xác thực dữ liệu đầu vào
    // Nó sẽ tự động xác thực dữ liệu đầu vào dựa trên các decorator mà bạn đã sử dụng trong DTO
    @UsePipes(ValidationPipe)

    // @Body() là một decorator của NestJS cho phép bạn lấy dữ liệu từ body của request
    // LoginUserDto là một lớp DTO (Data Transfer Object) mà bạn đã định nghĩa để xác thực dữ liệu đầu vào
    login(@Body() LoginUserDto: LoginUserDto): Promise<any> {
        console.log(LoginUserDto)
        
        // Gọi phương thức login của AuthService để thực hiện đăng nhập
        return this.authService.login(LoginUserDto)
    }


    
    // Làm mới token
    @Post('refresh-token')

    // @body() là một decorator của NestJS cho phép bạn lấy dữ liệu từ body của request
    // refresh_token là một biến mà bạn đã định nghĩa trong body của request
    refreshToken(@Body() { refresh_token }): Promise<any> {
        console.log('refresh token')

        // Làm mới token bằng cách gọi phương thức refreshToken của AuthService
        return this.authService.refreshToken(refresh_token)
    }
}
