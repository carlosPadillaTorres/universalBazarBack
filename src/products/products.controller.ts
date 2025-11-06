import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }


  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Get(':name')
  findOneByName(@Param('name') id: string) {
    return this.productsService.findOne(+id);
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // Usando swagger

  @Get('sales')
    @ApiOperation({ summary: ' Get all registered products' })
    @ApiResponse({ status: 200, description: 'Returns the list of products' })
      async findAll() {
    return this.productsService.findAll();
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
