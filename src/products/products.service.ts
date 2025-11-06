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

  async create(createProductDto: CreateProductDto) {
    console.log('➕ Creando nuevo producto...');
    console.log('📦 Datos recibidos:', JSON.stringify(createProductDto, null, 2));

    try {
      // Verificar si el SKU ya existe (si se proporciona)
      if (createProductDto.sku) {
        const existingSku = await this.productModel.findOne({ sku: createProductDto.sku }).exec();
        if (existingSku) {
          console.log(`⚠️ SKU duplicado: ${createProductDto.sku}`);
          throw new BadRequestException(`Product with SKU '${createProductDto.sku}' already exists`);
        }
      }

      // Verificar si el ID ya existe (si se proporciona)
      if (createProductDto.id) {
        const existingId = await this.productModel.findOne({ id: createProductDto.id }).exec();
        if (existingId) {
          console.log(`⚠️ ID duplicado: ${createProductDto.id}`);
          throw new BadRequestException(`Product with ID '${createProductDto.id}' already exists`);
        }
      } else {
        // Si no se proporciona ID, generar uno automáticamente
        const lastProduct = await this.productModel.findOne().sort({ id: -1 }).exec();
        createProductDto.id = lastProduct && lastProduct.id ? lastProduct.id + 1 : 1;
        console.log(`🔢 ID generado automáticamente: ${createProductDto.id}`);
      }

      // Establecer valores por defecto para meta si no se proporcionan
      if (!createProductDto.meta) {
        createProductDto.meta = {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else {
        if (!createProductDto.meta.createdAt) {
          createProductDto.meta.createdAt = new Date().toISOString();
        }
        if (!createProductDto.meta.updatedAt) {
          createProductDto.meta.updatedAt = new Date().toISOString();
        }
      }

      // Normalizar la categoría a minúsculas
      createProductDto.category = createProductDto.category.toLowerCase().trim();

      // Crear el producto
      const newProduct = new this.productModel(createProductDto);
      const savedProduct = await newProduct.save();

      console.log(`✅ Producto creado exitosamente con ID: ${savedProduct.id}`);
      console.log(`📝 MongoDB _id: ${savedProduct._id}`);

      return {
        success: true,
        message: 'Product created successfully',
        data: savedProduct,
      };

    } catch (error) {
      console.error('❌ Error al crear producto:', error.message);
      
      // Manejar errores de validación de Mongoose
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map((err: any) => ({
          field: err.path,
          message: err.message,
        }));
        throw new BadRequestException({
          message: 'Validation failed',
          errors: validationErrors,
        });
      }

      // Manejar errores de duplicados (índices únicos)
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new BadRequestException(`Duplicate value for field: ${field}`);
      }

      // Si ya es una BadRequestException, re-lanzarla
      if (error instanceof BadRequestException) {
        throw error;
      }

      // Error genérico
      throw new BadRequestException(`Failed to create product: ${error.message}`);
    }
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
