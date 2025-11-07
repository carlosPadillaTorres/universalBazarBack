import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Render usa la variable PORT, no APP_PORT
  const port = process.env.PORT || process.env.APP_PORT || 1211;
  
  const app = await NestFactory.create(AppModule);

  // Habilitar validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades que no están en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades extra
      transform: true, // Transforma los datos al tipo especificado
      transformOptions: {
        enableImplicitConversion: true, // Convierte tipos automáticamente
      },
    }),
  );

  // Habilitar CORS para producción
  app.enableCors({
    origin: [process.env.FRONTEND_URL || '*', 'http://localhost:1212'],
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
