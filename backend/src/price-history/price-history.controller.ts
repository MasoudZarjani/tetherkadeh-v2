import { Controller, Get, Query } from '@nestjs/common';
import { PriceHistoryService } from './price-history.service';
import { GetStatsDto, GetChartDto } from './dto/get-history.dto';

@Controller('api/v1/price-history')
export class PriceHistoryController {
  constructor(private readonly service: PriceHistoryService) {}

  @Get('stats')
  getStats(@Query() dto: GetStatsDto) {
    return this.service.getStats(dto);
  }

  @Get('chart')
  getChart(@Query() dto: GetChartDto) {
    return this.service.getChart(dto);
  }
}
