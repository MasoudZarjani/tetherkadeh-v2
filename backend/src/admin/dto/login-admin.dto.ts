import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class LoginAdminDto {
  @ApiProperty({
    default: 'masoud.mail.info@gmail.com',
    required: true,
    description: 'نام کاربری (ایمیل یا موبایل)',
  })
  @IsString()
  @IsNotEmpty({ message: 'وارد کردن نام کاربری الزامی است.' })
  readonly user: string;

  @ApiProperty({
    default: 'Example123',
    required: true,
    description:
      'رمز عبور باید حداقل 8 کاراکتر و شامل حداقل یک حرف بزرگ، یک حرف کوچک و یک عدد باشد.',
  })
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message:
      'رمز عبور باید حداقل 8 کاراکتر و شامل حداقل یک حرف بزرگ، یک حرف کوچک و یک عدد باشد.',
  })
  readonly password: string;
}
