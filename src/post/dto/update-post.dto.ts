import { Category } from "src/category/entities/categoty-entity"

export class UpdatePostDto {
  title: string

  description: string

  thumbnail: string

  status: number

  category: Category
}