import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { CategoryService } from './category.service'
import { Category } from './entities/categoty-entity'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { AuthGuard } from 'src/auth/auth.guard'
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { FilterCategoryDto } from './dto/filter-category.dto'


// ApiBearerAuth là một decorator của NestJS cho phép bạn xác định rằng các route này yêu cầu xác thực bằng Bearer token
// Nó sẽ tự động thêm một trường Authorization vào tài liệu Swagger để bạn có thể nhập Bearer token khi gọi API
@ApiBearerAuth()
// @Controller là một decorator của NestJS cho phép bạn định nghĩa một controller
@Controller('categories')
export class CategoryController {

    // Tự động tiêm vào UserService
    // UserService là một lớp dịch vụ của NestJS cho phép bạn thực hiện các thao tác CRUD (Create, Read, Update, Delete) trên entity User
    constructor(
        private categoryService: CategoryService
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
    // Tìm tất cả danh mục
    findAll(@Query() query: FilterCategoryDto): Promise<Category[]> {

        // Gọi phương thức findAll() của CategoryService để tìm tất cả danh mục
        // Trả về danh sách danh mục đã tìm thấy
        return this.categoryService.findAll(query)
    }




    // Sử dụng AuthGuard để bảo vệ các route này
    // AuthGuard là một lớp bảo vệ của NestJS cho phép bạn kiểm tra quyền truy cập của người dùng
    @UseGuards(AuthGuard)
    // Đánh dấu route này là GET
    // @Get() là một decorator của NestJS cho phép bạn định nghĩa route GET
    @Get(':id')
    findOne(@Param('id') id: string): Promise<Category> {

        // Gọi phương thức findOne() của CategoryService để tìm danh mục theo ID
        // Trả về danh mục đã tìm thấy
        return this.categoryService.findOne(Number(id))
    }



    
    // Sử dụng AuthGuard để bảo vệ các route này
    // AuthGuard là một lớp bảo vệ của NestJS cho phép bạn kiểm tra quyền truy cập của người dùng
    @UseGuards(AuthGuard)
    // Đánh dấu route này là POST
    @Post()
    // Tạo mới danh mục
    // create() là một phương thức của CategoryService cho phép bạn tạo mới danh mục
    create(@Body() CreateCategoryDto: CreateCategoryDto): Promise<Category> {

        // Gọi phương thức create() của CategoryService để tạo mới danh mục
        // Trả về danh mục đã được tạo mới
        return this.categoryService.create(CreateCategoryDto)

    }




    // Sử dụng AuthGuard để bảo vệ các route này
    // AuthGuard là một lớp bảo vệ của NestJS cho phép bạn kiểm tra quyền truy cập của người dùng
    @UseGuards(AuthGuard)
    // Đánh dấu route này là PUT
    @Put(':id')
    /// Cập nhật danh mục theo ID
    // update() là một phương thức của CategoryService cho phép bạn cập nhật danh mục theo ID
    update(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto
    ) {

        // Gọi phương thức update() của CategoryService để cập nhật danh mục theo ID
        // Trả về danh mục đã được cập nhật
        return this.categoryService.update(Number(id), updateCategoryDto)
    }



    // Sử dụng AuthGuard để bảo vệ các route này
    // AuthGuard là một lớp bảo vệ của NestJS cho phép bạn kiểm tra quyền truy cập của người dùng
    @UseGuards(AuthGuard)
    // Đánh dấu route này là DELETE
    // @Delete(':id') là một decorator của NestJS cho phép bạn định nghĩa route DELETE với tham số id
    @Delete(':id')
    // Xóa danh mục theo ID
    // delete() là một phương thức của CategoryService cho phép bạn xóa danh mục theo ID
    delete(@Param('id') id: string): Promise<Category> {

        // Gọi phương thức delete() của CategoryService để xóa danh mục theo ID
        // Trả về danh mục đã được xóa
        return this.categoryService.delete(Number(id))
    }
}
