import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ default: '09335545256', required: true })
  @IsString()
  @IsNotEmpty()
  user: string;
  @ApiProperty({ default: 'M123456789@', required: false })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
  password: string;
}
