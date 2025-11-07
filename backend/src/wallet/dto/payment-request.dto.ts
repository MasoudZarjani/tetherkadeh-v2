import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PaymentRequestDto {
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
  @IsNotEmpty()
  @IsString()
  readonly bankAccount: string;
}
