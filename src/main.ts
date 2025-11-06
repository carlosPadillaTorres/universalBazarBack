import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
if (!process.env.APP_PORT) {
  process.env.APP_PORT = '1211';
}
const app = await NestFactory.create(AppModule);

const config = new DocumentBuilder()
    .setTitle('Bazar Universal Api')
    .setDescription("Api guide to management of products")
    .setVersion('1.0')
    .addTag('universalBazar')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.APP_PORT);
}
bootstrap();
