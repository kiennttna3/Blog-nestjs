import { Post } from 'src/post/entities/post.entity'
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class User {
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

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[]

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date
}
