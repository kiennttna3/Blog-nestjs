import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../user/entities/user.entity'
import { RegisterUserDto } from './dto/register-user.dto'
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto/login-user.dto'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'


@Injectable()
export class AuthService {
    constructor(
        // Tự động tiêm vào repository của TypeORM cho entity User
        // @InjectRepository(User) là một decorator của NestJS cho phép bạn tiêm vào repository cho một entity cụ thể
        @InjectRepository(User)

        // Repository<User> là một lớp của TypeORM cho phép bạn tương tác với cơ sở dữ liệu
        // Nó cho phép bạn thực hiện các thao tác CRUD (Create, Read, Update, Delete) trên entity User
        private userRepository: Repository<User>,

        // JwtService là một lớp của NestJS cho phép bạn tạo và xác thực JWT (JSON Web Token)
        // Nó cho phép bạn tạo token và xác thực token trong ứng dụng của bạn
        private jwtService: JwtService,

        // ConfigService là một lớp của NestJS cho phép bạn truy cập vào các biến môi trường
        // Nó cho phép bạn lấy các giá trị từ file .env hoặc từ các biến môi trường khác
        private configService: ConfigService
    ){}



    // Tạo mới người dùng
    async register(registerUserDto: RegisterUserDto): Promise<User> {
        // Mã hóa mật khẩu
        const hashPassword = await this.hashPassword(registerUserDto.password)

        // Check nếu email đã tồn tại
        const checkEmail = await this.userRepository.findOneBy({ email: registerUserDto.email })

        // Nếu email đã tồn tại, ném ra lỗi 401
        if (checkEmail) {
            throw new HttpException("Email đã tồn tại", HttpStatus.UNAUTHORIZED)
        }
    
        // Tạo user trước (chưa có refresh token)
        const newUser = await this.userRepository.save({
            first_name: registerUserDto.first_name,
            last_name: registerUserDto.last_name,
            email: registerUserDto.email,
            password: hashPassword,
            refresh_token: '',
            status: registerUserDto.status,
            created_at: new Date(),
            updated_at: new Date()
        })
    
        const payload = {
            id: newUser.id,
            email: newUser.email
        }
    
        // Tạo refresh token
        const refresh_token = await this.jwtService.signAsync(payload, {

            // Sử dụng secret key từ biến môi trường
            secret: this.configService.get<string>('SECRET'),
            
            // Thời gian hết hạn của refresh token
            expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN')
        })
    
        // Cập nhật lại refresh_token vào user vừa tạo
        await this.userRepository.update({ 
            id: newUser.id 
        }, { 
            refresh_token 
        })
    
        // Trả user đã có refresh token
        return {
            ...newUser,
            refresh_token
        }
    }
    

    
    // Đăng nhập người dùng
    async login(loginUserDto: LoginUserDto): Promise<any> {
        // Tìm người dùng theo email
        const user = await this.userRepository.findOne(
            { 
                where: { 
                    email: loginUserDto.email 
                } 
            }
        )

        // Nếu không tìm thấy người dùng với email đó, ném ra lỗi 401
        if (!user) {
            throw new HttpException("Email đã tồn tại", HttpStatus.UNAUTHORIZED)
        }

        // Mã hóa mật khẩu
        const checkPass = await bcrypt.compareSync(loginUserDto.password, user.password)

        // Nếu mật khẩu không đúng, ném ra lỗi 401
        if (!checkPass) {
            throw new HttpException("Mật khẩu không đúng", HttpStatus.UNAUTHORIZED)
        }

        // Nếu mật khẩu đúng
        const payload = {
            id: user.id,
            email: user.email
        }

        // Trả về access token và refresh token đã tạo mới
        return await this.generateToken(payload)
    }


    
    // Tạo lại access token nếu có refresh token hợp lệ
    async refreshToken(refresh_token: string): Promise<any> {
        // Kiểm tra xem refresh token có tồn tại trong cơ sở dữ liệu hay không
        try {

            // Giải mã refresh token
            // jwt.verify là một hàm của thư viện jsonwebtoken để giải mã token
            const verify = await this.jwtService.verifyAsync(refresh_token, {
                // Sử dụng secret key từ biến môi trường
                secret: this.configService.get<string>('SECRET')
            })
            console.log(verify)

            // Nếu refresh token hợp lệ, tìm người dùng theo email
            const checkExitToken = await this.userRepository.findOneBy({
                email: verify.email,
                refresh_token: refresh_token
            })

            // Nếu refresh token tồn tại trong cơ sở dữ liệu, tạo lại access token và refresh token mới
            // Nếu refresh token không tồn tại trong cơ sở dữ liệu, ném ra lỗi 401
            if (checkExitToken) {
                return this.generateToken({
                    id: verify.id,
                    email: verify.email
                })
            } else {
                throw new HttpException("Refresh token không hợp lệ", HttpStatus.UNAUTHORIZED)
            }

        // Nếu refresh token không hợp lệ, ném ra lỗi 401
        } catch(error) {
            console.log(error)
            
            throw new HttpException("Refresh token không hợp lệ", HttpStatus.UNAUTHORIZED)
        }
    }



    // Sinh ra access token và refresh token
    private async generateToken(payload: { id: number, email: string }) {

        // Tạo access token
        const access_token = await this.jwtService.signAsync(payload)

        // Tạo refresh token
        const refresh_token = await this.jwtService.signAsync(payload, {

            // Sử dụng secret key từ biến môi trường
            secret: this.configService.get<string>('SECRET'),

            // Thời gian hết hạn của refresh token
            expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN')
        })

        // Cập nhật lại refresh_token vào user vừa tạo
        await this.userRepository.update(
            {
                email: payload.email
            },
            {
                refresh_token: refresh_token
            }
        )

        // Trả về access token và refresh token
        return { access_token, refresh_token }
    }



    // Mã hóa mật khẩu
    private async hashPassword(password: string): Promise<string> {

        // Tạo salt với độ dài 10
        const saltRound = 10

        // bcrypt.genSalt là một hàm của thư viện bcrypt để tạo ra một chuỗi salt ngẫu nhiên
        const salt = await bcrypt.genSalt(saltRound)

        // Mã hóa mật khẩu với salt đã tạo
        // bcrypt.hash là một hàm của thư viện bcrypt để mã hóa mật khẩu với salt
        const hash = await bcrypt.hash(password, salt)

        // Trả về mật khẩu đã mã hóa
        return hash
    }
}
