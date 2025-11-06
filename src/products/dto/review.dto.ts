import { IsDateString, IsEmail, IsNumber, IsString, Max, Min } from "class-validator";

export class ReviewDto {
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsString()
  comment: string;

  @IsDateString()
  date: string;

  @IsString()
  reviewerName: string;

  @IsEmail()
  reviewerEmail: string;
}
