import { PartialType } from '@nestjs/mapped-types';
import { CreateAnnouncementDto } from './create-announcement.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAnnouncementDto extends PartialType(CreateAnnouncementDto) {
  @ApiProperty({ default: '123456', required: true })
  @IsNotEmpty()
  @IsString()
  id: string;
}
