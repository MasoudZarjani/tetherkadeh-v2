import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { WalletStatus } from '../enums/WalletStatus.enum';
import { WalletType } from '../enums/WalletType.enum';
import { WalletTransactionType } from '../enums/WalletTransactionType';
import { WalletBlockType } from '../enums/WalletBlockType.enum';

export type WalletDocument = Wallet & Document;

@Schema({ timestamps: true })
export class Wallet {
  @Prop({ default: null, trim: true })
  coin: string;
  @Prop({ default: null, trim: true })
  destinationTag: string;
  @Prop({ default: null, trim: true })
  address: string;
  @Prop({ default: null, trim: true })
  note: string;
  @Prop({ default: null, trim: true })
  transactionId: string;
  @Prop({ default: null, trim: true })
  pairSymbol: string;
  @Prop({ default: null, trim: true })
  side: string;
  @Prop({ default: null, trim: true })
  trackingCode: string;
  @Prop({ default: null, trim: true })
  token: string;
  @Prop({ default: 0 })
  amount: number;
  @Prop({ default: 0 })
  fee: number;
  @Prop({ default: 0 })
  price: number;
  @Prop({ default: false })
  isManual: boolean;
  @Prop({ default: 1 })
  originalPrice: number;
  @Prop({ default: null, trim: true })
  gateway: string;
  @Prop({ default: 1 })
  priceFiat: number;
  @Prop({ default: null, trim: true })
  reason: string;
  @Prop({ default: 0 })
  verifyCode: number;
  @Prop({
    type: String,
    enum: WalletStatus,
    default: WalletStatus.Active,
  })
  status: WalletStatus;
  @Prop({
    type: String,
    enum: WalletType,
    default: WalletType.Deposit,
  })
  type: WalletType;
  @Prop({
    type: String,
    enum: WalletTransactionType,
    default: WalletTransactionType.Order,
  })
  transactionType: WalletTransactionType;
  @Prop({
    type: String,
    enum: WalletBlockType,
    default: WalletBlockType.NormalOrder,
  })
  blockedFor: WalletBlockType;
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    default: null,
  })
  user: Types.ObjectId;
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Network',
    default: null,
  })
  network: Types.ObjectId;
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Order',
    default: null,
  })
  orderBook: Types.ObjectId;
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Wallet',
    default: null,
  })
  wallet: Types.ObjectId;
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'BankAccount',
    default: null,
  })
  bankAccount: Types.ObjectId;
}

const WalletSchema = SchemaFactory.createForClass(Wallet);

WalletSchema.pre<WalletDocument>('save', async function (next) {
  const wallet = this;
  const WalletModel: any = wallet.constructor;
  try {
    const fiveSecondsAgo = new Date(new Date().getTime() - 5 * 1000);

    const existingWallet = await WalletModel.findOne({
      amount: wallet.amount,
      coin: wallet.coin,
      user: wallet.user,
      type: wallet.type,
      transactionType: wallet.transactionType,
      createdAt: {
        $gt: fiveSecondsAgo,
      },
    });
    if (!existingWallet) {
      next();
    } else {
      console.log('Existing  Wallet');
    }
  } catch (error) {
    next(error);
  }
});

export { WalletSchema };
