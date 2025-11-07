import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsMobilePhone,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  IsIn,
  IsNotEmpty,
} from 'class-validator';
import { AdminStatus } from '../enums/AdminStatus.enum';

export class UpdateAdminDto {
  @ApiProperty({ default: 'masoud', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ default: 'zarjani', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ default: 'masoud.mail.info@gmail.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ default: '09335545256', required: false })
  @IsOptional()
  @IsMobilePhone('fa-IR')
  mobile?: string;

  @ApiProperty({
    default: 'M123456789@',
    required: false,
    description:
      'رمز عبور جدید - باید حداقل 8 کاراکتر و شامل حرف بزرگ، کوچک و عدد باشد.',
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message:
      'رمز عبور باید حداقل 8 کاراکتر و شامل یک حرف بزرگ، یک حرف کوچک و یک عدد باشد.',
  })
  password?: string;

  @ApiProperty({
    default: 'OldPass123@',
    required: false,
    description: 'رمز عبور فعلی برای تأیید تغییر رمز',
  })
  @IsOptional()
  @IsString()
  oldPassword?: string;

  @ApiProperty({
    default: 'Admin',
    required: false,
    enum: ['Admin', 'SuperAdmin'],
    description: 'نوع ادمین',
  })
  @IsOptional()
  @IsString()
  @IsIn(['Admin', 'SuperAdmin'], { message: 'نوع ادمین نامعتبر است.' })
  type?: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  imagePath?: string;
}

export class ChangeStatusAdminDto {
  @IsNotEmpty()
  status: AdminStatus;
}
