import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserTypeAuth } from '../enums/UserTypeAuth.enum';

export class SetKycDto {
  @ApiProperty({ default: 'Step1', required: true })
  @IsString()
  @IsNotEmpty()
  readonly step: UserTypeAuth;
  @ApiProperty({ default: 'مسعود', required: true })
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;
  @ApiProperty({ default: 'زرجانی', required: true })
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;
  @ApiProperty({ default: '1991-05-11', required: true })
  @IsString()
  @IsNotEmpty()
  readonly birthday: string;
  @ApiProperty({ default: '1050302745', required: true })
  @IsString()
  @IsNotEmpty()
  readonly nationalCode: string;
  @ApiProperty({ default: '9181111111', required: true })
  @IsString()
  @IsNotEmpty()
  readonly postalCode: string;
  @ApiProperty({ default: 'مشهد', required: true })
  @IsString()
  @IsNotEmpty()
  readonly address: string;
  @ApiProperty({ default: [], required: true })
  @IsNotEmpty()
  readonly docs: string[]; // Assuming docs is an array of strings representing file paths or URLs
}
