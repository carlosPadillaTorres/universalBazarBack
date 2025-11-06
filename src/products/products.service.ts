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

  findAll() {
    const products = this.productModel.find().exec();
    if (!products) {
      throw new BadRequestException('No products found');
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
