import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('User with Mongo Example')
    .setDescription('Mongo DB Example with Nest JS')
    .setVersion('1.0')
    .addTag('users')
    .addTag('auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe())

  await app.listen(3000);
}
bootstrap();
