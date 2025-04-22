import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from './auth.service';
import { User } from 'src/user/entities/user.entity';


@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('register')
    register(@Body() registerUserDto: RegisterUserDto): Promise<User> {
        console.log(registerUserDto)

        return this.authService.register(registerUserDto)
    }

    @Post('login')
    @UsePipes(ValidationPipe)
    login(@Body() LoginUserDto: LoginUserDto): Promise<any> {
        console.log(LoginUserDto)
        
        return this.authService.login(LoginUserDto)
    }

    @Post('refresh-token')
    refreshToken(@Body() { refresh_token }): Promise<any> {
        console.log('refresh token')

        return this.authService.refreshToken(refresh_token)
    }
}
