import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class RegisterUserDto {
    // @ApiProperty là một decorator của NestJS cho phép bạn định nghĩa các thuộc tính của lớp DTO
    @ApiProperty()
    first_name: string

    // @ApiProperty là một decorator của NestJS cho phép bạn định nghĩa các thuộc tính của lớp DTO
    @ApiProperty()
    last_name: string

    // @ApiProperty là một decorator của NestJS cho phép bạn định nghĩa các thuộc tính của lớp DTO
    @ApiProperty()
    // @IsNotEmpty là một decorator của class-validator cho phép bạn xác thực rằng thuộc tính này không được để trống
    @IsNotEmpty()
    // @IsEmail là một decorator của class-validator cho phép bạn xác thực rằng thuộc tính này là một địa chỉ email hợp lệ
    @IsEmail()
    email: string

    // @ApiProperty là một decorator của NestJS cho phép bạn định nghĩa các thuộc tính của lớp DTO
    @ApiProperty()
    // @IsNotEmpty là một decorator của class-validator cho phép bạn xác thực rằng thuộc tính này không được để trống
    @IsNotEmpty()
    password: string

    // @ApiProperty là một decorator của NestJS cho phép bạn định nghĩa các thuộc tính của lớp DTO
    @ApiProperty()
    status: number
}