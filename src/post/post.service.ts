import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/user/entities/user.entity'
import { Repository } from 'typeorm'
import { Post } from './entities/post.entity'
import { CreatePostDto } from './dto/create-post.dto'

@Injectable()
export class PostService {
    constructor(

        // Tự động tiêm vào repository của TypeORM cho entity User
        // @InjectRepository(User) là một decorator của NestJS cho phép bạn tiêm vào repository cho một entity cụ thể
        @InjectRepository(User)
         // Repository<User> là một lớp của TypeORM cho phép bạn tương tác với cơ sở dữ liệu
        // Nó cho phép bạn thực hiện các thao tác CRUD (Create, Read, Update, Delete) trên entity User
        private userRepository: Repository<User>,

        @InjectRepository(Post)
        private postRepository: Repository<Post>
    ) { }



    // Tạo mới bài viết
    async create(userId: number, createPostDto: CreatePostDto): Promise<Post> {

        // Tìm kiếm người dùng theo id
        const user = await this.userRepository.findOneBy({ id: userId })

        // Nếu không tìm thấy người dùng, ném ra lỗi 401
        if (!user) {
            throw new HttpException("User không tồn tại", HttpStatus.UNAUTHORIZED)
        }
    
        // Nếu tìm thấy người dùng, tạo mới bài viết
        try {
            // Lưu bài viết vào cơ sở dữ liệu
            const res = await this.postRepository.save({
                ...createPostDto,
                user
            })
    
            /// Tìm kiếm bài viết theo id
            const post = await this.postRepository.findOneBy({ id: res.id })
    
            // Nếu không tìm thấy bài viết, ném ra lỗi 500
            if (!post) {
                throw new HttpException("Không tìm thấy bài viết sau khi lưu", HttpStatus.INTERNAL_SERVER_ERROR)
            }
    
            // Trả về bài viết đã tạo
            return post
        } catch {
            throw new HttpException("Không thể tạo", HttpStatus.BAD_GATEWAY)
        }
    }
    

}
