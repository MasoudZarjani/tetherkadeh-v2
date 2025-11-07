import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { WalletStatus } from '../enums/WalletStatus.enum';

export class ChangeStatusWalletDto {
  @ApiProperty({ default: '', required: true })
  @IsString()
  @IsNotEmpty()
  readonly status: WalletStatus;
  @ApiProperty({ default: '', required: false })
  @IsString()
  @IsOptional()
  readonly trackingCode: string;
  @ApiProperty({ default: '', required: false })
  @IsString()
  @IsOptional()
  readonly transactionId: string;
  @ApiProperty({ default: '', required: true })
  @IsString()
  @IsNotEmpty()
  readonly walletId: string;
}
