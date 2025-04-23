import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { DeleteResult, Like, Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { FilterUserDto } from './dto/filter-user.dto'

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
    async findAll(query: FilterUserDto): Promise<any> {

        // Nếu không có giá trị cho items_per_page, mặc định là 10
        const items_per_page = Number(query.items_per_page) || 10
        // Nếu không có giá trị cho page, mặc định là 1
        const page = Number(query.page) || 1
        // Tính toán số lượng bản ghi cần bỏ qua
        const skip = (page - 1) * items_per_page

        // Nếu không có giá trị cho search, mặc định là rỗng
        const keyword = query.search ? query.search : ''

        // Trả lại danh sách người dùng với các trường cần thiết
        const [res, total] = await this.userRepository.findAndCount({

            // Sắp xếp theo trường created_at giảm dần
            order: {
                created_at: 'DESC'
            },

            // Giới hạn số lượng bản ghi trả về
            // Số lượng bản ghi cần lấy
            take: items_per_page,

            // Bỏ qua số lượng bản ghi đã lấy
            // Số lượng bản ghi cần bỏ qua
            skip: skip,

            // Tìm kiếm theo các trường first_name, last_name, email
            where: [
                { 
                    first_name: Like(`%${ keyword }%`)
                },
                { 
                    last_name: Like(`%${ keyword }%`)
                },
                { 
                    email: Like(`%${ keyword }%`)
                },
            ],

            // Chọn các trường cần thiết
            select: ['id', 'first_name', 'last_name', 'email', 'status', 'created_at', 'updated_at'],
        })
        
        // Nếu tổng số bản ghi = 0 thì lastPage = 1, ngược lại lastPage = tổng số bản ghi chia cho số lượng bản ghi mỗi trang
        const lastPage = Math.ceil(total / items_per_page)

        // Nếu page + 1 > lastPage thì nextPage = null, ngược lại nextPage = page + 1
        const nextPage = page + 1 > lastPage ? null : page + 1

        // Nếu page - 1 < 1 thì prevPage = null, ngược lại prevPage = page - 1
        const prevPage = page - 1 < 1 ? null : page - 1


        // Trả về dữ liệu người dùng với các trường cần thiết
        // data: danh sách người dùng
        // currenPage: trang hiện tại
        // items_per_page: số lượng bản ghi mỗi trang
        // total: tổng số bản ghi
        // last_page: trang cuối cùng
        // next_page: trang tiếp theo
        // prev_page: trang trước đó
        return {
            data: res,
            currenPage: page,
            items_per_page: items_per_page,
            total: total,
            last_page: lastPage,
            next_page: nextPage,
            prev_page: prevPage
        }
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
