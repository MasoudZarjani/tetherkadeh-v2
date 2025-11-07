import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddNoteUserDto {
  @ApiProperty({ default: '', required: true })
  @IsString()
  @IsNotEmpty()
  readonly note: string;
}
