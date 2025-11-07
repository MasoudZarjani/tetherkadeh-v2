import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSymbolDto {
  @ApiProperty({ default: 'Tether', required: true })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ default: 'تتر', required: true })
  @IsString()
  @IsNotEmpty()
  readonly persianName: string;

  @ApiProperty({ default: 'usdt', required: true })
  @IsString()
  @IsNotEmpty()
  readonly slug: string;

  @ApiProperty({ default: 'USDT', required: true })
  @IsString()
  @IsNotEmpty()
  readonly symbol: string;

 @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly last?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly high?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly low?: number;

  @ApiProperty({ default: '0', required: false })
  @IsOptional()
  @IsString()
  readonly diff24d: string = '0';

  @ApiProperty({ default: '0', required: false })
  @IsOptional()
  @IsString()
  readonly diff7d: string = '0';

  @ApiProperty({ default: '0', required: false })
  @IsOptional()
  @IsString()
  readonly diff30d: string = '0';

  @ApiProperty({ default: 0, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly last7d: number = 0;

  @ApiProperty({ default: 0, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly last24h: number = 0;

  @ApiProperty({ default: 0, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly last30d: number = 0;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  readonly imagePath: string = '';

  @ApiProperty({ default: 0, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly buyingPriceGap: number = 0;

  @ApiProperty({ default: 0, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly sellingPriceGap: number = 0;

  @ApiProperty({ default: 0, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly sellingPriceGapPercentage: number = 0;

  @ApiProperty({ default: 0, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly buyingPriceGapPercentage: number = 0;

  @ApiProperty({ default: 2, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly numberOfDecimalPlaces: number = 2;

  @ApiProperty({ default: false, required: false })
  @IsBoolean()
  @IsOptional()
  readonly status: boolean = false;
}
