import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { AnnouncementImportance } from '../enums/AnnouncementImportance.enum';

export class CreateAnnouncementDto {
  @ApiProperty({ default: 'masoud', required: true })
  @IsNotEmpty()
  @IsString()
  title?: string;

  @ApiProperty({ default: 'masoud', required: true })
  @IsNotEmpty()
  @IsString()
  body?: string;

  @ApiProperty({ default: true, required: false })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @ApiProperty({
    enum: AnnouncementImportance,
    description: 'اهمیت اطلاعیه',
    required: true,
  })
  @IsEnum(AnnouncementImportance, {
    message: 'importance باید یکی از مقادیر مجاز باشد.',
  })
  importance: AnnouncementImportance;
}
