import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class WithdrawRequestDto {
  @ApiProperty({ default: 'IRT', required: true })
  @IsString()
  @IsNotEmpty()
  readonly coin: string;
  @ApiProperty({ default: 1000000, required: true })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly amount: number;
  @ApiProperty({ default: '', required: true })
  @IsString()
  @IsOptional()
  readonly bankAccount: string;
  @ApiProperty({ default: '', required: false })
  @IsString()
  @IsOptional()
  readonly network: string;
  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  readonly address: string;
  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  readonly destinationTag: string;
}
