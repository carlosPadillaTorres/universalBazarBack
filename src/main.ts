import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Render usa la variable PORT, no APP_PORT
  const port = process.env.PORT || process.env.APP_PORT || 3000;
  
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para producción
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Bazar Universal Api')
    .setDescription("Api guide to management of products")
    .setVersion('1.0')
    .addTag('universalBazar')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}
bootstrap();
