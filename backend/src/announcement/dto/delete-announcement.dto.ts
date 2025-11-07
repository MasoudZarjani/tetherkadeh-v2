import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteAnnouncementDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
