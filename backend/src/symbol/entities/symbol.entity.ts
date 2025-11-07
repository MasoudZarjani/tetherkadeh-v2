import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SymbolDocument = Symbol & Document;

@Schema({ timestamps: true })
export class Symbol {
  @Prop({ default: null, trim: true })
  name: string;
  @Prop({ default: null, trim: true })
  persianName: string;
  @Prop({ default: null, trim: true })
  slug: string;
  @Prop({ required: true, unique: true })
  symbol: string;
  @Prop({ default: 0 })
  last: number;
  @Prop({ default: 0 })
  high: number;
  @Prop({ default: 0 })
  low: number;
  @Prop({ default: null, trim: true })
  diff24d: string;
  @Prop({ default: null, trim: true })
  diff7d: string;
  @Prop({ default: null, trim: true })
  diff30d: string;
  @Prop({ default: 0 })
  last7d: number;
  @Prop({ default: 0 })
  last24h: number;
  @Prop({ default: 0 })
  last30d: number;
  @Prop({ default: '', trim: true })
  imagePath: string;
  @Prop({ default: 0 })
  buyingPriceGap: number;
  @Prop({ default: 0 })
  sellingPriceGap: number;
  @Prop({ default: 0 })
  sellingPriceGapPercentage: number;
  @Prop({ default: 0 })
  buyingPriceGapPercentage: number;
  @Prop({ default: 0 })
  numberOfDecimalPlaces: number;
  @Prop({ default: false })
  status: boolean;
  @Prop({ default: '', trim: true })
  externalExchange: string;
}

export const SymbolSchema = SchemaFactory.createForClass(Symbol);
