import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty } from "class-validator"

export class LoginUserDto {

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
}