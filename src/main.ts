import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Real World')
    .setDescription('Real World API NestJS Documentation')
    .setVersion('1.0')
    // .addTag('api')
    // .addBearerAuth(
    //   {
    //     type: 'http',
    //     scheme: 'bearer',
    //     bearerFormat: 'JWT',
    //   },
    //   'Authorization'
    // )
    .addSecurity('custom-token', {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization', // header key
      description: 'Enter token as: Token {{token}}',
    })
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json', // http://localhost:3000/swagger/json
    swaggerOptions: {
      defaultModelsExpandDepth: -1, // hide schemas
    }
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
