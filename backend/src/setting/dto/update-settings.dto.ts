import { IsNotEmpty, IsString, IsObject, IsOptional } from 'class-validator';

export class UpdateSettingDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}

export class UpdateSettingsDto {
  @IsObject()
  @IsOptional()
  settings: Record<string, any>;
}
