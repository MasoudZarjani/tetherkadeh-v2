import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PriceHistoryService } from './price-history.service';
import { PriceHistoryController } from './price-history.controller';
import { PriceCollectorService } from './price-collector.service';
import { PriceHistory, PriceHistorySchema } from './entities/price-history.entity';
import { Symbol, SymbolSchema } from 'src/symbol/entities/symbol.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PriceHistory.name, schema: PriceHistorySchema },
      { name: Symbol.name, schema: SymbolSchema },
    ]),
  ],
  providers: [PriceHistoryService, PriceCollectorService],
  controllers: [PriceHistoryController],
  exports: [PriceHistoryService],
})
export class PriceHistoryModule {}