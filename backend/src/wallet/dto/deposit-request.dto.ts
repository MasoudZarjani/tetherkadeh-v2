import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class DepositRequestDto {
  @ApiProperty({ default: 'USDT', required: true })
  @IsString()
  @IsNotEmpty()
  readonly coin: string;
  @ApiProperty({ default: 100, required: true })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly amount: number;
  @ApiProperty({ default: '', required: true })
  @IsString()
  @IsNotEmpty()
  readonly network: string;
  @ApiProperty({ default: '', required: true })
  @IsString()
  @IsNotEmpty()
  readonly transactionId: string;
  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  readonly address: string;
  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  readonly destinationTag: string;
}
