import { Post } from 'src/post/entities/post.entity'
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { CreateDateColumn, UpdateDateColumn } from 'typeorm'

// Entity là một decorator được sử dụng để đánh dấu một lớp là một thực thể trong cơ sở dữ liệu
@Entity()
export class User {
  // PrimaryGeneratedColumn là một decorator được sử dụng để đánh dấu một trường là khóa chính tự động tăng
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  first_name: string

  @Column()
  last_name: string

  @Column()
  email: string

  @Column()
  password: string

  @Column({ nullable: true, default: null })
  refresh_token: string

  @Column({ nullable: true, default: null })
  avatar: string

  @Column({ default: 1 })
  status: number

  // OneToMany là một decorator được sử dụng để định nghĩa mối quan hệ một-nhiều giữa các thực thể
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[]

  // CreateDateColumn là một decorator được sử dụng để tự động tạo thời gian khi bản ghi được tạo
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date

  // UpdateDateColumn là một decorator được sử dụng để tự động cập nhật thời gian khi bản ghi được cập nhật
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date
}
