import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private jwtService: JwtService,
        private configService: ConfigService
    ){}

    async register(registerUserDto: RegisterUserDto): Promise<User> {
        const hashPassword = await this.hashPassword(registerUserDto.password);

        return await this.userRepository.save({
            firstName: registerUserDto.first_name,
            lastName: registerUserDto.last_name,
            email: registerUserDto.email,
            password: hashPassword,
            refresh_token: "refresh_token_string",
            status: registerUserDto.status,
            created_at: new Date(),
            updated_at: new Date()
        });
    }

    async login(loginUserDto: LoginUserDto): Promise<any> {
        const user = await this.userRepository.findOne(
            { 
                where: { 
                    email: loginUserDto.email 
                } 
            }
        )

        if (!user) {
            throw new HttpException("Email is not exist", HttpStatus.UNAUTHORIZED)
        }

        const checkPass = bcrypt.compareSync(loginUserDto.password, user.password);
        if (!checkPass) {
            throw new HttpException("Password is not correct", HttpStatus.UNAUTHORIZED)
        }

        // generate access token and refresh token
        const payload = {
            id: user.id,
            email: user.email
        }

        return await this.generateToken(payload);
    }

    async refreshToken(refresh_token: string): Promise<any> {
        try {
            const verify = await this.jwtService.verifyAsync(refresh_token, {
                secret: this.configService.get<string>('SECRET')
            })
            console.log(verify)

            const checkExitToken = await this.userRepository.findOneBy({
                email: verify.email,
                refresh_token: refresh_token
            })

            if (checkExitToken) {
                return this.generateToken({
                    id: verify.id,
                    email: verify.email
                });
            } else {
                throw new HttpException("Refresh token is not valid", HttpStatus.UNAUTHORIZED)
            }

        } catch(error) {
            console.log(error)
            
            throw new HttpException("Refresh token is not valid", HttpStatus.UNAUTHORIZED)
        }
    }

    private async generateToken(payload: { id: number, email: string }) {
        const access_token = await this.jwtService.signAsync(payload);
        const refresh_token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('SECRET'),
            expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN')
        });

        await this.userRepository.update(
            {
                email: payload.email
            },
            {
                refresh_token: refresh_token
            }
        )

        return { access_token, refresh_token };
    }

    private async hashPassword(password: string): Promise<string> {
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const hash = await bcrypt.hash(password, salt);

        return hash;
    }
}
