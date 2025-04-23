import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { DeleteResult, Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
    constructor(
        
        // Tự động tiêm vào repository của TypeORM cho entity User
        // @InjectRepository(User) là một decorator của NestJS cho phép bạn tiêm vào repository cho một entity cụ thể
        @InjectRepository(User)

        // Repository<User> là một lớp của TypeORM cho phép bạn tương tác với cơ sở dữ liệu
        // Nó cho phép bạn thực hiện các thao tác CRUD (Create, Read, Update, Delete) trên entity User
        private userRepository: Repository<User>
    ) { }



    // Tìm tất cả người dùng
    async findAll(): Promise<User[]> {

        // Trả lại danh sách người dùng với các trường cần thiết
        return await this.userRepository.find({
            select: ['id', 'first_name', 'last_name', 'email', 'status', 'created_at', 'updated_at'],
        })
    }



    // Tìm người dùng theo ID
    async findOne(id: number): Promise<User> {

        // Check nếu ID không tồn tại
        const checkId = await this.userRepository.findOneBy({ id })

        // Nếu không tìm thấy người dùng với ID đó, ném ra lỗi 401
        if (!checkId) {
            throw new HttpException("ID không tồn tại", HttpStatus.UNAUTHORIZED)
        }

        // Trả lại dữ liệu người dùng
        return checkId
    }



    // Tạo mới người dùng
    async create(createUserDto: CreateUserDto): Promise<User> {

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10)
        createUserDto.password = hashedPassword
        
        // Check nếu email đã tồn tại
        const checkEmail = await this.userRepository.findOneBy({ email: createUserDto.email })

        // Nếu email đã tồn tại, ném ra lỗi 401
        if (checkEmail) {
            throw new HttpException("Email đã tồn tại", HttpStatus.UNAUTHORIZED)
        }
        
        // Lưu người dùng mới vào cơ sở dữ liệu
        return await this.userRepository.save(createUserDto)
    }



    // Cập nhật thông tin người dùng
    async update(id: number, updateUserDto: UpdateUserDto): Promise<UpdateUserDto> {

        // Check nếu ID không tồn tại
        const checkId = await this.userRepository.findOneBy({ id })

        // Nếu không tìm thấy người dùng với ID đó, ném ra lỗi 401
        if (!checkId) {
            throw new HttpException("ID không tồn tại", HttpStatus.UNAUTHORIZED)
        }

        // Cập nhật người dùng vao cơ sở dữ liệu
        await this.userRepository.update({ id }, updateUserDto)

        // Trả lại dữ liệu đã cập nhật (mới và cũ)
        return {
            ...checkId,
            ...updateUserDto,
        }

    }


    
    // Xóa người dùng
    async delete(id: number): Promise<DeleteResult> {

        // Check nếu ID không tồn tại
        const checkId = await this.userRepository.findOneBy({ id })

        // Nếu không tìm thấy người dùng với ID đó, ném ra lỗi 401
        if (!checkId) {
            throw new HttpException("ID không tồn tại", HttpStatus.UNAUTHORIZED)
        }

        // Xóa người dùng ra khỏi cơ sở dữ liệu
        return await this.userRepository.delete(id)
    }
}
