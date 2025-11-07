import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserStatus } from '../enums/UserStatus.enum';

export class ChangeStatusUserDto {
  @ApiProperty({ default: 'Register', required: true })
  @IsString()
  @IsNotEmpty()
  readonly status: UserStatus;
  @IsString()
  @IsOptional()
  readonly reason: string;
}
