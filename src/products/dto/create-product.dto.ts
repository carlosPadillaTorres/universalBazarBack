import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
  ArrayMinSize,
  ValidateNested,
  MinLength,
} from 'class-validator';
import { ReviewDto } from './review.dto';
import { MetaDto } from './meta.dto';

class DimensionsDto {
  @IsNumber()
  width: number;

  @IsNumber()
  height: number;

  @IsNumber()
  depth: number;
}

export class CreateProductDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercentage?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => DimensionsDto)
  dimensions?: DimensionsDto;

  @IsOptional()
  @IsString()
  warrantyInformation?: string;

  @IsOptional()
  @IsString()
  shippingInformation?: string;

  @IsOptional()
  @IsString()
  availabilityStatus?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReviewDto)
  reviews?: ReviewDto[];

  @IsOptional()
  @IsString()
  returnPolicy?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  minimumOrderQuantity?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => MetaDto)
  meta?: MetaDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsString()
  thumbnail?: string;
}