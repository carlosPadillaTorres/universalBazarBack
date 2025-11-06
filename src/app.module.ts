import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { MongoConnection } from './config/db.config';

@Module({
  imports: [ProductsModule, MongoConnection],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
