import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateNetworkDto {
  @ApiProperty({ default: 'TRON', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ default: 'ترون', required: true })
  @IsString()
  @IsNotEmpty()
  persianName: string;

  @ApiProperty({ default: 'tron', required: true })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ default: '', required: true })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  destinationTag?: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  imagePath?: string;

  @ApiProperty({ default: false, required: false })
  @IsOptional()
  @IsBoolean()
  status?: boolean = false;

  @ApiProperty({ default: 10, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minDeposit?: number = 10;

  @ApiProperty({ default: 10, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minWithdraw?: number = 10;

  @ApiProperty({ default: 2, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  numberOfDecimal?: number = 2;

  @ApiProperty({ default: 2, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  withdrawFee?: number = 2;

  @ApiProperty({ default: false, required: false })
  @IsOptional()
  @IsBoolean()
  isWithdraw?: boolean = false;

  @ApiProperty({ default: false, required: false })
  @IsOptional()
  @IsBoolean()
  isDeposit?: boolean = false;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  messageWithdraw?: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  messageDeposit?: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  symbol?: string;
}
