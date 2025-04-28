import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/user/entities/user.entity'
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm'
import { Post } from './entities/post.entity'
import { CreatePostDto } from './dto/create-post.dto'
import { FilterPostDto } from './dto/filter-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'

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




    // Lấy danh sách bài viết
    async findAll(query: FilterPostDto): Promise<any> {

        // Nếu không có giá trị cho items_per_page, mặc định là 10
        const items_per_page = Number(query.items_per_page) || 10
        // Nếu không có giá trị cho page, mặc định là 1
        const page = Number(query.page) || 1
        // Tính toán số lượng bản ghi cần bỏ qua
        const skip = (page - 1) * items_per_page

        // Nếu không có giá trị cho search, mặc định là rỗng
        const keyword = query.search ? query.search : ''

        // Trả lại danh sách bài viết với các trường cần thiết
        const [res, total] = await this.postRepository.findAndCount({

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

            
            relations: {
                user: true
            },

            // Tìm kiếm theo các trường
            where: [
                { 
                    title: Like(`%${ keyword }%`)
                },
                { 
                    description: Like(`%${ keyword }%`)
                }
            ],

            // Chọn các trường cần thiết
            select: {
                user: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    avatar: true
                }
            }
        })
        
        // Nếu tổng số bản ghi = 0 thì lastPage = 1, ngược lại lastPage = tổng số bản ghi chia cho số lượng bản ghi mỗi trang
        const lastPage = Math.ceil(total / items_per_page)

        // Nếu page + 1 > lastPage thì nextPage = null, ngược lại nextPage = page + 1
        const nextPage = page + 1 > lastPage ? null : page + 1

        // Nếu page - 1 < 1 thì prevPage = null, ngược lại prevPage = page - 1
        const prevPage = page - 1 < 1 ? null : page - 1


        // Trả về dữ liệu bài viết với các trường cần thiết
        // data: danh sách bài viết
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




    // Tìm bài viết theo ID
    async findDetail(id: number): Promise<Post> {
        
        // Check nếu ID không tồn tại
        const checkId = await this.postRepository.findOne({
            where: { id },
            relations: ['user'],
            select: {
            user: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                avatar: true
            }
            }
        })
    
        // Nếu không tìm thấy bài viết, ném ra lỗi 404
        if (!checkId) {
            throw new HttpException('Không tìm thấy bài viết', HttpStatus.NOT_FOUND)
        }
    
        // Trả về bài viết đã tìm thấy
        return checkId
    }
      




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
    



    // Cập nhật bài viết
    async update(id: number, updatePostDto: UpdatePostDto): Promise<UpdateResult> {

        // Tìm kiếm bài viết theo id
        const post = await this.postRepository.findOneBy({ id })
    
        // Nếu không tìm thấy bài viết, quăng lỗi 404
        if (!post) {
            throw new HttpException('Không tìm thấy bài viết', HttpStatus.UNAUTHORIZED)
        }
    
        // travề bài viết đã cập nhật
        return await this.postRepository.update(id, updatePostDto)
    }
    



    // / Xóa bài viết
    async delete(id: number): Promise<DeleteResult> {

        // trả về bài viết đã xóa
        return await this.postRepository.delete(id)
    }
}
