import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateAdminUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ default: 'مسعود', required: false })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  readonly firstName?: string;
  @ApiProperty({ default: 'زرجانی', required: false })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  readonly lastName?: string;
  @ApiProperty({ default: 'masoud.mail.info@gmail.com', required: false })
  @IsEmail()
  @IsOptional()
  readonly email?: string;
  @ApiProperty({ default: '09335545256', required: false })
  @IsOptional()
  @Matches(/^09\d{9}$/)
  readonly mobile?: string;
  @ApiProperty({ default: '', required: false })
  @IsString()
  @IsOptional()
  readonly imagePath?: string;
  @ApiProperty({ default: '1050302745', required: false })
  @IsString()
  @IsOptional()
  readonly nationalCode?: string;
  @ApiProperty({ default: '', required: false })
  @IsString()
  @IsOptional()
  readonly birthday?: Date;
  @ApiProperty({ default: '', required: false })
  @IsString()
  @IsOptional()
  readonly address?: string;
  @ApiProperty({ default: '', required: false })
  @IsString()
  @IsOptional()
  readonly postalCode?: string;
  @ApiProperty({ default: '', required: false })
  @IsString()
  @IsOptional()
  readonly phone?: string;
  @IsBoolean()
  @IsOptional()
  twoStepVerification: boolean;
  @IsBoolean()
  @IsOptional()
  twoFactorVerification: boolean;
}
