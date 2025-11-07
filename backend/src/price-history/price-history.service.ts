import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetStatsDto, GetChartDto } from './dto/get-history.dto';
import { Timeframe } from './enums/timeframe.enum';
import { StatsResponseDto } from './dto/stats-response.dto';
import { PriceHistory } from './entities/price-history.entity';

@Injectable()
export class PriceHistoryService {
  constructor(
    @InjectModel(PriceHistory.name)
    private readonly priceHistoryModel: Model<PriceHistory>,
  ) {}

  private resolveDates(dto: {
    timeframe: Timeframe;
    from?: string;
    to?: string;
  }) {
    const to = dto.to ? new Date(dto.to) : new Date();
    let from: Date;

    switch (dto.timeframe) {
      case Timeframe.H24:
        from = new Date(to.getTime() - 24 * 60 * 60 * 1000);
        break;
      case Timeframe.D7:
        from = new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case Timeframe.D30:
        from = new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case Timeframe.CUSTOM:
        if (!dto.from)
          throw new BadRequestException('from is required for CUSTOM');
        from = new Date(dto.from);
        break;
      default:
        throw new BadRequestException('Invalid timeframe');
    }

    if (from > to) throw new BadRequestException('from must be before to');
    return { from, to };
  }

  async getStats(dto: GetStatsDto): Promise<StatsResponseDto> {
    const { symbol, timeframe } = dto;
    const { from, to } = this.resolveDates(dto);

    const [res] = await this.priceHistoryModel.aggregate([
      { $match: { symbol, ts: { $gte: from, $lte: to } } },
      { $sort: { ts: 1 } },
      {
        $group: {
          _id: null,
          openPrice: { $first: '$price' },
          latestPrice: { $last: '$price' },
        },
      },
      {
        $project: {
          _id: 0,
          openPrice: 1,
          latestPrice: 1,
          absChange: { $subtract: ['$latestPrice', '$openPrice'] },
          pctChange: {
            $cond: [
              { $eq: ['$openPrice', 0] },
              null,
              {
                $multiply: [
                  {
                    $divide: [
                      { $subtract: ['$latestPrice', '$openPrice'] },
                      '$openPrice',
                    ],
                  },
                  100,
                ],
              },
            ],
          },
        },
      },
    ]);

    if (!res) {
      return {
        symbol,
        from,
        to,
        latestPrice: null,
        openPrice: null,
        absChange: null,
        pctChange: null,
      };
    }

    return {
      symbol,
      from,
      to,
      ...res,
    };
  }

  /**
   * برگرداندن دیتای bucket بندی شده برای نمودار
   * bucket: 'minute' | 'hour' | 'day'
   */
  async getChart(dto: GetChartDto) {
    const { symbol, bucket } = dto;
    const { from, to } = this.resolveDates(dto);

    const dateTruncUnit = bucket; // چون minute/hour/day دقیقاً معادل‌های $dateTrunc هستند

    const data = await this.priceHistoryModel.aggregate([
      { $match: { symbol, ts: { $gte: from, $lte: to } } },
      {
        $addFields: {
          bucket: {
            $dateToString: {
              format: {
                minute: '%Y-%m-%dT%H:%M:00Z',
                hour: '%Y-%m-%dT%H:00:00Z',
                day: '%Y-%m-%dT00:00:00Z',
              }[dateTruncUnit],
              date: '$ts',
            },
          },
        },
      },
      {
        $group: {
          _id: '$bucket',
          open: { $first: '$price' },
          close: { $last: '$price' },
          high: { $max: '$price' },
          low: { $min: '$price' },
          avg: { $avg: '$price' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          ts: '$_id',
          open: 1,
          close: 1,
          high: 1,
          low: 1,
          avg: 1,
          count: 1,
        },
      },
    ]);

    return {
      symbol,
      from,
      to,
      bucket,
      points: data,
    };
  }
}
