import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PriceHistory } from './entities/price-history.entity';
import { Symbol } from 'src/symbol/entities/symbol.entity';

@Injectable()
export class PriceCollectorService {
  private readonly logger = new Logger(PriceCollectorService.name);

  constructor(
    @InjectModel(PriceHistory.name)
    private readonly priceHistoryModel: Model<PriceHistory>,
    @InjectModel(Symbol.name)
    private readonly symbolModel: Model<Symbol>,
  ) {}

  // هر ساعت یک نمونه ذخیره کن (می‌تونی تغییرش بدی)
  @Cron(CronExpression.EVERY_HOUR)
  async collect() {
    const symbols = await this.symbolModel.find().lean();
    const now = new Date();

    const docs = symbols.map((s) => ({
      symbol: s.symbol,
      price: s.last,
      ts: now,
    }));

    if (docs.length) {
      await this.priceHistoryModel.insertMany(docs, { ordered: false });
      this.logger.debug(
        `Inserted ${docs.length} price history docs at ${now.toISOString()}`,
      );
    }
  }
}
