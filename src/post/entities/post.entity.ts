import { Category } from 'src/category/entities/categoty-entity'
import { User } from 'src/user/entities/user.entity'
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { CreateDateColumn, UpdateDateColumn } from 'typeorm'

// Entity là một decorator được sử dụng để đánh dấu một lớp là một thực thể trong cơ sở dữ liệu
@Entity()
export class Post {
  // PrimaryGeneratedColumn là một decorator được sử dụng để đánh dấu một trường là khóa chính tự động tăng
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  thumbnail: string

  @Column({ type:"int", default: 1 })
  status: number

  /// ManyToOne là một decorator được sử dụng để định nghĩa mối quan hệ nhiều-một giữa các thực thể
  @ManyToOne(() => User, (user) => user.posts)
  user: User

  //// ManyToOne là một decorator được sử dụng để định nghĩa mối quan hệ nhiều-một giữa các thực thể
  @ManyToOne(() => Category, (category) => category.posts)
  category: Category
  
  // CreateDateColumn là một decorator được sử dụng để tự động tạo thời gian khi bản ghi được tạo
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date

  // UpdateDateColumn là một decorator được sử dụng để tự động cập nhật thời gian khi bản ghi được cập nhật
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date
}
