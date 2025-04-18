import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
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

    private async hashPassword(password: string): Promise<string> {
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const hash = await bcrypt.hash(password, salt);

        return hash;
    }
}
