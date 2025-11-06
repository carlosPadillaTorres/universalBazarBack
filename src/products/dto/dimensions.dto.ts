import {IsNumber} from 'class-validator';

class DimensionsDto {
  @IsNumber()
  width: number;

  @IsNumber()
  height: number;

  @IsNumber()
  depth: number;
}
