import { Type } from 'class-transformer';
import { IsDateString, IsEmail, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min, ValidateNested } from 'class-validator';

class BuyerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  address?: string;
}

class ProductSnapshotDto {
  @IsOptional()
  @IsInt()
  productId?: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsOptional()
  @IsString()
  sku?: string;
}

export class CreateSaleDto {
  @IsOptional()
  @IsInt()
  saleId?: number;

  @ValidateNested()
  @Type(() => ProductSnapshotDto)
  product: ProductSnapshotDto;

  @IsInt()
  @Min(1)
  quantity: number;

  @ValidateNested()
  @Type(() => BuyerDto)
  buyer: BuyerDto;

  @IsNumber()
  @IsPositive()
  totalPrice: number;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
