import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class ListOrderDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
  @IsOptional()
  @IsString()
  search?: string;
  @IsOptional()
  @IsString()
  sort?: string = 'createdAt';
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  order?: number = -1;
  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  side?: string = 'all';
  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  userId?: string;
}
