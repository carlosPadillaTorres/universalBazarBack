import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@ApiTags('Sales')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post('add')
  @ApiOperation({ summary: 'Register a new sale (purchase)' })
  @ApiResponse({ status: 201, description: 'Sale registered' })
  @ApiResponse({ status: 400, description: 'Validation error or bad request' })
  async add(@Body() createSaleDto: CreateSaleDto) {
    try {
      return await this.salesService.create(createSaleDto);
    } catch (error) {
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: error.message }, HttpStatus.BAD_REQUEST, { cause: error });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all sales (purchases) registered' })
  @ApiResponse({ status: 200, description: 'List of sales' })
  async findAll() {
    return await this.salesService.findAll();
  }
}
