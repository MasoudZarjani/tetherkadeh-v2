import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SetEmailDto {
  @ApiProperty({ default: 'masoud.mail.info@gmail.com', required: true })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
