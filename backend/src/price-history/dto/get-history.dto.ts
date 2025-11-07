import {
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { Timeframe } from '../enums/timeframe.enum';

export class GetStatsDto {
  @IsString()
  symbol: string; // 'USDT'

  @IsEnum(Timeframe)
  timeframe: Timeframe;

  // برای CUSTOM
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}

export class GetChartDto {
  @IsString()
  symbol: string;

  @IsEnum(Timeframe)
  timeframe: Timeframe;

  // 'hour' | 'day' | 'minute'
  @IsString()
  bucket: 'minute' | 'hour' | 'day';

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
