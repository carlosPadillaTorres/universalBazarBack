import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }



@Get('byId/:id')
 async  findOneById(@Param('id') id: string) {
  try {
    await this.productsService.findOne(+id);
  } catch (error) {
    throw new HttpException({
      status: HttpStatus.FORBIDDEN,
      error: 'Incorrect ID format',
    }, HttpStatus.FORBIDDEN, {
      cause: error
    });
  }
}


  @Get('byName/:name')
  async findOneByName(@Param('name') name: string) {
    try {
      await this.productsService.findOneByName(name);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Incorrect name format',
      }, HttpStatus.FORBIDDEN, {
        cause: error
      });
    }
  }

  @Post('create')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get('sales')
  @ApiOperation({ summary: ' Get all registered products' })
  @ApiResponse({ status: 200, description: 'Returns the list of products' })
  findAllSales() {
    try {
      return this.productsService.findAll();
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Error fetching products',
      }, HttpStatus.FORBIDDEN, {
        cause: error
      });
    }
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
