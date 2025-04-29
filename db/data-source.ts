import { Category } from "src/category/entities/categoty-entity";
import { Post } from "src/post/entities/post.entity";
import { DataSourceOptions, DataSource } from "typeorm";

export const dataSourceOptions:DataSourceOptions = {
    type: "mysql",
    host: "localhost",
    port: 33061,
    username: "root",
    password: "root",
    database: "blog_nestjs",
    entities: [
        'dist/**/*.entity.js',
        Post,
        Category
    ],
    migrations: [
        'dist/db/migrations/*.js',
    ],
    synchronize: false,
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;