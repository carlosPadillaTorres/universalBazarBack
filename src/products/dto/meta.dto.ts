import { IsDateString, IsOptional, IsString } from "class-validator";

export class MetaDto {
  @IsOptional()
  @IsDateString()
  createdAt?: string;

  @IsOptional()
  @IsDateString()
  updatedAt?: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsString()
  qrCode?: string;
}
