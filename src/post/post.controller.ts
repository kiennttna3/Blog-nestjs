import { BadRequestException, Body, Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { storageConfig } from 'helpers/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { extname } from 'path';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
    constructor(
        
         // Tự động tiêm vào PostService
        // PostService là một lớp dịch vụ của NestJS cho phép bạn thực hiện các thao tác CRUD (Create, Read, Update, Delete) trên entity Use
        private postService: PostService
    ) { }




     // Sử dụng AuthGuard để bảo vệ các route này
    // AuthGuard là một lớp bảo vệ của NestJS cho phép bạn kiểm tra quyền truy cập của người dùng
    @UseGuards(AuthGuard)
    @Post()
    // UseInterceptors là một decorator của NestJS cho phép bạn xử lý các request và response trước và sau khi chúng được gửi đi
    // Sử dụng FileInterceptor để xử lý file tải lên
    // FileInterceptor là một lớp của NestJS cho phép bạn xử lý file tải lên
    @UseInterceptors(FileInterceptor('thumbnail', {
        // storageConfig là một hàm của bạn để cấu hình nơi lưu trữ file tải lên
        storage: storageConfig('post'),
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




    // Taọ mới bài viết
    // create() là một phương thức của PostService cho phép bạn tạo mới một bài viết
    // @Body() là một decorator của NestJS cho phép bạn lấy dữ liệu từ body của request
    // @UploadedFile() là một decorator của NestJS cho phép bạn lấy file tải lên từ request
    // @Req() là một decorator của NestJS cho phép bạn lấy request từ client
    create(@Req() req: any, @Body() createPostDto: CreatePostDto, @UploadedFile() file: Express.Multer.File) {
        console.log(req['user_data'])
        console.log(createPostDto)
        console.log(file)

        // Kiểm tra xem file có hợp lệ hay không
        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError)
        } if (!file) {
            throw new BadRequestException('File là bắt buộc')
        }

        // trả về dữ liệu đã tạo mới
        return this.postService.create(
            req['user_data'].id,
            {
                ...createPostDto,
                thumbnail:file.destination + '/' + file.filename
            }
        )
    }
}
