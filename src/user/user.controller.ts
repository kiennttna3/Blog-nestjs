import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { UserService } from './user.service'
import { User } from './entities/user.entity'
import { AuthGuard } from 'src/auth/auth.guard'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { FilterUserDto } from './dto/filter-user.dto'
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { storageConfig } from 'helpers/config'
import { extname } from 'path'

// ApiBearerAuth là một decorator của NestJS cho phép bạn xác định rằng các route này yêu cầu xác thực bằng Bearer token
// Nó sẽ tự động thêm một trường Authorization vào tài liệu Swagger để bạn có thể nhập Bearer token khi gọi API
@ApiBearerAuth()
// ApiTags là một decorator của NestJS cho phép bạn nhóm các controller lại với nhau trong tài liệu Swagger
// Nó giúp bạn dễ dàng tìm kiếm và quản lý các API trong tài liệu Swagger
@ApiTags('Users')
// @Controller là một decorator của NestJS cho phép bạn định nghĩa một controller
@Controller('users')
export class UserController {

    // Tự động tiêm vào UserService
    // UserService là một lớp dịch vụ của NestJS cho phép bạn thực hiện các thao tác CRUD (Create, Read, Update, Delete) trên entity User
    constructor(
        private userService: UserService
    ) { }
    



    // Sử dụng AuthGuard để bảo vệ các route này
    // AuthGuard là một lớp bảo vệ của NestJS cho phép bạn kiểm tra quyền truy cập của người dùng
    @UseGuards(AuthGuard)
    // ApiQuery là một decorator của NestJS cho phép bạn định nghĩa các tham số truy vấn (query parameters) trong route
    // Nó giúp bạn dễ dàng tìm kiếm và quản lý các tham số truy vấn trong tài liệu Swagger
    @ApiQuery( { name: 'page' } )
    @ApiQuery( { name: 'items_per_page' } )
    @ApiQuery( { name: 'search' } )
    // Đánh dấu route này là GET
    // @Get() là một decorator của NestJS cho phép bạn định nghĩa route GET
    @Get()
    // Tìm tất cả người dùng
    // findAll() là một phương thức của UserService cho phép bạn tìm tất cả người dùng
    // Promise<User[]> là một kiểu dữ liệu trả về của phương thức này
    findAll(@Query() query: FilterUserDto): Promise<User[]> {

        // Gọi phương thức findAll() của UserService để tìm tất cả người dùng
        // Trả về danh sách người dùng
        return this.userService.findAll(query)
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




    // Đánh dấu route này là POST
    // @Post('upload-avatar') là một decorator của NestJS cho phép bạn định nghĩa route POST với tham số upload-avatar
    @Post('upload-avatar')
    // Sử dụng AuthGuard để bảo vệ các route này
    // AuthGuard là một lớp bảo vệ của NestJS cho phép bạn kiểm tra quyền truy cập của người dùng
    @UseGuards(AuthGuard)
    // UseInterceptors là một decorator của NestJS cho phép bạn xử lý các request và response trước và sau khi chúng được gửi đi
    // Sử dụng FileInterceptor để xử lý file tải lên
    // FileInterceptor là một lớp của NestJS cho phép bạn xử lý file tải lên
    @UseInterceptors(FileInterceptor('avatar', {
        // storageConfig là một hàm của bạn để cấu hình nơi lưu trữ file tải lên
        storage: storageConfig('avatar'),
        // fileFilter là một hàm của bạn để xác thực file tải lên
        fileFilter: (req, file, cb) => {
            // extname là một hàm của Node.js cho phép bạn lấy phần mở rộng của file
            const ext = extname(file.originalname)
            const allowedExtArr = ['.png', '.jpg', '.jpeg']
            if (!allowedExtArr.includes(ext)) {
                req.fileValidationError = `File không hợp lệ. Chỉ cho phép file đuôi: ${ allowedExtArr.toString() }`
                cb(null, false)
            } else {
                const fileSize = parseInt(req.headers['content-length'])
                if (fileSize > 1024 * 1024 * 5) {
                    req.fileValidationError = 'File không hợp lệ. Kích thước file tối đa là 5MB'
                    cb(null, false)
                } else {
                    cb(null, true)

                }
            }
        }
    }))
    // uploadAvatar() là một phương thức của UserService cho phép bạn tải lên ảnh đại diện
    // UploadedFile() là một decorator của NestJS cho phép bạn lấy file tải lên từ request
    uploadAvatar(@Req() req:any, @UploadedFile() file: Express.Multer.File) {
        console.log("upload")
        console.log("user data", req.user_data)
        console.log(file)

        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError)
        } if (!file) {
            throw new BadRequestException('File là bắt buộc')
        }

        // Gọi phương thức updateAvatar() của UserService để cập nhật ảnh đại diện
        // Trả về dữ liệu đã cập nhật
        this.userService.updateAvatar(req.user_data.id, file.destination + '/' + file.filename)

    }
}
