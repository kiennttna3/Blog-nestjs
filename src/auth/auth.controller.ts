import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { RegisterUserDto } from './dto/register-user.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { AuthService } from './auth.service'
import { User } from 'src/user/entities/user.entity'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

// ApiTags là một decorator của NestJS cho phép bạn nhóm các controller lại với nhau trong tài liệu Swagger
// Nó giúp bạn dễ dàng tìm kiếm và quản lý các API trong tài liệu Swagger
@ApiTags('Auth')
// @Controller là một decorator của NestJS cho phép bạn định nghĩa một controller
@Controller('auth')
export class AuthController {

    constructor(
        
        // AuthService là một lớp của NestJS cho phép bạn thực hiện các thao tác liên quan đến xác thực người dùng
        // Nó cho phép bạn đăng ký, đăng nhập và xác thực người dùng trong ứng dụng của bạn
        private authService: AuthService
    ) {}




    // Đăng ký người dùng mới
    @Post('register')
    // @ApiResponse là một decorator của NestJS cho phép bạn định nghĩa các phản hồi của API trong tài liệu Swagger
    // Nó giúp bạn dễ dàng tìm kiếm và quản lý các phản hồi của API trong tài liệu Swagger
    @ApiResponse( { status: 201, description: 'Register successfully!' } )
    @ApiResponse( { status: 401, description: 'Register fail!' } )
    // @body() là một decorator của NestJS cho phép bạn lấy dữ liệu từ body của request
    // RegisterUserDto là một lớp DTO (Data Transfer Object) mà bạn đã định nghĩa để xác thực dữ liệu đầu vào
    register(@Body() registerUserDto: RegisterUserDto): Promise<User> {

        // Gọi phương thức register của AuthService để thực hiện đăng ký
        return this.authService.register(registerUserDto)
    }


    
    // Đăng nhập người dùng
    @Post('login')
    // @ApiResponse là một decorator của NestJS cho phép bạn định nghĩa các phản hồi của API trong tài liệu Swagger
    // Nó giúp bạn dễ dàng tìm kiếm và quản lý các phản hồi của API trong tài liệu Swagger
    @ApiResponse( { status: 201, description: 'Login successfully!' } )
    @ApiResponse( { status: 401, description: 'Login fail!' } )
    // @UsePipes là một decorator của NestJS cho phép bạn sử dụng các pipe để xử lý dữ liệu đầu vào
    // ValidationPipe là một lớp của NestJS cho phép bạn xác thực dữ liệu đầu vào
    // Nó sẽ tự động xác thực dữ liệu đầu vào dựa trên các decorator mà bạn đã sử dụng trong DTO
    @UsePipes(ValidationPipe)
    // @Body() là một decorator của NestJS cho phép bạn lấy dữ liệu từ body của request
    // LoginUserDto là một lớp DTO (Data Transfer Object) mà bạn đã định nghĩa để xác thực dữ liệu đầu vào
    login(@Body() LoginUserDto: LoginUserDto): Promise<any> {
        
        // Gọi phương thức login của AuthService để thực hiện đăng nhập
        return this.authService.login(LoginUserDto)
    }


    

    // Làm mới token
    @Post('refresh-token')
    // @body() là một decorator của NestJS cho phép bạn lấy dữ liệu từ body của request
    // refresh_token là một biến mà bạn đã định nghĩa trong body của request
    refreshToken(@Body() { refresh_token }): Promise<any> {

        // Làm mới token bằng cách gọi phương thức refreshToken của AuthService
        return this.authService.refreshToken(refresh_token)
    }
}
