import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(

        // Tự động tiêm vào JwtService và ConfigService
        // JwtService là một lớp của NestJS cho phép bạn tạo và xác thực JWT (JSON Web Token)
        private jwtService: JwtService,
        
        // ConfigService là một lớp của NestJS cho phép bạn truy cập vào các biến môi trường
        // Nó cho phép bạn lấy các giá trị từ file .env hoặc từ các biến môi trường khác
        private configService: ConfigService
    ) {}



    // Phương thức canActivate được gọi để kiểm tra xem người dùng có được phép truy cập vào route hay không
    // Phương thức này sẽ kiểm tra xem token có hợp lệ hay không
    async canActivate(context: ExecutionContext): Promise<boolean> {

        // Lấy request từ context
        // context là một đối tượng chứa thông tin về request và response
        const request = context.switchToHttp().getRequest()

        // Lấy token từ header của request
        // request.headers['authorization'] là một thuộc tính chứa thông tin về header của request
        const token = this.extractTokenFromHeader(request)

        // Nếu không có token, ném ra lỗi UnauthorizedException
        if (!token) {
            throw new UnauthorizedException()
        }

        // Kiểm tra token có hợp lệ hay không
        try {

            // verifyAsync là một phương thức của JwtService để xác thực token
            const payload = await this.jwtService.verifyAsync(token, {

                // secret là một chuỗi bí mật được sử dụng để mã hóa và giải mã token
                secret: this.configService.get<string>('SECRET'),
            })

            // Nếu token hợp lệ, gán payload vào request.user_data
            request['user_data'] = payload
        } catch {
            throw new UnauthorizedException()
        }

        // Nếu token hợp lệ, trả về true để cho phép truy cập vào route
        return true
    }



    // Phương thức này sẽ lấy token từ header của request
    private extractTokenFromHeader(request: Request): string | undefined {

        // Lấy token từ header của request
        // request.headers['authorization'] là một thuộc tính chứa thông tin về header của request
        const [type, token] = request.headers['authorization']?.split(' ') || []

        // Nếu không có token, trả về undefined
        // Nếu có token, trả về token
        return type === 'Bearer' ? token : undefined
    }
}