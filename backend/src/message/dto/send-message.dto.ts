import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsObject } from 'class-validator';

export class SendMessageDto {
  @ApiPropertyOptional({ description: 'کاربر ارسال کننده پیام' })
  @IsNotEmpty()
  @IsObject()
  readonly user: Record<string, any>;

  @ApiProperty({
    default: 'sendTokenVerify',
    required: true,
    description: 'کد نوع پیام',
  })
  @IsString()
  @IsNotEmpty()
  readonly code: string;

  @ApiPropertyOptional({ description: 'متن پیام' })
  @IsOptional()
  @IsString()
  readonly message?: string;

  @ApiPropertyOptional({
    default: { code: '12345' },
    description: 'اطلاعات اضافی پیام',
  })
  @IsOptional()
  @IsObject()
  readonly dataMessage?: Record<string, any>;

  @ApiPropertyOptional({ description: 'ادمین مرتبط' })
  @IsOptional()
  @IsString()
  readonly admin?: string;

  @ApiPropertyOptional({ description: 'آی‌پی ارسال کننده' })
  @IsOptional()
  @IsString()
  readonly ip?: string;

  @ApiPropertyOptional({ description: 'یوزر-اجنت ارسال کننده' })
  @IsOptional()
  @IsString()
  readonly userAgent?: string;
}
