import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyPaymentDto {
  @IsString()
  @IsNotEmpty()
  readonly status: string;
  @IsString()
  @IsNotEmpty()
  readonly trackId: string;
  @IsString()
  @IsNotEmpty()
  readonly orderId: string;
}
