import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './entities/product.entity';

const ProductSchemaData ={
  name: Product.name,
  schema: ProductSchema,
};

@Module({
  imports: [MongooseModule.forFeature([ProductSchemaData])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
