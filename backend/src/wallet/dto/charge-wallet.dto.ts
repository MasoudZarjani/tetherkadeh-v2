import { ApiProperty } from '@nestjs/swagger';
import { WalletTransactionType } from '../enums/WalletTransactionType';
import { WalletType } from '../enums/WalletType.enum';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ChargeWalletDto {
  @ApiProperty({ default: 'USDT', required: true })
  @IsString()
  @IsNotEmpty()
  readonly coin: string;
  @ApiProperty({ default: 'Manual', required: true })
  @IsString()
  @IsNotEmpty()
  readonly transactionType: WalletTransactionType;
  @ApiProperty({ default: 100, required: true })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly amount: number;
  @ApiProperty({ default: 'Deposit', required: true })
  @IsString()
  @IsNotEmpty()
  readonly type: WalletType;
  @ApiProperty({ default: 'شارژ حساب دستی', required: true })
  @IsString()
  @IsNotEmpty()
  readonly reason: string;
  @ApiProperty({ default: 'شارژ حساب دستی', required: true })
  @IsString()
  @IsOptional()
  readonly note: string;
  @ApiProperty({ default: '', required: true })
  @IsString()
  @IsNotEmpty()
  readonly userId: string;
}
