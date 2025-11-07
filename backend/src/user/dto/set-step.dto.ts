import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRequestAuth } from '../enums/UserRequestAuth.enum';

export class SetStepDto {
  @ApiProperty({ default: 'Step1', required: true })
  @IsString()
  @IsNotEmpty()
  readonly step: UserRequestAuth;
  @IsString()
  @IsOptional()
  readonly reason: string;
}
