import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';
import { MongoConnection } from './config/db.config';

@Module({
  imports: [ProductsModule, SalesModule, MongoConnection],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
