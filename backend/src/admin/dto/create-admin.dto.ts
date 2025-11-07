import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsMobilePhone,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  IsIn,
} from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ default: 'masoud', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ default: 'zarjani', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ default: 'masoud.mail.info@gmail.com', required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ default: '09335545256', required: true })
  @IsMobilePhone('fa-IR')
  mobile: string;

  @ApiProperty({ default: 'M123456789@', required: true })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message:
      'رمز عبور باید حداقل 8 کاراکتر و شامل حداقل یک حرف بزرگ، یک حرف کوچک و یک عدد باشد.',
  })
  password: string;

  @ApiProperty({ default: 'Admin', required: true })
  @IsString()
  @IsIn(['Admin', 'SuperAdmin'], { message: 'نوع ادمین نامعتبر است.' })
  type: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  imagePath?: string;
}
