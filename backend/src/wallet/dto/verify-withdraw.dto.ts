import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyWithdrawDto {
  @ApiProperty({ default: '', required: true })
  @IsString()
  @IsNotEmpty()
  readonly walletId: string;
  @ApiProperty({ default: '', required: true })
  @IsString()
  @IsNotEmpty()
  readonly code: string;
}
