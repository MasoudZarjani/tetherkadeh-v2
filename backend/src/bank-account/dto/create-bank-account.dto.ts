import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateBankAccountDto {
  @ApiProperty({
    default: '6362141112818068',
    required: true,
    description: 'شماره کارت ۱۶ رقمی بانکی (فقط عدد بدون فاصله)',
  })
  @IsString()
  @IsNotEmpty({ message: 'شماره کارت الزامی است.' })
  @Matches(/^\d{16}$/, {
    message: 'شماره کارت باید دقیقا ۱۶ رقم عددی باشد.',
  })
  readonly cardNumber: string;
}
