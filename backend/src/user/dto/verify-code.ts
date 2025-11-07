import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class VerifyCodeDto {
  @ApiProperty({ default: 123456, required: true })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  readonly code: number;
  @ApiProperty({ enum: ['email', 'mobile'], required: true })
  @IsNotEmpty()
  readonly type: 'email' | 'mobile';
}
