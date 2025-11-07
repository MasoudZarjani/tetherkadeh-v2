import { IsDefined, IsEnum, IsNumber, IsString } from 'class-validator';
import { OrderSide } from '../enums/OrderSide.enum';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    enum: OrderSide,
    description: 'نوع سفارش (خرید یا فروش)',
    required: true,
  })
  @IsEnum(OrderSide, { message: 'side باید یکی از مقادیر مجاز باشد.' })
  side: OrderSide;

  @ApiProperty({ default: 12345, description: 'مقدار سفارش', required: true })
  @Type(() => Number)
  @IsNumber()
  @IsDefined({ message: 'وارد کردن مقدار سفارش الزامی است.' })
  amount: number;
}
