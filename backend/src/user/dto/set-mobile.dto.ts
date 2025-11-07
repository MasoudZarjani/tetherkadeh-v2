import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Matches } from 'class-validator';

export class SetMobileDto {
  @ApiProperty({ default: '09335545256', required: false })
  @IsOptional()
  @Matches(/^09\d{9}$/)
  readonly mobile: string;
}
