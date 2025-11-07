import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResendUserDto {
  @ApiProperty({ default: '09335545256', required: true })
  @IsString()
  @IsNotEmpty()
  readonly user: string;
}
