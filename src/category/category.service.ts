import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Category } from './entities/categoty-entity'
import { Like, Repository } from 'typeorm'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { FilterCategoryDto } from './dto/filter-category.dto'

@Injectable()
export class CategoryService {

    constructor(

        // Tự động tiêm vào repository của TypeORM cho entity Category
        // @InjectRepository(Category) là một decorator của NestJS cho phép bạn tiêm vào repository cho một entity cụ thể
        @InjectRepository(Category)

        // Repository<Category> là một lớp của TypeORM cho phép bạn tương tác với cơ sở dữ liệu
        // Nó cho phép bạn thực hiện các thao tác CRUD (Create, Read, Update, Delete) trên entity Category
        private categoryRepository: Repository<Category>
    ) { }



    // Tìm tất cả danh mục
    async findAll(query: FilterCategoryDto): Promise<any> {
        
        // Nếu không có giá trị cho items_per_page, mặc định là 10
        const items_per_page = Number(query.items_per_page) || 10
        // Nếu không có giá trị cho page, mặc định là 1
        const page = Number(query.page) || 1
        // Tính toán số lượng bản ghi cần bỏ qua
        const skip = (page - 1) * items_per_page
        // Nếu không có giá trị cho search, mặc định là rỗng
        const keyword = query.search ? query.search : ''
        // Trả lại danh sách danh mục với các trường cần thiết
        const [res, total] = await this.categoryRepository.findAndCount({

            // Sắp xếp theo trường created_at giảm dần
            order: {
                created_at: 'DESC'
            },

            // Giới hạn số lượng bản ghi trả về
            take: items_per_page,
            
            // Bỏ qua số lượng bản ghi đã lấy
            skip: skip,


            // Tìm kiếm theo các trường
            where: [
                { 
                    name: Like(`%${ keyword }%`)
                },
                { 
                    description: Like(`%${ keyword }%`)
                }
            ],

            // Chỉ lấy các trường cần thiết
            select: ['id', 'name', 'description', 'status', 'created_at', 'updated_at']
        })

        // Nếu tổng số bản ghi = 0 thì lastPage = 1, ngược lại lastPage = tổng số bản ghi chia cho số lượng bản ghi mỗi trang
        const lastPage = Math.ceil(total / items_per_page)

        // Nếu page + 1 > lastPage thì nextPage = null, ngược lại nextPage = page + 1
        const nextPage = page + 1 > lastPage ? lastPage : page + 1

        // Nếu page - 1 < 1 thì prevPage = null, ngược lại prevPage = page - 1
        const prevPage = page - 1 < 1 ? 1 : page - 1

        return {
            // Danh sách người dùng
            data: res,
            // Trang hiện tại
            currenPage: page,
            // Số lượng bản ghi mỗi trang
            items_per_page: items_per_page,
            // Tổng số bản ghi
            total: total,
            // Trang cuối cùng
            last_page: lastPage,
             // Trang tiếp theo
            next_page: nextPage,
            // Trang trước đó
            prev_page: prevPage
        }
    }




    // Tìm danh mục theo ID
    async findOne(id: number): Promise<Category> {
            
            // Check nếu ID không tồn tại
            const checkId = await this.categoryRepository.findOneBy( { id } )
    
            // Nếu không tìm thấy danh mục, trả về lỗi 401
            if (!checkId) {
                throw new HttpException("ID không tồn tại", HttpStatus.UNAUTHORIZED)
            }
    
            // Trả về danh mục đã tìm thấy
            return checkId
    }




    // Tạo mới danh mục
    async create(CreateCategoryDto: CreateCategoryDto): Promise<Category> {

        // Lưu danh mục mới
        return await this.categoryRepository.save(CreateCategoryDto)
    }




    // Cập nhật danh mục
    async update(
        id: number,
        updateCategoryDto: UpdateCategoryDto
    ): Promise<UpdateCategoryDto> {
        
        // Check nếu ID không tồn tại
        const checkId = await this.categoryRepository.findOneBy( { id } )

        // Nếu ID không tồn tại, trả về lỗi 401
        if (!checkId) {
            throw new HttpException("ID không tồn tại", HttpStatus.UNAUTHORIZED)
        }

        /// Cập nhật danh mục
        await this.categoryRepository.update({ id }, updateCategoryDto)

        // Trả về danh mục đã được cập nhật
        return {
            ...checkId,
            ...updateCategoryDto
        }

    }




    // Xóa danh mục
    async delete(id: number): Promise<Category> {

        // Check nếu ID không tồn tại
        const checkId = await this.categoryRepository.findOneBy( { id } )

        // Nếu ID không tồn tại, trả về lỗi 401
        if (!checkId) {
            throw new HttpException("ID không tồn tại", HttpStatus.UNAUTHORIZED)
        }

        // Xóa danh mục ra khỏi cơ sở dữ liệu
        return await this.categoryRepository.remove(checkId)
    }
}
