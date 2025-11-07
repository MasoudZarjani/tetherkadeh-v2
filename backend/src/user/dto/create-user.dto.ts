import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ default: '09335545256', required: true })
  @IsString()
  @IsNotEmpty()
  user: string;
  @ApiProperty({ default: 'M123456789@', required: true })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
  password: string;
  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  invitedBy?: string;
}
