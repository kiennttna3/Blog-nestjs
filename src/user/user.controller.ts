import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { User } from './entities/user.entity'
import { AuthGuard } from 'src/auth/auth.guard'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('users')
export class UserController {

    
    // Tự động tiêm vào UserService
    // UserService là một lớp dịch vụ của NestJS cho phép bạn thực hiện các thao tác CRUD (Create, Read, Update, Delete) trên entity User
    constructor(private userService: UserService) { }
    



    // Sử dụng AuthGuard để bảo vệ các route này
    // AuthGuard là một lớp bảo vệ của NestJS cho phép bạn kiểm tra quyền truy cập của người dùng
    @UseGuards(AuthGuard)

    // Đánh dấu route này là GET
    // @Get() là một decorator của NestJS cho phép bạn định nghĩa route GET
    @Get()

    // Tìm tất cả người dùng
    // findAll() là một phương thức của UserService cho phép bạn tìm tất cả người dùng
    // Promise<User[]> là một kiểu dữ liệu trả về của phương thức này
    findAll(): Promise<User[]> {
        // Gọi phương thức findAll() của UserService để tìm tất cả người dùng
        // Trả về danh sách người dùng
        return this.userService.findAll()
    }




    // Sử dụng AuthGuard để bảo vệ các route này
    // AuthGuard là một lớp bảo vệ của NestJS cho phép bạn kiểm tra quyền truy cập của người dùng
    @UseGuards(AuthGuard)

    // Đánh dấu route này là GET
    // @Get(':id') là một decorator của NestJS cho phép bạn định nghĩa route GET với tham số id
    @Get(':id')

    // Tìm người dùng theo ID
    // findOne() là một phương thức của UserService cho phép bạn tìm người dùng theo ID
    findOne(@Param('id') id: string): Promise<User> {
        // Gọi phương thức findOne() của UserService để tìm người dùng theo ID
        // Trả về dữ liệu người dùng
        return this.userService.findOne(Number(id))
    }




    // Sử dụng AuthGuard để bảo vệ các route này
    // AuthGuard là một lớp bảo vệ của NestJS cho phép bạn kiểm tra quyền truy cập của người dùng
    @UseGuards(AuthGuard)

    // Đánh dấu route này là POST
    // @Post() là một decorator của NestJS cho phép bạn định nghĩa route POST
    @Post()

    // Tạo mới người dùng
    // create() là một phương thức của UserService cho phép bạn tạo mới người dùng
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        // Gọi phương thức create() của UserService để tạo mới người dùng
        // Trả về dữ liệu người dùng mới
        return this.userService.create(createUserDto)
    }




    // Sử dụng AuthGuard để bảo vệ các route này
    // AuthGuard là một lớp bảo vệ của NestJS cho phép bạn kiểm tra quyền truy cập của người dùng
    @UseGuards(AuthGuard)

    // Đánh dấu route này là PUT
    // @Put(':id') là một decorator của NestJS cho phép bạn định nghĩa route PUT với tham số id
    @Put(':id')

    // Cập nhật thông tin người dùng
    // update() là một phương thức của UserService cho phép bạn cập nhật thông tin người dùng
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        // Gọi phương thức update() của UserService để cập nhật thông tin người dùng
        // Trả về dữ liệu đã cập nhật (mới và cũ)
        return this.userService.update(Number(id), updateUserDto)
    }




    // Sử dụng AuthGuard để bảo vệ các route này
    // AuthGuard là một lớp bảo vệ của NestJS cho phép bạn kiểm tra quyền truy cập của người dùng
    @UseGuards(AuthGuard)

    // Đánh dấu route này là DELETE
    // @Delete(':id') là một decorator của NestJS cho phép bạn định nghĩa route DELETE với tham số id
    @Delete(':id')
    
    // Xóa người dùng
    // delete() là một phương thức của UserService cho phép bạn xóa người dùng
    delete(@Param('id') id: string) {
        // Gọi phương thức delete() của UserService để xóa người dùng
        // Trả về dữ liệu đã xóa
        return this.userService.delete(Number(id))
    }
}
