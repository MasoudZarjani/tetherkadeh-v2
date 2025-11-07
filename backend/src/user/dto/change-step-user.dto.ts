import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserTypeAuth } from '../enums/UserTypeAuth.enum';

export class ChangeStepUserDto {
  @ApiProperty({ default: 'Step1', required: true })
  @IsString()
  @IsNotEmpty()
  readonly step: UserTypeAuth;
}
