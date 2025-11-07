import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CheckToken2FV {
  @ApiProperty({
    default: '123456',
    required: true,
    description: 'کد تایید دو مرحله‌ای (معمولاً 6 رقمی)',
  })
  @IsString()
  @IsNotEmpty({ message: 'کد تایید نباید خالی باشد.' })
  @Length(6, 6, { message: 'کد تایید باید دقیقاً 6 کاراکتر باشد.' })
  @Matches(/^\d+$/, { message: 'کد تایید فقط باید شامل اعداد باشد.' })
  readonly code: string;
}
