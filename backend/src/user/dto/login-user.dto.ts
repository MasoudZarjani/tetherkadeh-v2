import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ default: '09335545256', required: true })
  @IsString()
  @IsNotEmpty()
  readonly user: string;
  @ApiProperty({ default: 'M123456789@', required: true })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  readonly code?: string;
}
