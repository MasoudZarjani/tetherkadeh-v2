import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class ListSymbolDto {
  @ApiProperty({ default: 1, required: false, description: 'شماره صفحه' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    default: 10,
    required: false,
    description: 'تعداد آیتم در هر صفحه',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    default: '',
    required: false,
    description: 'عبارت جستجو در شماره کارت یا نام',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    default: 'createdAt',
    required: false,
    description: 'فیلد مرتب‌سازی (مثلاً createdAt, cardNumber)',
  })
  @IsOptional()
  @IsString()
  sort?: string = 'createdAt';

  @ApiProperty({
    default: -1,
    required: false,
    enum: [1, -1],
    description: 'ترتیب مرتب‌سازی: 1 (صعودی), -1 (نزولی)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsIn([1, -1], { message: 'مقدار order باید 1 یا -1 باشد.' })
  order?: number = -1;
}
