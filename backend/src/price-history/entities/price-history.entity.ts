// src/price-history/price-history.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  collection: 'price_histories',
  timestamps: true, // createdAt, updatedAt
})
export class PriceHistory extends Document {
  @Prop({ required: true })
  symbol: string; // e.g. 'USDT'

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, default: () => new Date() })
  ts: Date; // زمان نمونه
}

export const PriceHistorySchema = SchemaFactory.createForClass(PriceHistory);

// ایندکس‌های پرکاربرد:
PriceHistorySchema.index({ symbol: 1, ts: 1 }); // برای کوئری‌های رنج زمانی
PriceHistorySchema.index({ ts: 1 }); // اسکن سریع زمانی
PriceHistorySchema.index({ symbol: 1, ts: -1 }, { background: true });
