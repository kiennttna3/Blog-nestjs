import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Category } from './entities/categoty-entity';

@Module({
  imports: [

    // Import TypeOrmModule để sử dụng các tính năng của TypeORM
    TypeOrmModule.forFeature([Category]),
    
    // Import ConfigModule để sử dụng các biến môi trường (environment variables)
    ConfigModule
  ],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule {}
