import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Sale, SaleDocument } from './entities/sale.entity';
import { Product, ProductDocument } from '../products/entities/product.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(Sale.name) private saleModel: Model<SaleDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createSaleDto: CreateSaleDto) {
    console.log('🛒 Registrando nueva compra...');
    console.log('📦 Payload:', JSON.stringify(createSaleDto));

    try {
      // If saleId provided, ensure uniqueness
      if (createSaleDto.saleId) {
        const exists = await this.saleModel.findOne({ saleId: createSaleDto.saleId }).exec();
        if (exists) throw new BadRequestException(`Sale with saleId '${createSaleDto.saleId}' already exists`);
      } else {
        const last = await this.saleModel.findOne().sort({ saleId: -1 }).exec();
        createSaleDto.saleId = last && last.saleId ? last.saleId + 1 : 1;
        console.log('🔢 saleId generado:', createSaleDto.saleId);
      }

      // If product.productId is provided, check product exists
      if (createSaleDto.product && createSaleDto.product.productId) {
        const prod = await this.productModel.findOne({ id: createSaleDto.product.productId }).exec();
        if (!prod) {
          throw new BadRequestException(`Referenced product id '${createSaleDto.product.productId}' not found`);
        }
        console.log('🔎 Producto referenciado encontrado en DB, mongo _id:', prod._id);
      }

      // Ensure date is set
      if (!createSaleDto.date) createSaleDto.date = new Date().toISOString();

      const created = new this.saleModel(createSaleDto as any);
      const saved = await created.save();

      console.log('✅ Compra registrada con saleId:', saved.saleId);
      return { success: true, message: 'Sale registered', data: saved };
    } catch (error) {
      console.error('❌ Error registrando compra:', error.message);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Failed to register sale');
    }
  }

  async findAll() {
    try {
      const sales = await this.saleModel.find().sort({ createdAt: -1 }).exec();
      return sales;
    } catch (error) {
      console.error('❌ Error fetching sales:', error.message);
      throw new InternalServerErrorException('Failed to fetch sales');
    }
  }
}
