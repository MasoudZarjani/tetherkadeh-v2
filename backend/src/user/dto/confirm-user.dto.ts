import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ConfirmUserDto {
  @ApiProperty({ default: '09335545256', required: true })
  @IsString()
  @IsNotEmpty()
  readonly user: string;
  @ApiProperty({ default: '12345', required: true })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  readonly code: string;
}
