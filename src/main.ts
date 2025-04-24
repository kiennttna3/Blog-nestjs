import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  // Tạo một ứng dụng NestJS mới từ AppModule
  // NestFactory.create() là một phương thức tĩnh của lớp NestFactory, được sử dụng để tạo một ứng dụng NestJS mới.
  const app = await NestFactory.create(AppModule)

  // Thiết lập thông tin cho tài liệu Swagger
  // DocumentBuilder là một lớp trong thư viện @nestjs/swagger, được sử dụng để xây dựng tài liệu Swagger cho ứng dụng NestJS.
  const config = new DocumentBuilder()
    .setTitle('API RESTful với NestJS và TypeORM')
    .setDescription('API RESTful với NestJS và TypeORM')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Users')
    .addBearerAuth()
    .build()

    // Tạo tài liệu Swagger từ ứng dụng NestJS và cấu hình đã thiết lập ở trên
    // SwaggerModule.createDocument() là một phương thức tĩnh của lớp SwaggerModule, được sử dụng để tạo tài liệu Swagger từ ứng dụng NestJS và cấu hình đã thiết lập ở trên.
    const document = SwaggerModule.createDocument(app, config)

  // Thiết lập đường dẫn cho tài liệu Swagger
  // SwaggerModule.setup() là một phương thức tĩnh của lớp SwaggerModule, được sử dụng để thiết lập đường dẫn cho tài liệu Swagger.
    SwaggerModule.setup('api', app, document)
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
