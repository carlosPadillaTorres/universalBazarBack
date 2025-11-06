import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './entities/product.entity';
import { Model } from 'mongoose';
import { NotFoundError } from 'rxjs';

@Injectable()
export class ProductsService {

  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>
  ) {}

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  async findAll() {
    console.log('🔍 Buscando productos en la base de datos...');
    console.log('📋 Modelo:', this.productModel.modelName);
    console.log('🗃️ Colección:', this.productModel.collection.name);
    
    const products = await this.productModel.find().exec();
    console.log(`📦 Encontrados ${products.length} productos`);
    
    if (products.length > 0) {
      console.log('📝 Primer producto:', JSON.stringify(products[0], null, 2));
    }
    
    if (!products || products.length === 0) {
      console.log('⚠️ No se encontraron productos');
      throw new BadRequestException('No products found in database');
    }
    
    return products;
  }
  
  findOneByName(name: string) {
    if (!name || name.trim() === '') {
      throw new BadRequestException('Invalid name format');
    }
    const productFound =   this.productModel.findOne({ title: name }).exec();
    if (!productFound)  {
      throw new BadRequestException('Product not found');
    }
    return productFound;
  }

  findOne(id: number) {
    if (isNaN(id) || typeof id !== 'number') {
      throw new BadRequestException('Invalid ID format');
    }
    const productFound =   this.productModel.findOne({ id }).exec();
    if (!productFound)  {
      throw new BadRequestException('Product not found');
    }
    return productFound;
  }



  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }
  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
