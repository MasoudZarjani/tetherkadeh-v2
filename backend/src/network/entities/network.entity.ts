import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

export type NetworkDocument = Network & Document;

@Schema({ timestamps: true })
export class Network {
  @Prop({ default: null, trim: true })
  name: string;
  @Prop({ default: null, trim: true })
  persianName: string;
  @Prop({ default: null, trim: true })
  slug: string;
  @Prop({ default: null, trim: true })
  address: string;
  @Prop({ default: null, trim: true })
  destinationTag: string;
  @Prop({ default: '', trim: true })
  imagePath: string;
  @Prop({ default: false })
  status: boolean;
  @Prop({ default: 1 })
  minDeposit: number;
  @Prop({ default: 1 })
  minWithdraw: number;
  @Prop({ default: -1 })
  numberOfDecimal: number;
  @Prop({ default: 1 })
  withdrawFee: number;
  @Prop({ default: false })
  isWithdraw: boolean;
  @Prop({ default: false })
  isDeposit: boolean;
  @Prop({ default: null, trim: true })
  messageWithdraw: string;
  @Prop({ default: null, trim: true })
  messageDeposit: string;
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Symbol',
    default: null,
  })
  symbol: Types.ObjectId;
}

export const NetworkSchema = SchemaFactory.createForClass(Network);
